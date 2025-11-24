const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// JWT 인증 미들웨어: 실무에서는 별도 파일에 분리
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "로그인 필요" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "토큰 인증 실패" });
  }
}

// 이메일 중복 체크
router.get("/email-availability", async (req, res) => {
  const { email } = req.query;
  const exists = await User.findOne({ email });
  res.json({ available: !exists });
});

// 회원가입
router.post("/register", async (req, res) => {
  const { email, password, name, phone_number, address, birthdate } = req.body;
  if (!email || !password || !name || !phone_number) return res.status(400).json({ message: "필수값 누락" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "이미 등록된 이메일" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash, name, phone_number, address, birthdate });
  await user.save();
  res.status(201).json({ user: user.toSafeJSON() });
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "아이디 또는 비밀번호 오류" });
  }
  if (user.status !== "ACTIVE") {
    return res.status(403).json({ message: "비활성화/정지된 계정" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: user.toSafeJSON() });
});

// 내정보 조회
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "사용자 없음" });
  res.json(user.toSafeJSON());
});

// 내정보 수정
router.patch("/me", authMiddleware, async (req, res) => {
  const updates = { ...req.body };
  delete updates.email; // email 변경 불가
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user.toSafeJSON());
});

// 비밀번호 변경(로그인 상태)
router.put("/me/password", authMiddleware, async (req, res) => {
  const { current_password, new_password } = req.body;
  const user = await User.findById(req.user.id).select("+passwordHash");
  if (!user || !(await bcrypt.compare(current_password, user.passwordHash)))
    return res.status(401).json({ message: "현재 비밀번호 오류" });
  user.passwordHash = await bcrypt.hash(new_password, 10);
  await user.save();
  res.status(204).end();
});

// 계정 비활성화(탈퇴)
router.delete("/me", authMiddleware, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { status: "INACTIVE" });
  res.status(204).end();
});

module.exports = router;
