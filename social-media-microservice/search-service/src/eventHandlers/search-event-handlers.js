import Search from "../models/Search.js";
import logger from "../utils/logger.js";

async function handlePostCreated(event) {
  try {
    const newSearchPost = new Search({
      postId: event.postId,
      userId: event.userId,
      content: event.content,
      createdAt: event.createdAt,
    });

    await newSearchPost.save();
    logger.info(
      `Search post created: ${newSearchPost}, ${newSearchPost._id.toString()}`
    );
  } catch (error) {
    logger.error(error, "Error handling post creation event");
    throw error;
  }
}

export default handlePostCreated;
