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

// const cartSchema = new mongoose.Schema({
//   productId: {
//     type: String,
//     // default: "",
//   },
//   quantity: {
//     type: Number,
//     default: 0,
//   },
//   total: {
//     type: Number,
//     default: 0,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const orderSchema = new mongoose.Schema({
//   productId: {
//     type: String,
//     default: "",
//   },
//   order: {
//     type: [],
//   },
//   total: {
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    match: [/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, `invalid username`],
    unique: true,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    match: [/.+\@.+\..+/, `invalid email`],
    unique: true,
    required: true,
    lowercase: true,
  },
  age: {
    type: Number,
    min: [13, `You must be at least 13 years old`],
    match: [/^[0-9]{2,3}$/, `invalid age`],
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: {
    // type: cartSchema,
    type: [],
    default: [],
  },
  orders: {
    // type: orderSchema,
    type: [],
    // default: {},
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
});

module.exports = mongoose.model("User", userSchema);
