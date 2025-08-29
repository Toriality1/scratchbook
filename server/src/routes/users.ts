import { Router } from "express";
import { register } from "../controllers/userController.js";

const router = Router();

router.post("/", register);

export default router;
