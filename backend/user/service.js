// user/service.js
const User = require('./model');

// 회원 생성 (회원가입)
async function createUser({ email, password, name, phone_number, address, birthdate, profile_image_url }) {
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new Error('이미 존재하는 이메일입니다.');
  }

  const user = new User({
    email: email.toLowerCase(),
    name,
    phone_number,
    address,
    birthdate,
    profile_image_url,
  });

  await user.setPassword(password);
  await user.save();
  return user;
}

// 로그인 비밀번호 검증 + 잠금 관련 로직
async function verifyUserPassword(email, plainPassword) {
  const invalidMsg = '이메일 또는 비밀번호가 올바르지 않습니다.';

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash failedLoginAttempts lastLoginAttempt status'
  );

  if (!user) {
    throw new Error(invalidMsg);
  }

  if (user.status !== 'ACTIVE') {
    throw new Error('비활성화된 계정입니다.');
  }

  // 비밀번호 비교
  const ok = await user.comparePassword(plainPassword);

  if (!ok) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    user.lastLoginAttempt = new Date();
    await user.save();
    throw new Error(invalidMsg);
  }

  // 성공 시 실패 횟수 초기화
  user.failedLoginAttempts = 0;
  user.lastLoginAttempt = new Date();
  await user.save();

  return user;
}

// 유저 조회 (id)
async function getUserById(userId) {
  return User.findById(userId);
}

// 이메일 사용 가능 여부
async function isEmailAvailable(email) {
  const exists = await User.exists({ email: email.toLowerCase() });
  return !exists;
}

// 내 정보 수정 (email 제외)
async function updateUserInfo(userId, updateData) {
  if ('email' in updateData) {
    delete updateData.email;
  }
  return User.findByIdAndUpdate(userId, updateData, { new: true });
}

// 상태 변경 (INACTIVE/BANNED 등)
async function updateUserStatus(userId, newStatus) {
  return User.findByIdAndUpdate(userId, { status: newStatus }, { new: true });
}

module.exports = {
  createUser,
  verifyUserPassword,
  getUserById,
  isEmailAvailable,
  updateUserInfo,
  updateUserStatus,
};
