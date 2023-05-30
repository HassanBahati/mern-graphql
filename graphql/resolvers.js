const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async function ({ userInput }, req) {
    // args = userInput data
    // const email = args.userInput.email
    const errors = [];

    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email is invalid" });
    }

    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password is too short" });
    }

    if (errors.length > 0) {
      const error = new Error("invalid input");
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });

    if (existingUser) {
      const error = new Error("User exists already");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(userInput.password, 12);

    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPassword,
    });

    const createdUser = await user.save();
    // createdUser._doc = meta data returned by mongoose
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("user not found");

      error.code = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("password is incorrect");

      error.code = 401;

      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "sometingsecreet",
      { expiresIn: "1hr" }
    );
    return { token: token, userId: user._id.toString() };
  },
};
