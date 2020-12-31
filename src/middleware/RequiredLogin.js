const express = require("express");
const User = require("../database/models/User");
const Shop = require("../database/models/Shop");

const requiredLogIn = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/auth/welcome");
  }
  next();
};

const shopRequiredLogIn = async (req, res, next) => {
  try {
    if (!req.session.user_id) {
      throw new Error();
    }
    _id = req.session.user_id;
    const shop = await Shop.findById(_id);
    req.shop = shop;
    next();
  } catch (e) {
    return res.redirect("/auth/welcome");
  }
};

module.exports = { requiredLogIn, shopRequiredLogIn };
