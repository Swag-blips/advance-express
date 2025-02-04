import logger from "../utils/logger.js";

const authenticateRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  logger.info(userId)

  if (!userId) {
    logger.warn("Access attempted without user ID");

    return res.status(401).json({
      success: false,
      message: "Authentication required!, please login to continue",
    });
  }

  req.user = { userId };
  next();
};

export default authenticateRequest;
