const express = require("express");
const router = express.Router();
const signinCheck = require("../middlewares/auth");
const customerController = require("../controllers/customer");

// all endpoints start with /customer

router.post("/signup", customerController.signup);

router.post("/signin", customerController.signin);

router.post("/signout", signinCheck(), customerController.signout);

router.get("/me", signinCheck(), customerController.account);

router.post("/me/orders", signinCheck(), customerController.accountOrders);

router.post("/me/password", signinCheck(), customerController.accountPassword);

router.post("/me/username", signinCheck(), customerController.accountUsername);

router.post("/me/email", signinCheck(), customerController.accountEmail);

router.post("/me/terminate", signinCheck(), customerController.accountTerminate);

router.get("/", customerController.searchItems);

router.post("/cart", signinCheck(), customerController.addCartItems);

router.post("/cart/empty", signinCheck(), customerController.emptyCartItems);

router.post("/checkout", signinCheck(), customerController.checkoutItems);

module.exports = router;
