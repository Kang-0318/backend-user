<<<<<<< HEAD
// ⭐ 테스트용 고정 유저
const dummyUser = {
  email: "test@test.com",
  password: "1234",
  nickname: "용준",
  profileImg: "/default_profile.png"
=======
// 임시 사용자 데이터
export const mockUser = {
  id: 1,
  email: "user@test.com",
  password: "1234",
  name: "홍길동",
  phone: "010-1234-5678",
  profileImage: null,
  createdAt: "2025-01-01",
>>>>>>> main
};

// 로그인 인증 함수
export const authenticateUser = (email, password) => {
<<<<<<< HEAD
  if (email === dummyUser.email && password === dummyUser.password) {
    return {
      success: true,
      user: {
        email: dummyUser.email,
        nickname: dummyUser.nickname,
        profileImg: dummyUser.profileImg
      },
      token: "mock-token-123",
=======
  if (email === mockUser.email && password === mockUser.password) {
    // 비밀번호는 제외하고 반환
    const { password: _, ...userWithoutPassword } = mockUser;
    return {
      success: true,
      user: userWithoutPassword,
      token: "mock-jwt-token-" + Date.now(),
>>>>>>> main
    };
  }

  return {
    success: false,
    message: "이메일 또는 비밀번호가 올바르지 않습니다.",
  };
};
