import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
import { connectRabbitMQ } from "../../media-service/src/utils/rabbitmq.js";
import searchRoutes from "./routes/search-routes.js";
import { consumeEvent } from "./utils/rabbitmq.js";
import {
  handlePostDeleted,
  handlePostCreated,
} from "./eventHandlers/search-event-handlers.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3004;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});

app.use("/api/search", searchRoutes);
app.use(errorHandler);

async function startServer() {
  try {
    await connectRabbitMQ();

    await consumeEvent("post.created", handlePostCreated);
    await consumeEvent("post.deleted", handlePostDeleted);
    app.listen(PORT, () => {
      logger.info(`search service is runnning on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error, "Failed to start search service");
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

startServer();
