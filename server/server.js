const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

const http = require("http");

const server = http.createServer(app);

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DBPASSWORD);

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

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
