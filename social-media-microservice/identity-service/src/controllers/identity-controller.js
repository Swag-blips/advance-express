import User from "../models/User.js";
import generateTokens from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import { validateLogin, validateRegistration } from "../utils/validation.js";
// user registration
export const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit");
  try {
    // validate schema

    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password, username } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      logger.warn("user already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ username, email, password });
    await user.save();
    logger.info("user saved successfully", user._id);

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("registration error occured", error.message);
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// user login

export const loginUser = async (req, res) => {
  logger.info("Login user endpoint hit");

  try {
    const { error } = validateLogin(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("Invalid user ");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // user valid passsword or not

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      logger.warn("Invalid password");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.json({
      accessToken,
      refreshToken,
      userid: user._id,
    });
  } catch (error) {
    logger.error("login error occured", error.message);
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// refresh token

// logout
