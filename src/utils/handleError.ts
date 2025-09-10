import type { Request, Response, NextFunction } from "express";
import logger from "./logger.js";
import env from "../config/env.js";
import { ApiError } from "../errors/ApiError.js";

export default function handleError(
  err: any,
  _req: Request,
  res: Response,
  __next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      msg: err.message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  logger.error({ err }, "Uncaught exception");

  res.status(500).json({
    msg: "Something went wrong.",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
