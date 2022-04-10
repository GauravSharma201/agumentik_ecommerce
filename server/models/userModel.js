const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `can't leave this emtpy, please type a valid entry`],
    minlength: [3, `should be atleast 3 characters long`],
    maxlength: [30, `character exceeds the allowed limit`],
  },
  email: {
    type: String,
    required: [true, `can't leave this empty`],
    validate: [validator.isEmail, `please enter a valid email id`],
    unique: true,
  },
  password: {
    type: String,
    required: [true, `can't leave this empty`],
    minlength: [8, `should be atleast 8 characters long`],
    select: false,
  },
  address: {
    type: String,
    required: [true, `can't leave this empty`],
    minlength: [9, `should be atleast 9 characters long`],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  created_At: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
