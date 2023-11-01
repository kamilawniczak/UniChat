const app = require("./app");
const dotenv = require("dotenv");

const http = require("http");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: "./config.env" });

const { Server } = require("socket.io");
const User = require("./models/user");
const FriendRequest = require("./models/FriendRequest");

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000",
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
  console.log(socket);
  console.log(JSON.stringify(socket.handshake.query));

  const userId = socket.handshake.query["user_id"];
  const socketId = socket.id;
  console.log(`User connected ${socketId}`);

  if (Boolean(userId)) {
    await User.findByIdAndUpdate(userId, {
      socketId,
      status: "Online",
    });
  }

  socket.on("friendRequest", async (data) => {
    console.log(data);
    console.log(data.to);

    const to = await User.findById(data.to).select("socket_id");
    const from = await User.findById(data.from).select("socket_id");

    await FriendRequest.create({
      sender: data.from,
      reciever: data.to,
    });

    io.to(to.socket_id).emit("new_friend_request", {
      message: "New firiend request received",
    });

    io.to(from.socket_id).emit("request_sent", {
      message: "Request sent successfully",
    });
  });

  socket.on("accept_request", async (data) => {
    console.log(data);

    const request_doc = await FriendRequest.findById(data.request_id);
    console.log(request_doc);

    const sender = await User.findById(request_doc.sender);
    const reciever = await User.findById(request_doc.reciever);

    sender.friends.push(request_doc.reciever);
    reciever.friends.push(request_doc.sender);

    await reciever.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);

    io.to(sender.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
    io.to(reciever.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });

    socket.on("text_message", (data) => {
      console.log("Received message ", data);
    });

    socket.on("file_message", (data) => {
      console.log("Received message ", data);

      const fileExtension = path.extname(data.file.name);
      const fileName = `${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}_${crypto.randomUUID()}${fileExtension}`;
    });

    socket.on("end", async (data) => {
      if (data.user_id) {
        await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
      }

      console.log("closing connection");
      socket.disconnected(0);
    });
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
