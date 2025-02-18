import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrCode from "qrcode";

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

export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};

export const logout = async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message: "Unauthorized user",
    });
  }

  req.logout((err) => {
    if (err) return res.status(400).json({ message: "User not logged In" });
    res.status(200).json({ message: "Logout successful" });
  });
};

export const setup2FA = async (req, res) => {
  try {
    const user = req.user;
    const secret = speakeasy.generateSecret();

    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;

    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "swag.com",
      encoding: "base32",
    });

    const qrImageUrl = await qrCode.toDataURL(url);
    res.status(200).json({
      secret: secret.base32,
      qrCode: qrImageUrl,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Error setting up 2fa",
      message: error.message,
    });
  }
};

export const verify2FA = async (req, res) => {};

export const reset2FA = async (req, res) => {};
