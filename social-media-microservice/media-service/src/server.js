import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import mediaRoutes from "./routes/media-routes.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
import { connectRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import { handlePostDeleted } from "./eventHandlers/media-event-handlers.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3003;

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

app.use("/api/media", mediaRoutes);
app.use(errorHandler);

async function startServer() {
  try {
    await connectRabbitMQ();

    await consumeEvent("post.deleted", handlePostDeleted);
    app.listen(PORT, () => {
      logger.info(`Media service is running on port ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
}

startServer();

process.on("unhandledRejection", (reason, promise) => {
  logger.error("unhandled rejection at ", promise, "reason:", reason);
});
