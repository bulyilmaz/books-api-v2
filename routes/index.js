var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/User.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST /register
router.post("/register", async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const userModel = new UserModel({
      username,
      password: hash
    });
    const data = await userModel.save();

    res.json(data);
  } catch(error) {
    res.json(error);
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    const data = await UserModel.findOne({
      username
    });

    if (data === null) {
      res.json({
        message: "User not found!"
      });

      return;
    }

    const result = await bcrypt.compare(password, data.password);

    if (!result) {
      res.json({
        message: "Wrong password!"
      });

      return;
    }

    const payload = {
      username
    };
    const token = jwt.sign(payload, req.app.get("api_secret_key"), {
      expiresIn: 720
    });

    res.json({
      token
    });
  } catch(error) {
    res.json(error);
  }
});

module.exports = router;
