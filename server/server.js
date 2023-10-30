const app = require("./app");
const dotenv = require("dotenv");
const http = require("http");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const { Server } = require("socket.io");
const User = require("./models/user");

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
console.log(process.env.PORT);
const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log("App running on port " + port);
});

io.on("connection", async (socket) => {
  console.log(socket);

  const userId = socket.handshake.query["user_id"];
  const socketId = socket.id;
  console.log(`User connected ${socketId}`);

  if (userId) {
    await User.findByIdAndUpdate(userId, {
      socketId,
    });
  }

  socket.on("friendRequest", async (data) => {
    console.log(data);
    console.log(data.to);

    const to = await User.findById(data.to).emit("new_friend_request", {});
    io.to(to.socket_id);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
