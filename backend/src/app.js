import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import multer from "multer";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const upload = multer();
app.use(upload.any());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", routes);

export default app;
