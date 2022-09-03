const express = require("express");
const isAdmin = require("../middlewares/admin");
const adminController = require("../controllers/admin");

const router = express.Router();

// all endpoints start with /admin

router.post("/secret/signin", adminController.signin);

router.post("/secret/signout", isAdmin(), adminController.signout);

router.get("/secret/admins", isAdmin(), adminController.seeAdmins);

router.get("/users", isAdmin(), adminController.getUsers);

router.put("/update/:id", isAdmin(), adminController.update);

router.get("/", isAdmin(), adminController.searchItems);

router.post("/add", isAdmin(), adminController.addItems);

router.post("/new-admin", isAdmin(), adminController.newAdmin);

// router.put("/update/:id", isAdmin(), adminController.updateItems);

router.delete("/delete/item/:id", isAdmin(), adminController.deleteItem);

router.delete("/delete/user/:id", isAdmin(), adminController.deleteUser);

router.delete("/secret/delete/admin/:id", isAdmin(), adminController.deleteAdmin);

router.get("/secret/account", isAdmin(), adminController.account);

router.post("/secret/account/password", isAdmin(), adminController.accountPassword);

module.exports = router;
