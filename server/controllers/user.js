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

  res
    .status(200)
    .json({
      status: "success",
      data: updated_user,
      message: "Profile Updtd successfully",
    });
};
