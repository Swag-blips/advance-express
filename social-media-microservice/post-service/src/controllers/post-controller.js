import Post from "../models/Post.js";
import logger from "../utils/logger.js";
import { validatePost } from "../utils/validation.js";

export const createPost = async (req, res) => {
  logger.info("Create post endpoint hit");
  try {
    const { error } = validatePost(req.body);

    if (error) {
      logger.warn("validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { content, mediaIds } = req.body;

    const newPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    await newPost.save();
    logger.info("Post created successfully");
    res
      .status(201)
      .json({ success: true, message: "Post created successfully" });
  } catch (error) {
    logger.error("error creating post", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
  } catch (error) {
    logger.error("error fetching posts", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post",
    });
  }
};

export const getPost = async (req, res) => {
  try {
  } catch (error) {
    logger.error("error fetching post", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post by ID",
    });
  }
};
