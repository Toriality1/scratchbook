import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import auth from "../middleware/auth.js";
import User from "../models/Users.js";

dotenv.config();

const router = express.Router();

//*@route   POST /auth
//*@desc    Authenticate the user
//*@access  Public
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields!" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User does not exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

// @route   GET /auth
// @desc    Get user data
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

export default router;

