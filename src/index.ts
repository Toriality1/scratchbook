import express from "express";
import cors from "cors";
import logger from "./utils/logger.ts";
import { connectDB } from "./utils/connectDB.ts";
import env from "./config/env.ts";
import handleError from "./utils/handleError.ts";
import cookieParser from "cookie-parser";
import usersRouter from "./features/user.ts";
import notesRouter from "./features/note.ts";

connectDB();

const app = express();

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
