import Media from "../models/Media.js";
import { uploadMediaToCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

export const uploadMedia = async (req, res) => {
  logger.info("starting media upload");

  try {
    if (!req.file) {
      logger.error("No file found. please add a file and try again");
      return res.status(400).json({
        success: false,
        message: "No file found. Please add a file and try again",
      });
    }

    const { originalName, mimeType, buffer } = req.file;

    const userId = req.user.userId;

    logger.info(`File details: name=${originalName}, type=${mimeType}`);
    logger.info(`uploading to cloudinary starting...`);

    const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
    logger.info(
      `Cloudinary upload successfull. Public ID: - ${cloudinaryUploadResult.public_id}`
    );

    const newlyCreatedMedia = new Media({
      publicId: cloudinaryUploadResult.public_id,
      originalName,
      mimeType,
      url: cloudinaryUploadResult.secure_url,
      userId,
    });

    await newlyCreatedMedia.save();

    res.status(200).json({
      success: true,
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media uploaded successfully",
    });
  } catch (error) {
    logger.error("error fetching post", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post by ID",
    });
  }
};
