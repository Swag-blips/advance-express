import User from "../models/User";
import generateTokens from "../utils/generateToken";
import logger from "../utils/logger";
import validateRegistration from "../utils/validation";
// user registration
const registerUser = async (req, res) => {
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
      logger.warn("user already exists", error.details[0].message);
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
    logger.error("registration error occured", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// user login

// refresh token

// logout
