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

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0.01,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    availableCount: {
      type: Number,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
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

module.exports = mongoose.model("Product", productSchema);
