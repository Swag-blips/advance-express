import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });

    console.log("new User:", newUser);

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error registering user",
      message: error.message,
    });
  }
};
export const login = async (req, res) => {
  res.status(200).json({
    message: "User logged in successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};

export const authStatus = async (req, res) => {};

export const logout = async (req, res) => {};

export const setup2FA = async (req, res) => {};

export const verify2FA = async (req, res) => {};

export const reset2FA = async (req, res) => {};
