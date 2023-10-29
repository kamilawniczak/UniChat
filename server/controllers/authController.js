const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailService = require("../services/mailer");
const User = require("../models/user");
const otpGenerator = require("otp-generator");
const otp = require("../Templates/Mail/otp");
const resetPassword = require("../Templates/Mail/ResetPassword");
const filterObject = require("../utils/filterObject");
const { promisify } = require("util");

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

exports.register = async (req, res, next) => {
  const { email } = req.body;

  const filteredBody = filterObject(
    req.body,
    "firstName",
    "lastName",
    "password",
    "email"
  );

  const existing_user = await User.findOne({ email });

  if (existing_user && existing_user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email already in use, Please login.",
    });
  } else if (existing_user) {
    await User.findOneAndUpdate({ email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });

    req.userId = existing_user._id;
    next();
  } else {
    const new_user = await User.create(filteredBody);

    req.userId = new_user._id;
    next();
  }
};

exports.sendOTP = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is

  const user = await User.findByIdAndUpdate(userId, {
    otp_expiry_time,
  });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });

  mailService.sendEmail({
    from: "shreyanshshah242@gmail.com",
    to: user.email,
    subject: "Verification OTP",
    html: otp(user.firstName, new_otp),
    attachments: [],
  });

  res.status(200).json({
    status: "success",
    message: "OTP Sent Successfully!",
  });
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });

    return;
  }

  // OTP is correct

  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token: token,
    user_id: user._id,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Both email and password are required",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    token,
  });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ").at(1);
  } else if (req.cookies.jwt) {
    token.req.cookies.jwt;
  } else {
    res
      .status(400)
      .json({ status: "error", message: "You are not logged in!" });
    return;
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

  const this_user = await User.findById(decoded.userId);

  if (!this_user) {
    res
      .status(400)
      .json({ status: "error", message: "The usr doesn't exists" });
  }

  if (this_user.changedPasswordAfter(decoded.iat)) {
    res.status(400).json({
      status: "error",
      message: " User recentyl updated password! Please log in again",
    });
  }

  req.user = this_user;
  next();
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).status({
      status: "error",
      message: "There is no user with given email address",
    });
    return;
  }

  const resetToken = user.createPasswordResetToken();

  try {
    user.save({
      passwordResetToken: resetToken,
      passwordResetExpires: Date.now() + 10 * 60 * 1000,
    });

    const resetURL = `http://localhost:3000/auth/new-password?token=${resetToken}`;

    mailService.sendEmail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: resetPassword(user.firstName, resetURL),
      attachments: [],
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    res.status(500).json({
      status: "error",
      message: "There was an error sending the email, Peas try again later",
    });
  }
};
exports.resetPassword = async (req, res, next) => {
  if (!req.body.token) {
    res.status(400).json({
      status: "error",
      message: "Token is missing",
    });
    return;
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({
      status: "error",
      message: "Token is Invalid or Expired",
    });
    return;
  }

  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
    token,
  });
};
