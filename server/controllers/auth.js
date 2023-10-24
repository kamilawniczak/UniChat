const jwt = require("jsonwebtoken");

const User = require("../models/user");
const otpGenerator = require("otp-generator");
const filterObject = require("../utils/filterObject");

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

exports.forgotPassword = async (req, res, next) => {};
exports.resetPassword = async (req, res, next) => {};
