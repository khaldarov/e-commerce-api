const Product = require("../models/product");
const Admin = require("../models/admin");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const signin = async (req, res) => {
  try {
    if (req?.session?.user) {
      return res.status(200).json({ message: `you are already logged in as ${req.session.user.username}` });
    }
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      if (isMatch) {
        res.setHeader("admin", admin.id);
        req.session.user = admin;
        req.user = admin;
        return res.status(200).json({ message: `welcome back ${admin.username}!` });
      }
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const signout = async (req, res) => {
  if (!req.session?.user) {
    return res.status(400).reditrect("/customer/signin");
  }
  await req.session.destroy();
  return res.redirect("/customer");
};

const seeAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isAdmin: true });
    return res.status(200).json(admins);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const match = {};
    if (req.query.id) {
      match._id = req.query.id;
    }
    if (req.query.username) {
      match.username = { $regex: req.query.username, $options: "i" };
    }
    if (req.query.email) {
      match.email = { $regex: req.query.email, $options: "i" };
    }
    if (req.query.phone) {
      match.phone = { $regex: req.query.phone, $options: "i" };
    }
    return res.status(200).json(await User.find(match));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const update = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = { $set: req.body };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(filter, update, options);

    if (!updatedUser) {
      const updateItem = await Product.findOneAndUpdate(filter, update, options);
      if (!updateItem) {
        return res.status(400).json({ error: `couldn't find id` });
      }
      return res.status(200).json(updateItem);
    }

    return res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const searchItems = async (req, res) => {
  try {
    const match = {};
    if (req.query.id) {
      match._id = req.query.id;
    }
    if (req.query.title) {
      match.title = { $regex: req.query.title, $options: "i" };
    }
    if (req.query.image) {
      match.image = { $regex: req.query.image, $options: "i" };
    }
    if (req.query.price) {
      const price = req.query.price.split("-");
      parseInt(price[0]);
      parseInt(price[1]);
      match.price = { $gte: price[0], $lte: price[1] };
    }
    if (req.query.description) {
      match.description = { $regex: req.query.description, $options: "i" };
    }
    if (req.query.genre) {
      match.genre = { $regex: req.query.genre, $options: "i" };
    }
    return res.status(200).json(await Product.find(match));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const addItems = async (req, res) => {
  try {
    const { title, image, price, description, availableCount, genre } = req.body;

    const product = await Product.create({
      title,
      image,
      price,
      description,
      availableCount,
      genre,
    });
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const newAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const uname1 = await User.findOne({ username: req.body.username });
    const mail1 = await User.findOne({ email: `${req.body.username}@e-commerce.com` });
    if (uname1) {
      return res.status(400).json({ message: `${uname1.username} is used by an admin` });
    }
    if (mail1) {
      return res.status(400).json({ message: `${mail1.email} is used by an admin` });
    }

    const uname0 = await User.findOne({ username: req.body.username });
    const mail0 = await User.findOne({ email: `${req.body.username}@e-commerce.com` });
    if (uname0) {
      return res.status(400).json({ message: `${uname0.username} is used by a user` });
    }
    if (mail0) {
      return res.status(400).json({ message: `${mail0.email} is used by a user` });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      email: `${username}@e-commerce.com`,
      isAdmin: true,
      password_hash,
    });
    return res.status(200).json(newAdmin);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// const updateItems = async (req, res) => {
//   try {
//     const filter = { _id: req.params.id };
//     const update = { $set: req.body };

//     const newProduct = await Product.findOneAndUpdate(filter, update, { new: true });
//     res.status(200).json(newProduct);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

const deleteItem = async (req, res) => {
  try {
    const deleteItem = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(`item "${deleteItem.title}" has been deleted`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUser = await User.findByIdAndDelete(id);
    if (req.session.user._id === id) {
      res.status(403).json({ message: "You can't delete yourself" });
    }
    res.status(200).json(`user "${deleteUser.username}" has been deleted`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const signedInAdmin = req.session.user._id; /////////////////////////////////  these lines
    const admin = await User.findById(signedInAdmin); //////////////////////////  to allow only
    if (admin.username !== `khaldarov`) {
      return res.status(403).json({ message: "You can't delete an admin" }); ////  khaldarov to
    } ///////////////////////////////////////////////////////////////////////////  delete admins

    const deleteAdmin = await Admin.findByIdAndDelete(id);
    return res.status(200).json(`admin "${deleteAdmin.username}" has been deleted`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const account = async (req, res) => {
  try {
    const filter = { _id: req.session.user._id };
    const options = { cart: 0, orders: 0 };
    const user = await Admin.findById(filter, options);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const accountPassword = async (req, res) => {
  try {
    const filter = { _id: req.session.user._id };
    const options = { new: true };
    const { password0, password1 } = req.body;
    if (password0 !== password1) {
      return res.status(400).json({ message: `passwords do not match` });
    }

    if (password0) {
      const password_hash = await bcrypt.hash(password0, 10);
      const update = { $set: { password_hash } };

      await Admin.findOneAndUpdate(filter, update, options);
      return res.status(200).json({ message: `password updated successfully` });
    } else return res.status(200).json({ message: `please check your profile` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  signin,
  signout,
  seeAdmins,
  getUsers,
  update,
  searchItems,
  addItems,
  newAdmin,
  // updateItems,
  deleteItem,
  deleteUser,
  deleteAdmin,
  account,
  accountPassword,
};
