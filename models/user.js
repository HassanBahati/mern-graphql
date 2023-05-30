const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email address",
      ],
    },
    name: {
      type: String,
    },

    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
