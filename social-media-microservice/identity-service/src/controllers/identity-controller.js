import User from "../models/User";
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
  } catch (error) {}
};

// user login

// refresh token

// logout
