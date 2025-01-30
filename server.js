import dotenv from "dotenv";
import express from "express";
import configureCors from "./config/cors.config.js";
import { addTimeStamp, requestLogger } from "./middleware/customMiddleware.js";
dotenv.config();
import { globalErrorhandler } from "./middleware/errorHandler.js";
import { urlVersioning } from "./middleware/apiVersioning.js";
import { createBasicLimiter } from "./middleware/rateLimiting.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(configureCors());
app.use(createBasicLimiter(100, 15 * 60 * 1000));
app.use(requestLogger);
app.use(addTimeStamp);
app.use("/api/v1", urlVersioning("v1"));
app.use(globalErrorhandler);

app.listen(PORT, () => {
  console.log(`server is now running on port ${PORT}`);
});
