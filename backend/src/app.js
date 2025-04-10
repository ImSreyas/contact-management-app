import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import multer from "multer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer();
app.use(upload.any());

app.use("/api", routes);

export default app;
