const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      to: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      from: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      type: {
        type: String,
        enum: ["msg", "file"],
      },
      subtype: {
        type: String,
        enum: ["img", "doc", "link", "reply", "text"],
      },
      created_at: {
        type: Date,
        default: Date.now(),
      },
      text: {
        type: String,
      },
      file: [
        {
          type: String,
        },
      ],
    },
  ],
  pinnedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  title: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const GroupMessage = new mongoose.model("GroupMessage", groupMessageSchema);

module.exports = GroupMessage;