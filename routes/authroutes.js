const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

function makeToken(user) {
  return jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name || !phone) return res.status(400).json({ message: "필수값 누락" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "이미 가입된 이메일" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name, phone });
  res.status(201).json({ user: user.toSafeJSON() });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) return res.status(401).json({ message: "아이디/비번 오류" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "아이디/비번 오류" });
  const token = makeToken(user);
  res.status(200).json({ token, user: user.toSafeJSON() });
});

router.get("/me", async (req, res) => {
  const userId = req.user?.id; // 인증 미들웨어 적용 필요
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "사용자 없음" });
  res.status(200).json(user.toSafeJSON());
});

module.exports = router;
