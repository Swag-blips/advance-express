import Post from "../models/Post.js";
import logger from "../utils/logger.js";
import { publishEvent } from "../utils/rabbitmq.js";
import { validatePost } from "../utils/validation.js";

async function invalidatePostCache(req, input) {
  const cachedKey = `post:${input}`;

  await req.redisClient.del(cachedKey);
  const keys = await req.redisClient.keys("posts:*");

  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}
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
    await invalidatePostCache(req, newPost._id.toString());
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
  logger.info("Get all posts");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);

    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Post.countDocuments();

    const result = {
      posts,
      currentpage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    };

    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));

    res.json(result);
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
    const postId = req.params.id;

    const cacheKey = `post:${postId}`;

    const cachedPosts = await req.redisClient.get(cacheKey);

    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const singlePost = await Post.findById(postId);

    if (!singlePost) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    await req.redisClient.setex(cacheKey, 3600, JSON.stringify(singlePost));

    res.json(singlePost);
  } catch (error) {
    logger.error("error fetching post", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post by ID",
    });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findOneAndDelete({
      _id: postId,
      user: req.user.userId,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    await publishEvent("post.deleted", {
      postId: post._id.toString(),
      userId: req.user.userId,
      mediaIds: post.mediaIds,
    });

    await invalidatePostCache(req, req.params.id);
    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    logger.error("error fetching post", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post by ID",
    });
  }
};
