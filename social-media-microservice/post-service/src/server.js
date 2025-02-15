import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import cors from "cors";
import helmet from "helmet";
import postRoutes from "./routes/post-route.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
import connectRabbitMQ from "./utils/rabbitmq.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});

app.use(
  "/api/posts",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  postRoutes
);
app.use(errorHandler);

async function startServer() {
  try {
    await connectRabbitMQ();
    app.listen(PORT, () => {
      logger.info(`post service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to server", error);
    process.exit(1);
  }
}

startServer();
process.on("unhandledRejection", (reason, promise) => {
  logger.error("unhandled rejection at ", promise, "reason:", reason);
});
