const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = async (req, res, next) => {
  try {
    let myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    let { name, email, password, address } = req.body;

    let response = await User.create({
      name: name,
      email: email,
      password: password,
      address: address,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    sendToken(response, res, 201, "user Created");
  } catch (error) {
    console.log("this is reg error: ", error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: `please enter email/password` });
    }
    let response = await User.find({ email: email }).select("+password");
    if (!response[0]) {
      return res.status(401).json({ message: `invalid email/password` });
    }
    let match = await response[0].comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: `invalid email/password` });
    }
    sendToken(response[0], res, 200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res
      .status(200)
      .json({ success: true, message: `user logged out successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    let response = await user.findById(req.user.id);
    res.status(200).json({ response, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
