var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");

const authRouter = require("./routes/Authentication/Authentication");
const MongoURL = require("./Config/MongoDB");
const { checkUser } = require("./middlewares/AuthenticationMiddleware");

var app = express();

// View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("*", checkUser);
app.use("/", authRouter);

// MongoDB COnnection

mongoose.set("useCreateIndex", true);
mongoose.connect(MongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => {
  console.log("MongoDb is Connected");
});

// Catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler

app.use(function (err, req, res, next) {
  // Set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
