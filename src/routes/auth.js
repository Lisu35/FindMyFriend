const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../database/models/User");
const Shop = require("../database/models/Shop");
const requireLogin = require("../middleware/RequiredLogin");

const router = express.Router();

router.get("/customer/login", (req, res) => {
  res.render("log_in");
});

router.get("/shop/login", (req, res) => {
  res.render("log_in");
});

router.get("/register", (req, res) => {
  res.render("sign_up");
});

router.post("/customer/login", async (req, res) => {
  const { username, password } = req.body;
  const { valid, foundUser } = await User.isAuthenticated(username, password);
  if (valid) {
    req.session.user_id = foundUser._id;
    req.session.type = "customer";
    res.redirect("/home");
  } else {
    res.redirect("/auth/login");
  }
});

router.post("/shop/login", async (req, res) => {
  const { username, password } = req.body;
  const { valid, foundUser } = await Shop.isAuthenticated(username, password);
  if (valid) {
    req.session.user_id = foundUser._id;
    req.session.type = "shop";
    res.redirect("/home");
  } else {
    res.redirect("/auth/login");
  }
});

router.post("/register", async (req, res) => {
  const { username, password, email, type } = req.body;
  if (type == "customer") {
    const user = new User({
      name: username,
      email: email,
      password: password,
    });
    await user.save();
  } else if (type == "shop") {
    const shop = new Shop({
      name: username,
      email: email,
      password: password,
    });
    await shop.save();
    res.redirect("/auth/shop/login");
  }
  res.redirect("/auth/customer/login");
});

router.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/auth/login");
});

module.exports = router;