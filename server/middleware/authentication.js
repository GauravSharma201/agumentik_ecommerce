const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: `please login to access this resource` });
    }
    let decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `you are not authorize to access this resource` });
    }
    next();
  };
};
