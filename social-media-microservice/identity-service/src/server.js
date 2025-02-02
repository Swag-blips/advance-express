import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "./utils/logger";
import express from "express";
import helmet from "helmet";
import cors from "cors";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

// middleware

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`received ${req.method} request to ${req.url}`);
  logger.info(`Request body ${req.body}`)
});
