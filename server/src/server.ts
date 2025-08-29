import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import chalk from "chalk";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { str, cleanEnv, port } from "envalid";

import notesRouter from "./routes/notes.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";

const DEFAULT_PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = cleanEnv(process.env, {
  PORT: port({ default: DEFAULT_PORT }),
  CLIENT_URL: str(),
  JWT_SECRET: str(),
  ATLAS_URI: str(),
  NODE_ENV: str({
    default: "development",
    choices: ["development", "production", "test"],
  }),
});

process.on("SIGTERM", () => {
  console.log(chalk.yellow("SIGTERM received. Shutting down gracefully..."));
  mongoose.connection
    .close(false)
    .then(() => console.log(chalk.yellow("✓ MongoDB connection closed!")));
});

process.on("SIGINT", () => {
  console.log(chalk.yellow("\nSIGINT received. Shutting down..."));
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
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html")),
  );
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

const server = app.listen(env.PORT, () => {
  console.log(chalk.green(`✓ Server is running on port ${env.PORT}`));
});

export default server;
