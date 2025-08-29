import { Router } from "express";
import { login, getCurrentUser } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/", login);
router.get("/", auth, getCurrentUser);

export default router;
