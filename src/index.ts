import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import { connectDB } from "./utils/connectDB.js";
import env from "./config/env.js";
import handleError from "./utils/handleError.js";
import cookieParser from "cookie-parser";
import usersRouter from "./features/user.js";
import notesRouter from "./features/note.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();

if (env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client")));
  app.get(/^(?!\/api).*/i, (_req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
  });
}

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use(handleError);

const server = app.listen(env.PORT, () => {
  logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

export default server;
