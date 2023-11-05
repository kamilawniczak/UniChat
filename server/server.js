const app = require("./app");
const dotenv = require("dotenv");

const http = require("http");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: "./config.env" });

const { Server } = require("socket.io");
const User = require("./models/user");
const FriendRequest = require("./models/FriendRequest");
const Message = require("./models/message");

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
      await User.findByIdAndUpdate(
        { _id: user_id },
        {
          socket_id: socket.id,
          status: "Online",
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
  socket.on("logout", async ({ user_id }) => {
    await User.findByIdAndUpdate(
      { _id: user_id },
      {
        status: "Offline",
      }
    );
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

  socket.on("start_conversation", async (data) => {
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
          "firstName lastName _id email status"
        );

        socket.emit("start_chat", chat);
      }
    } catch (error) {
      console.error("Error in start_conversation:", error);
    }
  });

  socket.on("get_messages", async (data, callback) => {
    try {
      const { messages } = await Message.findById(data.room_id).select(
        "messages"
      );
      callback(messages);
    } catch (error) {
      console.log(error);
    }
  });

  // Handle incoming text/link messages
  socket.on("text_message", async (data) => {
    const { message, conversation_id, from, to, type, subtype } = data;

    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    const new_message = {
      to: to,
      from: from,
      type: type,
      subtype: subtype || "Text",
      created_at: Date.now(),
      text: message,
    };

    const chat = await Message.findById(conversation_id);
    chat.messages.push(new_message);

    const msg = await chat.save({
      new: true,
      validateModifiedOnly: true,
    });
    const lastMessage = msg.messages.at(-1);

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

  socket.on("file_message", (data) => {
    console.log("Received message:", data);

    // data: {to, from, text, file}

    // Get the file extension
    const fileExtension = path.extname(data.file.name);

    // Generate a unique filename
    const filename = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${fileExtension}`;

    // upload file to AWS s3

    // create a new conversation if its dosent exists yet or add a new message to existing conversation

    // save to db

    // emit incoming_message -> to user

    // emit outgoing_message -> from user
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
