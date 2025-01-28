import dotenv from "dotenv";
import express from "express";
import configureCors from "./config/cors.config.js";
import { addTimeStamp, requestLogger } from "./middleware/customMiddleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(configureCors());
app.use(requestLogger)
app.use(addTimeStamp)

app.listen(PORT, () => {
  console.log(`server is now running on port ${PORT}`);
});
