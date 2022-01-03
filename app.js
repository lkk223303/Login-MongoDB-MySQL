var createError = require("http-errors");
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to Sequelize -> MySQL
const { sequelize } = require("./model/userSequelize");
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to Mongodb!");
    }
  }
);

// mysql connection
// const { pool } = require("./mysql");

// pool.getConnection((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("MySQL tset connected!");
//   }
// });

// Router設定
var indexRouter = require("./routes/index");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
