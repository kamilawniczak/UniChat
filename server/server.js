const app = require("./app");
const dotenv = require("dotenv");

const http = require("http");
const mongoose = require("mongoose");
const path = require("path");

const fs = require("fs");

dotenv.config({ path: "./config.env" });

const { Server } = require("socket.io");
const User = require("./models/user");
const FriendRequest = require("./models/FriendRequest");
const Message = require("./models/message");
const { lstat } = require("fs");
const { emit } = require("process");

const GroupMessage = require("./models/group_messages");

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB connect is successful");
  })
  .catch((error) => console.log(error));

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log("App running on port " + port);
});

io.on("connection", async (socket) => {
  const user_id = socket.handshake.query["user_id"];

  console.log(`User connected ${socket.id}`);

  if (user_id != null && Boolean(user_id)) {
    try {
      await User.findByIdAndUpdate(user_id, {
        socket_id: socket.id,
        status: "Online",
      });
    } catch (e) {
      console.log(e);
    }
  }
  socket.on("logout", async ({ user_id }) => {
    await User.findByIdAndUpdate(user_id, {
      status: "Offline",
    });
  });

  // We can write our socket event listeners in here...
  socket.on("friend_request", async (data) => {
    const to = await User.findById(data.to).select("socket_id");
    const from = await User.findById(data.from).select("socket_id");

    if (to === from) return;

    // create a friend request
    await FriendRequest.create({
      sender: data.from,
      reciever: data.to,
    });
    // emit event request received to recipient

    io.to(to?.socket_id).emit("new_friend_request", {
      message: "New friend request received",
    });
    io.to(from?.socket_id).emit("request_sent", {
      message: "Request Sent successfully!",
    });
  });

  socket.on("accept_request", async (data) => {
    // accept friend request => add ref of each other in friends array
    const request_doc = await FriendRequest.findById(data.request_id);

    const sender = await User.findById(request_doc.sender.valueOf());
    const reciever = await User.findById(request_doc.reciever.valueOf());

    sender.friends.push(request_doc.reciever.valueOf());
    reciever.friends.push(request_doc.sender.valueOf());

    await reciever.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);

    io.to(sender?.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
    io.to(reciever?.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
    return;
  });

  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await Message.find({
      members: { $all: [user_id] },
    }).populate("members", "firstName lastName avatar _id email status");

    await callback(existing_conversations);
  });

  socket.on("start_conversation", async (data, callback) => {
    const { to, from } = data;

    try {
      const existing_conversations = await Message.find({
        members: { $size: 2, $all: [to, from] },
      }).select("members");

      if (existing_conversations.length === 0) {
        let new_chat = await Message.create({
          members: [to, from],
        });

        const chat = await Message.findById(new_chat._id.toString()).populate(
          "members",
          "firstName lastName _id email status socket_id"
        );

        chat.members.forEach((mem) => {
          io.to(mem.socket_id).emit("start_chat", chat);
        });
      }
    } catch (error) {
      console.error("Error in start_conversation:", error);
    }
  });

  socket.on("get_messages", async (data, callback) => {
    try {
      const { messages } = await Message.findById(data.room_id)
        .populate("messages.reaction.by", "firstName lastName")
        .select("messages");

      const prepearedMessages = messages.map((msg) => {
        if (msg.reply) {
          const replayedMsg = messages.find(
            (message) => message._id.toString() === msg.reply.toString()
          );

          const message = {
            to: msg.to,
            from: msg.from,
            type: msg.type,
            subtype: msg.subtype,
            created_at: msg.created_at,
            text: msg.text,
            reply: msg.repy,
            replyType: msg.replyType,
            file: msg.file,
            starredBy: msg.starredBy,
            reaction: msg.reaction,
            _id: msg._id,
            replyData: {
              text: replayedMsg?.text,
              file: replayedMsg?.file,
              from: replayedMsg?.from,
              created_at: replayedMsg?.created_at,
            },
          };

          return replayedMsg ? message : msg;
        } else {
          return msg;
        }
      });

      callback(prepearedMessages);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("text_message", async (data, callback) => {
    const {
      message,
      file,
      conversation_id,
      from,
      to,
      type,
      subtype,
      reply,
      replyType,
    } = data;
    console.log(
      message,
      file,
      conversation_id,
      from,
      to,
      type,
      subtype,
      reply,
      replyType
    );
    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    const new_message = {
      to: to,
      from: from,
      type: type,
      subtype: subtype || "Text",
      created_at: Date.now(),
      text: message,
      file,
      reply,
      replyType,
      reaction: [],
    };

    const chat = await Message.findById(conversation_id);
    chat.messages.push(new_message);

    const msg = await chat.save({
      new: true,
      validateModifiedOnly: true,
    });

    let lastMessage = msg.messages.at(-1);

    // console.log(lastMessage);

    if (lastMessage.reply) {
      const replayedMsg = msg.messages.find(
        (message) => message._id?.toString() === lastMessage.reply?.toString()
      );
      if (replayedMsg) {
        lastMessage = {
          to: lastMessage.to,
          from: lastMessage.from,
          type: lastMessage.type,
          subtype: lastMessage.subtype,
          created_at: lastMessage.created_at,
          text: lastMessage.text,
          reply: lastMessage.repy,
          replyType: lastMessage.replyType,
          file: lastMessage.file,
          starredBy: lastMessage.starredBy,
          reaction: lastMessage.reaction,
          _id: lastMessage._id,
          replyData: {
            text: replayedMsg.text,
            file: replayedMsg.file,
            from: replayedMsg.from,
            created_at: replayedMsg.created_at,
            type: replayedMsg.subtype,
            created_at: replayedMsg.created_at,
          },
        };
      }
    }

    callback(lastMessage._id);

    io.to(to_user?.socket_id).emit("new_message", {
      user_info: {
        id: from_user._id,
        firstName: from_user.firstName,
        lastName: from_user.lastName,
      },
      conversation_id,
      message: lastMessage,
    });

    io.to(from_user?.socket_id).emit("new_message", {
      conversation_id,
      message: lastMessage,
    });
  });

  socket.on("pinnedConversation", async ({ user_id, room_id }, callback) => {
    const exists = await Message.findById(room_id);

    if (exists) {
      const { pinnedBy } = exists;
      const isPinned = pinnedBy.includes(user_id);

      if (!isPinned) {
        exists.pinnedBy.push(user_id);
        await exists.save({
          new: true,
          validateModifiedOnly: true,
        });
      } else {
        exists.pinnedBy = pinnedBy.filter(
          (userId) => userId.toString() !== user_id
        );

        await exists.save({
          new: true,
          validateModifiedOnly: true,
        });
      }

      await callback(exists);
    }
  });
  socket.on("deleteConversation", async ({ room_id, user_id }, callback) => {
    const { members } = await Message.findByIdAndDelete(room_id)
      .populate("members", "socket_id")
      .select("members");

    members.forEach((member) => {
      if (member._id.toString() === user_id) return;
      const socket_id = member.socket_id;
      io.to(socket_id).emit("deletedDirectConversationClientSide", { room_id });
    });

    callback({ message: "conversation deleted successfully", room_id });
  });

  //------------------------group------------------------------------------

  socket.on("start_group_conversation", async ({ title, members, user_id }) => {
    try {
      const new_chat = await GroupMessage.create({
        members,
        title,
      });

      const chat = await GroupMessage.findById(new_chat._id.toString())
        .populate({
          path: "members",
          select: "firstName lastName _id email status socket_id",
        })
        .select("title");

      chat.members.forEach((mem) => {
        io.to(mem.socket_id).emit("start_group_chat", chat);
      });
    } catch (error) {
      console.error("Error in start_conversation:", error);
    }
  });

  socket.on("get_group_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await GroupMessage.find({
      members: { $all: [user_id] },
    }).populate(
      "members",
      "firstName lastName avatar _id email status sockte_id"
    );

    await callback(existing_conversations);
  });
  socket.on("get_group_messages", async (data, callback) => {
    try {
      const { messages } = await GroupMessage.findById(data.room_id)
        .populate("messages.reaction.by", "firstName lastName")
        .select("messages");
      const prepearedMessages = messages.map((msg) => {
        if (msg.reply) {
          const replayedMsg = messages.find(
            (message) => message._id.toString() === msg.reply.toString()
          );

          const message = {
            to: msg.to,
            from: msg.from,
            type: msg.type,
            subtype: msg.subtype,
            created_at: msg.created_at,
            text: msg.text,
            reply: msg.repy,
            file: msg.file,
            starredBy: msg.starredBy,
            reaction: msg.reaction,
            _id: msg._id,
            replyData: {
              text: replayedMsg.text,
              file: replayedMsg.file,
              from: replayedMsg.from,
              created_at: replayedMsg.created_at,
              replyType: msg.replyType,
            },
          };
          return replayedMsg ? message : msg;
        } else {
          return msg;
        }
      });

      callback(prepearedMessages);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("text_group_message", async (data, callback) => {
    const {
      message,
      file,
      conversation_id,
      from,
      to,
      type,
      subtype,
      reply,
      replyType,
    } = data;

    const from_user = await User.findById(from);

    const new_message = {
      to: to,
      from: from,
      type: type,
      subtype: subtype || "Text",
      created_at: Date.now(),
      text: message,
      file,
      reply,
      replyType,
      reaction: [],
    };

    const chat = await GroupMessage.findById(conversation_id);
    chat.messages.push(new_message);
    const msg = await chat.save({
      new: true,
      validateModifiedOnly: true,
    });

    let lastMessage = msg.messages.at(-1);

    if (lastMessage.reply) {
      const replayedMsg = msg.messages.find(
        (message) => message._id?.toString() === lastMessage.reply?.toString()
      );
      if (replayedMsg) {
        lastMessage = {
          to: lastMessage.to,
          from: lastMessage.from,
          type: lastMessage.type,
          subtype: lastMessage.subtype,
          created_at: lastMessage.created_at,
          text: lastMessage.text,
          reply: lastMessage.repy,
          replyType: lastMessage.replyType,
          file: lastMessage.file,
          starredBy: lastMessage.starredBy,
          reaction: lastMessage.reaction,
          _id: lastMessage._id,
          replyData: {
            text: replayedMsg.text,
            file: replayedMsg.file,
            from: replayedMsg.from,
            created_at: replayedMsg.created_at,
            type: replayedMsg.subtype,
            created_at: replayedMsg.created_at,
          },
        };
      }
    }

    callback(lastMessage._id);

    for (const friend of to) {
      const to_user = await User.findById(friend).select("socket_id");

      io.to(to_user?.socket_id).emit("new_group_message", {
        user_info: {
          id: from_user._id,
          firstName: from_user.firstName,
          lastName: from_user.lastName,
        },
        conversation_id,
        message: lastMessage,
      });
    }
    io.to(from_user?.socket_id).emit("new_group_message", {
      conversation_id,
      message: lastMessage,
    });
  });
  socket.on(
    "deleteGroupConversation",
    async ({ room_id, user_id }, callback) => {
      const { members } = await GroupMessage.findByIdAndDelete(room_id)
        .populate("members", "socket_id")
        .select("members");

      members.forEach((member) => {
        if (member._id.toString() === user_id) return;
        const socket_id = member.socket_id;
        io.to(socket_id).emit("deletedGroupConversationClientSide", {
          room_id,
        });
      });

      callback({ message: "conversation deleted successfully", room_id });
    }
  );

  socket.on(
    "pinnedGroupConversation",
    async ({ user_id, room_id }, callback) => {
      const exists = await GroupMessage.findById(room_id);
      if (exists) {
        const { pinnedBy } = exists;
        const isPinned = pinnedBy.includes(user_id);
        if (!isPinned) {
          exists.pinnedBy.push(user_id);
          await exists.save({
            new: true,
            validateModifiedOnly: true,
          });
        } else {
          exists.pinnedBy = pinnedBy.filter(
            (userId) => userId.toString() !== user_id
          );
          await exists.save({
            new: true,
            validateModifiedOnly: true,
          });
        }
        await callback(exists);
      }
    }
  );
  //------------------------------------------------------------------
  socket.on(
    "deleteMsg",
    async ({ msgId, chat_type, room_id, user_id }, callback) => {
      console.log(msgId, chat_type, room_id, user_id);
      let members = [];
      if (chat_type === "OneToOne") {
        const conversation = await Message.findById(room_id);

        conversation.messages = conversation.messages.filter(
          (msg) => msg._id.toString() !== msgId
        );

        conversation.save();

        members = conversation.members.filter(
          (mem) => mem.toString() !== user_id
        );
      }
      if (chat_type === "OneToMany") {
        console.log(msgId, chat_type, room_id, user_id);
        const conversation = await GroupMessage.findById(room_id);

        conversation.messages = conversation.messages.filter(
          (msg) => msg._id.toString() !== msgId
        );

        conversation.save();

        members = await conversation.members.filter(
          (mem) => mem.toString() !== user_id
        );
      }

      callback();

      await Promise.all(
        members.map(async (mem) => {
          const id = mem.toString();
          const { socket_id } = await User.findById(id).select("socket_id");
          io.to(socket_id).emit("deletedMessage", {
            msgId,
            room_id,
            chat_type,
          });
        })
      );
    }
  );

  socket.on("upload-file", async ({ room_id, msgId, files, chat_type }) => {
    let completedMsg = {};
    let chat = [];

    if (chat_type === "OneToOne") {
      const conversation = await Message.findById(room_id);

      const selected_message = conversation.messages.find(
        (message) => message._id.toString() === msgId
      );

      if (!selected_message) {
        return;
      }

      selected_message.file = files;

      completedMsg = await conversation.save({
        new: true,
        validateModifiedOnly: true,
      });

      chat = await Message.findById(room_id)
        .populate("members", "socket_id")
        .select("members");
    }
    if (chat_type === "OneToMany") {
      const conversation = await GroupMessage.findById(room_id);

      const selected_message = conversation.messages.find(
        (message) => message._id.toString() === msgId
      );

      if (!selected_message) {
        return;
      }

      selected_message.file = files;

      completedMsg = await conversation.save({
        new: true,
        validateModifiedOnly: true,
      });

      chat = await GroupMessage.findById(room_id)
        .populate("members", "socket_id")
        .select("members");
    }

    completedMsg = completedMsg.messages.filter(
      (msg) => msg._id.toString() === msgId
    );

    if (chat && chat.members) {
      chat.members.forEach((mem) => {
        io.to(mem.socket_id).emit("receiveFiles", ...completedMsg);
      });
    } else {
      console.warn("chat.members is undefined. No action taken.");
    }
  });
  socket.on(
    "reactToMsg",
    async ({ emoji, msgId, room_id, chat_type, user_id }) => {
      const newReaction = {
        by: user_id,
        reaction: emoji,
      };
      let conversation;
      let updatedConversation;

      try {
        if (chat_type === "OneToOne") {
          conversation = await Message.findById(room_id).populate(
            "members",
            "firstName lastName socket_id"
          );
        }
        if (chat_type === "OneToMany") {
          conversation = await GroupMessage.findById(room_id).populate(
            "members",
            "firstName lastName socket_id"
          );
        }

        const msg = conversation.messages.find(
          (mess) => mess._id.toString() === msgId
        );
        const reaction = msg.reaction.filter(
          (reaction) => reaction.by.toString() === user_id
        );
        if (reaction.length === 0) {
          msg.reaction.push(newReaction);
        } else {
          if (reaction.at(0).reaction === emoji) {
            msg.reaction = msg.reaction.filter(
              (reaction) => reaction.by.toString() !== user_id
            );
          }
          if (reaction.at(0).reaction !== emoji) {
            msg.reaction = msg.reaction.map((reaction) =>
              reaction.by.toString() === user_id ? newReaction : reaction
            );
          }
        }
        await conversation.save();

        if (chat_type === "OneToOne") {
          updatedConversation = await Message.findById(room_id)
            .populate("messages.reaction.by", "firstName lastName")
            .select("messages");
        }
        if (chat_type === "OneToMany") {
          updatedConversation = await GroupMessage.findById(room_id)
            .populate("messages.reaction.by", "firstName lastName")
            .select("messages");
        }

        const updatedMsg = updatedConversation.messages.find(
          (mess) => mess._id.toString() === msgId
        );

        const newReactionObject = updatedMsg.reaction;
        conversation.members.forEach((member) => {
          io.to(member?.socket_id).emit("reactionToMsg", {
            room_id,
            msgId,
            reaction: newReactionObject,
            chat_type,
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  );
  socket.on("setStatus", async ({ user_id, friends, online }) => {
    const this_user_id = socket.handshake.query["user_id"];
    for (const friend of friends) {
      const user = await User.findById(friend).select("socket_id");
      io.to(user.socket_id).emit("statusChanged", {
        to: user._id,
        online,
        from: this_user_id,
      });
    }
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
