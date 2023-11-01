const FriendRequest = require("../models/FriendRequest");
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
  const this_user = await User.findById(req.user._id);

  return res.status(200).json({
    status: "success",
    data: this_user.friends,
    message: "Friend found successfully",
  });
};
exports.getRequest = async (req, res, next) => {
  const request = await FriendRequest.find({ reciever: req.user._id }).populate(
    "sender",
    "_id firstName lastName"
  );

  return res.status(200).json({
    status: "success",
    data: request,
    message: "Friend found successfully",
  });
};
