import pino from "pino";
import env from "../config/env.js";

const baseOptions = {
  level: env.NODE_ENV === "production" ? "info" : "debug",
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
};

const devLogger = pino({
  ...baseOptions,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: false,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

const prodLogger = pino(baseOptions);

const logger = env.NODE_ENV === "production" ? prodLogger : devLogger;

export default logger;
