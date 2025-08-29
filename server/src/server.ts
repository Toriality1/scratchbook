import type { NextFunction, Request, Response } from "express";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import env from "./config/env.ts";

import notesRouter from "./routes/notes.ts";
import usersRouter from "./routes/users.ts";
import authRouter from "./routes/auth.ts";
import { ApiError } from "./errors/ApiError.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.on("SIGTERM", async () => {
  console.log(chalk.yellow("SIGTERM received. Shutting down gracefully..."));
  server.close(() => {
    console.log(chalk.yellow("✓ HTTP server closed"));
  });

  await mongoose.connection.close(false);
  console.log(chalk.yellow("✓ MongoDB connection closed!"));
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log(chalk.yellow("\nSIGINT received. Shutting down..."));
  server.close(() => {
    console.log(chalk.yellow("✓ HTTP server closed"));
  });
  process.exit(0);
});

const app = express();

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(env.ATLAS_URI);
    console.log(chalk.green("✓ MongoDB connected successfully!"));
  } catch (err) {
    console.error(chalk.red("✗ MongoDB connection failed:", err));
    process.exit(1);
  }
}

connectDB();

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

if (env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (_, res) =>
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html")),
  );
}

app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error("Uncaught exception:", err.stack || err);

  const message =
    env.NODE_ENV === "development" ? err.message : "Internal server error";

  res.status(500).json({ message });
});

const server = app.listen(env.PORT, () => {
  console.log(chalk.green(`✓ Server is running on port ${env.PORT}`));
});

export default server;
