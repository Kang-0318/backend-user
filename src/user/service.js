// src/user/service.js
const User = require('./model');

// 회원 생성 (회원가입)
async function createUser({ email, password, name, phone_number, address, birthdate, profile_image_url }) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("이미 존재하는 이메일입니다.");

  const user = new User({ email, name, phone_number, address, birthdate, profile_image_url });
  await user.setPassword(password); // 비밀번호 해시
  await user.save();
  return user;
}

// 비밀번호 검증 (로그인용)
async function verifyUserPassword(email, plainPassword) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new Error("등록되지 않은 이메일입니다.");
  if (!(await user.comparePassword(plainPassword))) throw new Error("비밀번호가 틀렸습니다.");
  if (user.status !== "ACTIVE") throw new Error("비활성화/정지된 계정입니다.");
  return user;
}

// 유저정보 조회 (By ID)
async function getUserById(userId) {
  return await User.findById(userId);
}

// 이메일 중복 검사(Available 여부)
async function isEmailAvailable(email) {
  return !(await User.exists({ email }));
}

// 내정보 업데이트(주소, 전화번호 등)
async function updateUserInfo(userId, updateData) {
  if ('email' in updateData) delete updateData.email; // email은 변경불가
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
}

// 회원 상태 변경 (탈퇴/비활성화/정지)
async function updateUserStatus(userId, newStatus) {
  return await User.findByIdAndUpdate(userId, { status: newStatus }, { new: true });
}

module.exports = {
  createUser,
  verifyUserPassword,
  getUserById,
  isEmailAvailable,
  updateUserInfo,
  updateUserStatus,
};
