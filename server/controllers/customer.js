const User = require("../models/user");
const Product = require("../models/product");

const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { username, email, age, password } = req.body;
    const uname = await User.findOne({ username });
    if (!uname) {
      const uemail = await User.findOne({ email });
      if (!uemail) {
        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          username,
          email,
          age,
          password_hash,
        });

        res.setHeader("user", newUser.id);
        req.session.user = newUser;
        req.user = newUser;
        return res.status(200).json({ message: `signed up, and in, as ${newUser.username}` });

        // return res.status(200).json({ message: `User ${username} created successfully` });
      }
      return res.status(400).json({ error: `${uemail.email} is already used` });
    }
    return res.status(400).json({ error: `${uname.username} is already used` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const signin = async (req, res) => {
  try {
    if (req.session?.user) {
      return res.redirect("/customer");
    }

    ////////////////////////////////////////////////// current version
    const { usernameOrEmail, password } = req.body;
    const regex = new RegExp(/.+\@.+\..+/);

    if (!regex.test(usernameOrEmail)) {
      const user = await User.findOne({ username: usernameOrEmail });
      if (!user) {
        return res.status(400).json({ error: `username or password is incorrect` });
      }
      const isMatch = await bcrypt.compare(password, user?.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: `username or password is incorrect` });
      }
      if (user && isMatch) {
        res.setHeader("user", user.id);
        req.session.user = user;
        req.user = user;
        return res.status(200).json({ message: `signed in as ${user.username}` });
      }
    }

    if (regex.test(usernameOrEmail)) {
      const mail = await User.findOne({ email: usernameOrEmail });
      if (!mail) {
        return res.status(400).json({ error: `email or password is incorrect` });
      }
      const isMatch = await bcrypt.compare(password, mail?.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: `email or password is incorrect` });
      }
      if (mail && isMatch) {
        res.setHeader("user", mail.id);
        req.session.user = mail;
        req.user = mail;
        return res.status(200).json({ message: `signed in as ${mail.username}` });
      }
    }
    ////////////////////////////////////////////////// current version

    ////////////////////////////////////////////////// old version
    /* const { username, email, password } = req.body;

    if (username && password) {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: `username or password is incorrect` });
      }
      const isMatch = await bcrypt.compare(password, user?.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: `username or password is incorrect` });
      }
      if (user && isMatch) {
        res.setHeader("user", user.id);
        req.session.user = user;
        req.user = user;
        return res.status(200).json({ message: `signed in as ${user.username}` });
      }
    }

    if (email && password) {
      const mail = await User.findOne({ email });
      if (!mail) {
        return res.status(400).json({ error: `email or password is incorrect` });
      }
      const isMatch = await bcrypt.compare(password, mail?.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: `email or password is incorrect` });
      }
      if (mail && isMatch) {
        res.setHeader("user", mail.id);
        req.session.user = mail;
        req.user = mail;
        return res.status(200).json({ message: `signed in as ${mail.username}` });
      }
    } */
    ////////////////////////////////////////////////// old version
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const signout = async (req, res) => {
  // console.log(`THIS IS USER ${req.session.user._id}--`);
  // console.log(`THIS IS SESSION ${req.session._id}--`);
  if (!req.session?.user) {
    return res.status(400).reditrect("/customer/signin");
  }
  await req.session.destroy();
  return res.redirect("/customer");
};

const account = async (req, res) => {
  const filter = {
    _id: 1,
    username: 1,
    email: 1,
    age: 1,
    cart: 1,
    orders: 1,
  };
  const user = await User.findOne({ _id: req.session.user._id }, filter);
  return res.status(200).json(user);
};

const accountOrders = async (req, res) => {
  const user = await User.findOne({ _id: req.session.user._id });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const orders = user.orders;
  return res.status(200).json(orders);
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

      await User.findOneAndUpdate(filter, update, options);
      return res.status(200).json({ message: `password updated successfully` });
    } else return res.status(200).json({ message: `please check your profile` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const accountUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).redirect("/customer/account");
    }

    const regex = new RegExp(/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
    if (!regex.test(username)) {
      return res.status(400).json({ message: `invalid username` });
    }

    const filter = { _id: req.session.user._id };
    const update = { $set: { username } };
    const options = { new: true };
    const uname = await User.findOne({ username: req.body.username });

    // if (uname._id === req.session.user._id) {
    //   return res.status(400).json({ error: `you already use this username` });
    // }

    if (uname) {
      return res.status(400).json({ error: `${uname.username} is already in use` });
    }
    await User.findOneAndUpdate(filter, update, options);
    return res.status(200).json({ message: `username updated successfully` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const accountEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const regex = new RegExp(/.+\@.+\..+/);
    if (!regex.test(email)) {
      return res.status(400).json({ error: `invalid email` });
    }

    if (!email) {
      return res.status(400).redirect("/customer/account");
    }

    const filter = { _id: req.session.user._id };
    const update = { $set: { email } };
    const options = { new: true };
    const uemail = await User.findOne({ email: req.body.email });

    if (uemail) {
      return res.status(400).json({ error: `${uemail.email} is already in use` });
    }
    await User.findOneAndUpdate(filter, update, options);
    return res.status(200).json({ message: `email updated successfully` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const accountTerminate = async (req, res) => {
  try {
    if (!req.session) {
      return res.status(400).json({ message: "you're already signed out" });
    }

    const signedinUser = req.session.user._id;
    const user = await User.findById(signedinUser);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    await req.session.destroy();
    await user.remove();
    return res.redirect("/customer");
    // return res.status(200).json({ message: `user ${user.username} has been deleted successfully` });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const searchItems = async (req, res) => {
  try {
    const match = {};
    const options = {
      _id: 1,
      title: 1,
      image: 1,
      price: 1,
      description: 1,
    };
    if (req.query.id) {
      match._id = req.query.id;
    }
    if (req.query.title) {
      match.title = { $regex: req.query.title, $options: "i" };
    }
    if (req.query.genre) {
      match.genre = { $regex: req.query.genre, $options: "i" };
    }
    if (req.query.price) {
      const price = req.query.price.split("-");
      parseInt(price[0]);
      parseInt(price[1]);
      match.price = { $gte: price[0], $lte: price[1] };
    }
    return res.status(200).json(await Product.find(match, options));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

////////////////////////////////////////////////// constants, do not change
const addCartItems = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const signedinUser = req.session.user._id;
    const user = await User.findById(signedinUser);
    const product = await Product.findById(id);
    const cart = user?.cart;

    const title = product?.title;
    const formula = product.price * quantity;
    const total = Math.round(100 * formula) / 100;
    const foundItem = cart.find((item) => item.productId === id);

    if (!user || !product) {
      return res.status(400).json({ message: "user or product not found" });
    }

    const messageGood0 = { message: `${quantity} ${product.title} has been added to your cart` };
    const messageGood1 = { message: `${product.title} quantity has been updated to ${quantity}` };
    const messageNotFound = { message: `${product.title} was not found` };
    const messageQuantity = { message: `${quantity} is not a valid quantity` };
    const messageMax = { message: `max available quantity is ${product.availableCount}` };
    const messageRemove = { message: `${product.title} has been removed from your cart` };
    ////////////////////////////////////////////////// constants, do not change
    //
    //
    ////////////////////////////////////////////////// multi item cart
    if (!foundItem && 0 < quantity) {
      if (product.availableCount < quantity) {
        return res.status(200).json(messageMax);
      }
      cart.unshift({
        title: title,
        quantity: quantity,
        total: total,
        productId: id,
      });

      await user.updateOne({ cart });
      return res.status(200).json(messageGood0);
    }

    if (!foundItem && quantity <= 0) {
      return res.status(400).json(messageQuantity);
    }

    if (foundItem && quantity === foundItem?.quantity) {
      return res.status(200).json(cart);
    }

    if (foundItem && 0 < quantity) {
      foundItem.quantity = quantity;
      foundItem.total = total;

      if (product.availableCount < quantity) {
        foundItem.quantity = product.availableCount;
        foundItem.total = foundItem.quantity * product.price;
        await user.updateOne({ cart });
        return res.status(200).json(messageMax);
      }

      await user.updateOne({ cart });
      return res.status(200).json(messageGood1);
    }
    if (foundItem && quantity <= 0) {
      cart.splice(cart.indexOf(foundItem), 1);
      await user.updateOne({ cart });
      return res.status(200).json(messageRemove);
    }
    ////////////////////////////////////////////////// multi item cart
    //
    //
    ////////////////////////////////////////////////// constants, do not change
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
////////////////////////////////////////////////// constants, do not change

const emptyCartItems = async (req, res) => {
  try {
    const signedinUser = req.session.user;
    const user = await User.findById(signedinUser._id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    user.cart = [];
    await user.updateOne({ cart: [] });
    return res.status(200).json({ message: "cart emptied successfully" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

////////////////////////////////////////////////// constants, do not change
const checkoutItems = async (req, res) => {
  try {
    const utc3 = new Date();
    const signedinUser = req.session.user._id;
    const user = await User.findById(signedinUser);

    const cart = user?.cart;
    const orders = user?.orders;

    const formula = cart.reduce((acc, item) => acc + item.total, 0);
    const grandTotal = Math.round(100 * formula) / 100;

    const titles = cart.map((item) => item.title);

    const messageGood = { message: `your cart that includes ${titles} has been purchased successfully` };
    const messageBad = { message: `please check your cart and try again` };

    if (!user || !cart || cart.length <= 0) {
      return res.status(400).json(messageBad);
    }
    ////////////////////////////////////////////////// constants, do not change
    //
    //
    ////////////////////////////////////////////////// constants, do not change
    orders.unshift({
      products: cart,
      total: grandTotal,
      date: utc3.toUTCString(),
    });
    await user.save();

    for (let item of cart) {
      const product = await Product.findById(item.productId);
      product.availableCount -= item.quantity;
      await product.save();
    }

    await user.updateOne({ cart: [], orders });
    return res.status(200).json(messageGood);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  signup,
  signin,
  signout,
  account,
  accountOrders,
  accountPassword,
  accountUsername,
  accountEmail,
  accountTerminate,
  searchItems,
  addCartItems,
  emptyCartItems,
  checkoutItems,
};
////////////////////////////////////////////////// constants, do not change
