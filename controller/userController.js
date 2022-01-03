const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import model
const User = require("../model/mongoUserSchema");
const { registerValidation, loginValidation } = require("../model/validation");

// MySQL
const { sequelize, User2 } = require("../model/userSequelize");

exports.user_register = async (req, res) => {
  // Validate the data before add a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, password } = req.body;

  //   Hash password
  const hashPassword = await bcrypt.hash(password, 10);

  const currentUser = {
    username: username,
    password: hashPassword,
  };

  // MongoDB  Create new user
  const user = new User(currentUser);

  //  MongoDB Save user to mongoDB
  try {
    // MongoDB user save
    const savedUser = await user.save();

    // MySQL user create
    await sequelize.sync();
    const user2 = await User2.create(currentUser);
    console.log(user2.toJSON());
    res.send(savedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.user_login = async (req, res) => {
  const { username, password } = req.body;

  // validate the data before add a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // username check exist and get the user data
  const user = await User.findOne({ username: username });
  if (!user) return res.status(400).send("Username not found!");

  //   Password correct
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send("Invalid password!");

  //   Create and assign token
  const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
  console.log(username + " logged in!");

  res.cookie("auth_token", token, { httpOnly: true }).json({ Token: token });
};

exports.user_direct = (req, res) => {
  // 只要cookie帶token 即可直接登入, verify user token and return userId
  const userID = req.user._id;

  //   find user by id
  User.findById(userID, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.send(`Welcome Back ${doc.username}!`);
    }
  });
};
