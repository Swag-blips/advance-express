import Search from "../models/Search.js";
import logger from "../utils/logger.js";

export const searchPostController = async (req, res) => {
  logger.info("Search endpoint hit!");

  try {
    const { query } = req.query;

    const results = await Search.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    return res.json(results);
  } catch (error) {
    logger.error("error searching post", error);
    res.status(500).json({
      success: false,
      message: "Error searching post",
    });
  }
};
