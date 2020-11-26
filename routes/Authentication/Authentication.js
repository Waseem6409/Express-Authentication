const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const jwt = require("jsonwebtoken");

//Handle Errors

const handleError = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // *****SignUp Errors*****

  // Duplicate Error

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  // Validation Error

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // *****Login Errors*****

  // Incorrect Email

  if (err.message === "Email not found") {
    errors.email = "No account registered with this email";
  }

  // Incorrect Password

  if (err.message === "Incorrect Password") {
    errors.email = "The password you entered is incorrect";
  }

  return errors;
};

// MaxAge of Token

const maxAge = 3 * 24 * 60 * 60;

// JWT Token Function

const createToken = (id) => {
  return jwt.sign({ id }, "Waseem Munir Secret Diary", {
    expiresIn: maxAge,
  });
};

// Login Route

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json(user);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
});

// Signup Route

router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json(user);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
});

router.post("/logout", (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(201).send("User is logged out");
});

module.exports = router;
