const mongoose = require("mongoose");

/* const date = new Date();
const now_utc = Date.UTC(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
  date.getUTCHours(),
  date.getUTCMinutes(),
  date.getUTCSeconds()
);
console.log(new Date(now_utc));
console.log(date.toISOString()); */

const utc3 = new Date();

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      match: [/^[a-zA-Z0-9-_.]+@[a-z]+\.[a-z]{2,15}(\.[a-z]{2,3})?(\.[a-z]{2,3})?$/, `invalid email`],
      unique: true,
      required: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      // type: Date,
      type: String,
      default: utc3.toUTCString(),
    },
    updatedAt: {
      // type: Date,
      type: String,
      default: utc3.toUTCString(),
    },
  }
  // { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
