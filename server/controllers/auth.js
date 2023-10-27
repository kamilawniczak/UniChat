const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailService = require("../services/mailer");
const User = require("../models/user");
const otpGenerator = require("otp-generator");
const filterObject = require("../utils/filterObject");
const { promisify } = require("util");

const signToken = (userId) => {
  jwt.sign({ userId }, process.env.JWT_TOKEN);
};

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const filterBody = filterObject(
    req.body,
    "firstName",
    "lastName",
    "password"
  );

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.verfied) {
    res.status(400).json({
      status: "error",
      message: "Email is already in use, Pleas login",
    });
  } else if (existingUser) {
    await User.findOneAndUpdate({ email }, filterBody, {
      new: true,
      validateModifiedOnly: true,
    });

    req.useID = existingUser._id;
    next();
  } else {
    const newUser = await User.create(filterBody);
    req.useID = newUser._id;
    next();
  }
};

exports.sendOTP = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const otpExpiryTime = Date.now() + 10 * 60 * 1000;

  await User.findByIdAndUpdate(userId, {
    otp: new_otp,
    otpExpiryTime,
  });

  //TODO Send mail
  mailService.sendSGEmail({
    from: "contact@kamil.in",
    to: "example@gmail.com",
    subject: "OPT for UniCHat",
    text: `Yur OTP is ${new_otp}. This is valid for 10 minutes`,
  });

  res.status(200).json({
    status: "susscess",
    message: "OTP Sent Successfully",
  });
};

exports.verfyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
    if (!(await user.correctOTP)(otp, user.otp)) {
      res.status(400).json({
        status: "error",
        message: "OTP is incorrect",
      });
    }

    user.verfied = true;
    user.otp = undefined;

    await user.save({ new: true, validateModifiedOnly: true });

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      token,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "Both email and password are requied",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "logged successfully",
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

  const resetURL = `http://tawk.com/auth/reset-password/?code=${resetToken}`;

  try {
    res.status(200).json({
      status: "success",
      message: "Reset Password link sent to email",
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
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({
      status: "error",
      message: "Token is Invaid or Expired",
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
    message: "Password reseted successfully",
    token,
  });
};
