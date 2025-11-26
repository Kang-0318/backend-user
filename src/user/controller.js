// src/user/controller.js
const userService = require('./service');

// 회원가입
exports.register = async (req, res) => {
  const { email, password, name, phone_number, address, birthdate, profile_image_url } = req.body;
  if (!email || !password || !name || !phone_number) {
    return res.status(400).json({ message: "필수 값이 누락되었습니다." });
  }
  try {
    const user = await userService.createUser({ email, password, name, phone_number, address, birthdate, profile_image_url });
    // 가입 직후 기본 정보는 비번 제외 반환
    res.status(201).json({ user: user.toSafeJSON() });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "아이디와 비밀번호를 입력하세요." });
  }
  try {
    const user = await userService.verifyUserPassword(email, password);
    // JWT 발급은 route.js에서 처리(여기선 유저 정보만 반환)
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// 내 정보 조회
exports.getMe = async (req, res) => {
  try {
    // JWT 인증 미들웨어에서 req.user.id 할당 가정
    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "회원 정보를 찾을 수 없습니다." });
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 내 정보 수정
exports.updateMe = async (req, res) => {
  try {
    const user = await userService.updateUserInfo(req.user.id, req.body);
    res.json({ user: user.toSafeJSON() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 회원 비활성화(탈퇴)
exports.deactivate = async (req, res) => {
  try {
    await userService.updateUserStatus(req.user.id, 'INACTIVE');
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 이메일 중복 체크 API
exports.checkEmail = async (req, res) => {
  try {
    if (!req.query.email) return res.status(400).json({ available: false, message: "이메일을 입력하세요." });
    const available = await userService.isEmailAvailable(req.query.email);
    res.json({ available });
  } catch (err) {
    res.status(400).json({ available: false, message: err.message });
  }
};
