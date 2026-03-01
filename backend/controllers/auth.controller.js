const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const BlackList = require("../models/Blacklist.model");
require("dotenv").config();

exports.addNewUser = async (req, res, next) => {
  try {
    const { name, email, password, city, gender, bio } = req.body;
    // Cloudinary returns the full URL in req.file.path
    const profileImage = req.file ? req.file.path : null;
    // Check if the email is already registered
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    } else {
      bcrypt.hash(password, 8, async function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          return res.status(400).json({ message: "Couldn't hash password" });
        } else if (hash) {
          // Create a new user
          const newUser = new User({
            name,
            email,
            password: hash,
            city,
            gender,
            bio,
            profileImage,
            recipes: [],
            savedRecipes: [],
            likedRecipes: [],
          });

          try {
            await newUser.save();
            res
              .status(201)
              .json({ message: "User registered successfully", user: newUser });
          } catch (err) {
            return res
              .status(400)
              .json({ message: "User registration failed" });
          }
        }
      });
    }
  } catch (err) {
    return res.status(400).json({ message: "User registration failed" });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return res
            .status(400)
            .json({ message: "Invalid password, Try again" });
        }
        
        // Check if password matches
        if (result) {
          var token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
          return res
            .status(200)
            .json({ message: `Welcome back ${user.name}`, token: token });
        } else {
          return res
            .status(400)
            .json({ message: "Invalid password, Try again" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ message: "User doesn't exist, try registering an account" });
    }
  } catch (er) {
    return res
      .status(400)
      .json({ message: "Something went wrong, try again later" });
  }
};

exports.logoutUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // console.log(token);
  if (token) {
    const data = new BlackList({ token: token });
    await data.save();
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    return res.status(400).json({ message: "Logout failed" });
  }
};
