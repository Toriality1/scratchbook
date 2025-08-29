import type { Request } from "express";
import type { UserPayload } from "../interfaces/UserPayload";

export function getAuthUser(req: Request): UserPayload {
  if (!req.user) {
    throw new Error("Unauthorized: No user in request");
  }
  return req.user as UserPayload;
}
