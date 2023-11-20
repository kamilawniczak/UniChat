const FriendRequest = require("../models/FriendRequest");
const GroupMessage = require("../models/group_messages");
const Message = require("../models/message");
const User = require("../models/user");
const filterObject = require("../utils/filterObject");

exports.updateMe = async (req, res, next) => {
  const { user } = req;

  const filteredBody = filterObject(
    req.body,
    "firstName",
    "lastName",
    "about",
    "avatar"
  );

  const updated_user = await User.findByIdAndUpdate(user._id, filteredBody, {
    new: true,
    validateModifieldOnly: true,
  });

  return res.status(200).json({
    status: "success",
    data: updated_user,
    message: "Profile Updtd successfully",
  });
};

exports.getUsers = async (req, res, next) => {
  const this_user = req.user;

  const users = await User.find({ verified: true }).select(
    "firstName lastName _id"
  );

  const restOfUsers = users.filter(
    (user) =>
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== this_user._id
  );

  return res.status(200).json({
    status: "success",
    data: restOfUsers,
    message: "User found successfully",
  });
};
exports.getFriends = async (req, res, next) => {
  const this_user = await User.findById(req.user._id.valueOf());

  const this_user_friends = await Promise.all(
    this_user.friends.map(async (friend) => {
      return await User.findById(friend.valueOf()).select(
        "_id firstName lastName"
      );
    })
  );

  return res.status(200).json({
    status: "success",
    data: this_user_friends,
    message: "Friend found successfully",
  });
};
exports.getRequest = async (req, res, next) => {
  const requests = await FriendRequest.find({
    reciever: req.user._id.valueOf(),
  })
    .populate("sender")
    .select("_id firstName lastName");

  return res.status(200).json({
    status: "success",
    data: requests,
    message: "Friend found successfully",
  });
};
exports.uploadFile = async (req, res) => {
  const { room_id, msgId, files, chat_type } = req.body;
  let complitedMsg = {};

  if (chat_type === "OneToOne") {
    const conversation = await Message.findById(room_id);

    const selected_message = conversation.messages.find(
      (message) => message._id.toString() === msgId
    );

    if (!selected_message) {
      return res.status(500).json({ message: "Selected message not found" });
    }

    selected_message.file = files;

    complitedMsg = await conversation.save({
      new: true,
      validateModifiedOnly: true,
    });
  }
  if (chat_type === "OneToMany") {
    const conversation = await GroupMessage.findById(room_id);

    const selected_message = conversation.messages.find(
      (message) => message._id.toString() === msgId
    );

    if (!selected_message) {
      return res.status(500).json({ message: "Selected message not found" });
    }

    selected_message.file = files;

    complitedMsg = await conversation.save({
      new: true,
      validateModifiedOnly: true,
    });
  }

  //TODO eimt signa to user

  try {
    return res.status(200).json({ message: "file uploaded successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
