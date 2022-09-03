const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const url = process.env.ATLAS_URL;

const connectToMongo = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  db = mongoose.connection;

  db.once("open", () => {
    console.log("Database connected: Atlas");
  });

  db.on("error", (err) => {
    console.error("Database connection error: ", err);
  });
};

module.exports = connectToMongo;
