import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@desc Auth user/set token
//route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      phone: user.phone,
      dni: user.dni,
      dniType: user.dniType,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password.");
  }
});

//@desc Register new user
//route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, dni, dniType, phone, profileImage, password } =
    req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const newUser = User.create({
    fullName,
    email,
    profileImage,
    phone,
    dni,
    dniType,
    password,
  });

  if (newUser) {
    generateToken(res, newUser._id);
    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profileImage: newUser.profileImage,
      phone: newUser.phone,
      dni: newUser.dni,
      dniType: newUser.dniType,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

//@desc Logout user
//route POST /api/users/login
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

//@desc Get user profile
//route POST /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
  };
  res.status(200).json(user);
});

//@desc Update user profile
//route POST /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "update profile User" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
