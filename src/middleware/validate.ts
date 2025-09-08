import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          msg: "Validation failed",
          errors: err.flatten().fieldErrors,
          ...(process.env.NODE_ENV === "development" && { issues: err.issues }),
        });
      }

      return res.status(500).json({ msg: "Validation error parsing request" });
    }
  };
};
