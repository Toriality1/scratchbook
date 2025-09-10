import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import env from "../config/env.js";
import logger from "../utils/logger.js";
import { ApiError } from "../errors/ApiError.js";
// import { z } from "zod";
// import { validate } from "../middleware/validate.js";
import { Schema, model } from "mongoose";
import { Router } from "express";
import { INTERNAL_SERVER_ERROR } from "../utils/constants.js";
import type { Request, Response, NextFunction } from "express";

// ----------------------------------------- \\
// Constants
// ----------------------------------------- \\
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_TRIES = 5;
const RATE_LIMIT_MSG = "Too many requests. Please try again later.";
const EXPIRE_TIME = "1h";
const MAX_AGE = 1000 * 60 * 60; // 1 hour
const LOGOUT_SUCCESS = "Logout successful";
const MIN_USERNAME_LENGTH = 3;
const MIN_USERNAME_LENGTH_MSG = `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
const MIN_PASSWORD_LENGTH = 8;
const MIN_PASSWORD_LENGTH_MSG = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
const MAX_USERNAME_LENGTH = 10;
const MAX_USERNAME_LENGTH_MSG = `Username is too long. Maxiumum length is ${MAX_USERNAME_LENGTH} characters`;
const MAX_PASSWORD_LENGTH = 128;
const MAX_PASSWORD_LENGTH_MSG = `Password is too long. Maxiumum length is ${MAX_PASSWORD_LENGTH} characters`;
const USERNAME_UNIQUE = "Username already exists";
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_REQUIRED = "Username is required";
const PASSWORD_REQUIRED = "Password is required";
const MIN_USERNAME_ERROR = "Username must be at least 3 characters";
const MIN_PASSWORD_ERROR = "Password must be at least 8 characters";
const USERNAME_REGEX_ERROR =
  "Username can only contain letters, numbers, and underscores";
const MAX_PASSWORD_ERROR =
  "Password is too long. Maxiumum length is 128 characters";
const MAX_USERNAME_ERROR =
  "Username is too long. Maxiumum length is 10 characters";
const INVALID_CREDENTIALS = "Invalid credentials";
const NO_TOKEN_ERROR = "Unauthorized: No token in request";
const INVALID_TOKEN_ERROR = "Unauthorized: Invalid token";

// ----------------------------------------- \\
// Types
// ----------------------------------------- \\
declare module "express" {
  interface Request {
    user?: UserDTO;
  }
}

interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface UserCredentials {
  username: string;
  password: string;
}

interface UserDTO {
  id: string;
  username: string;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

// ----------------------------------------- \\
// Errors
// ----------------------------------------- \\
class AuthError extends ApiError {
  constructor(message = INVALID_CREDENTIALS) {
    super(400, message);
  }
}

class RegistrationError extends ApiError {
  constructor(message = INVALID_CREDENTIALS) {
    super(400, message);
  }
}

// ----------------------------------------- \\
// Utils
// ----------------------------------------- \\
const authLimiter =
  env.NODE_ENV === "production"
    ? rateLimit({
        windowMs: RATE_LIMIT_WINDOW,
        max: RATE_LIMIT_MAX_TRIES,
        message: RATE_LIMIT_MSG,
      })
    : (_req: Request, _res: Response, next: NextFunction) => next();

// ---------------------------------------------------------- \\
// Middleware
// ---------------------------------------------------------- \\
export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    req.user = undefined;
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserDTO;
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: INVALID_TOKEN_ERROR });
  }
}

// ----------------------------------------- \\
// Models
// ----------------------------------------- \\
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, USERNAME_REQUIRED],
      unique: [true, USERNAME_UNIQUE],
      trim: true,
      minlength: [MIN_USERNAME_LENGTH, MIN_USERNAME_LENGTH_MSG],
      maxlength: [MAX_USERNAME_LENGTH, MAX_USERNAME_LENGTH_MSG],
      index: true,
    },
    password: {
      type: String,
      required: [true, PASSWORD_REQUIRED],
      minlength: [MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MSG],
      maxlength: [MAX_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH_MSG],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);

// ----------------------------------------- \\
// Services
// ----------------------------------------- \\
const registerUser = async ({
  username,
  password,
}: UserCredentials): Promise<UserDTO> => {
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    throw new RegistrationError(USERNAME_UNIQUE);
  }

  const newUser = new User({ username, password });
  const savedUser = await newUser.save();

  return {
    id: savedUser.id,
    username: savedUser.username,
  };
};

const loginUser = async ({
  username,
  password,
}: UserCredentials): Promise<AuthResult> => {
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    throw new AuthError();
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AuthError();
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    env.JWT_SECRET,
    {
      expiresIn: EXPIRE_TIME,
    },
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
};

// ----------------------------------------- \\
// Controllers
// ----------------------------------------- \\
const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
    logger.debug({ user, ip: req.ip }, "User registered");
  } catch (err) {
    if (err instanceof RegistrationError) {
      logger.debug(
        { ip: req.ip, error: err.message },
        "User failed to register",
      );
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
    });
    res.status(200).json(result.user);
    logger.debug({ user: result.user, ip: req.ip }, "User logged in");
  } catch (err) {
    if (err instanceof AuthError) {
      logger.debug({ ip: req.ip, error: err.message }, "User failed to log in");
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });
    res.status(200).json({ msg: LOGOUT_SUCCESS });
    logger.debug({ ip: req.ip }, "User logged out");
  } catch (err) {
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
    logger.debug({ err }, "User failed to log out");
  }
};

// ----------------------------------------- \\
// Validators
// ----------------------------------------- \\
// const registerSchema = z.object({
//   username: z
//     .string()
//     .min(MIN_USERNAME_LENGTH, { message: MIN_USERNAME_ERROR })
//     .max(MAX_USERNAME_LENGTH, { message: MAX_USERNAME_ERROR })
//     .regex(USERNAME_REGEX, { message: USERNAME_REGEX_ERROR }),
//   password: z
//     .string()
//     .min(MIN_PASSWORD_LENGTH, { message: MIN_PASSWORD_ERROR })
//     .max(MAX_PASSWORD_LENGTH, { message: MAX_PASSWORD_ERROR }),
// });
//
// const loginSchema = z.object({
//   username: z
//     .string()
//     .min(MIN_USERNAME_LENGTH, { message: MIN_USERNAME_ERROR })
//     .max(MAX_USERNAME_LENGTH, { message: MAX_USERNAME_ERROR }),
//   password: z
//     .string()
//     .min(MIN_PASSWORD_LENGTH, { message: MIN_PASSWORD_ERROR })
//     .max(MAX_PASSWORD_LENGTH, { message: MAX_PASSWORD_ERROR }),
// });

// ----------------------------------------- \\
// Routes
// ----------------------------------------- \\
const router = Router();

router.post("/", authLimiter, register);
router.post("/auth", authLimiter, login);
router.get("/auth", auth, getCurrentUser);
router.get("/logout", auth, logout);

export default router;
