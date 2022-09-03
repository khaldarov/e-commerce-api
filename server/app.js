const express = require("express");
const connectToMongo = require("./db/connection");
const session = require("express-session");
const path = require("path");
const Product = require("./models/product");

const dotenv = require("dotenv");
dotenv.config();

const adminRoutes = require("./routes/admin");
const customerRoutes = require("./routes/customer");

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    name: "sid",
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("./server/views", path.join(__dirname, "views"));

app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);

app.get("/", (_, res) => {
  res.redirect("/customer/");
});

// app.get("/customer", async (req, res) => {
//   const products = await Product.find().sort({ createdAt: "desc" });
//   res.render("navbar", { products: products });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectToMongo();
});

module.exports = app;
