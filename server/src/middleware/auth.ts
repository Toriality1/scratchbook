import type { NextFunction, Request, Response } from "express";
import type { UserPayload } from "../interfaces/UserPayload.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export interface AuthRequest extends Request {
    user: UserPayload;
}

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized access - No token." });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid." });
  }
}

export default auth;
