// user/controller.js
const userService = require('./service');

// 회원가입
async function register(req, res) {
  try {
    const {
      email,
      password,
      name,
      phone_number,
      address,
      birthdate,
      profile_image_url,
    } = req.body;

    if (!email || !password || !name || !phone_number) {
      return res.status(400).json({ success: false, message: '필수 값이 누락되었습니다.' });
    }

    const user = await userService.createUser({
      email,
      password,
      name,
      phone_number,
      address,
      birthdate,
      profile_image_url,
    });

    return res.status(201).json({
      success: true,
      data: {
        user: user.toSafeJSON(),
      },
    });
  } catch (err) {
    return res.status(409).json({ success: false, message: err.message });
  }
}

// 로그인
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: '이메일과 비밀번호를 입력하세요.' });
    }

    const user = await userService.verifyUserPassword(email, password);

    // 여기서 JWT 발급 (예시)
    const { accessToken, refreshToken } = await userService.issueTokens(user);

    return res.status(200).json({
      success: true,
      data: {
        user: user.toSafeJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
}

// 내 정보 조회
async function getMe(req, res) {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }
    return res.status(200).json({
      success: true,
      data: user.toSafeJSON(),
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

// 내 정보 수정 (profile_image_url 포함)
async function updateMe(req, res) {
  try {
    const updateData = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      address: req.body.address,
      birthdate: req.body.birthdate,
      profile_image_url: req.body.profile_image_url,
    };

    const user = await userService.updateUserInfo(req.user.id, updateData);

    return res.status(200).json({
      success: true,
      data: user.toSafeJSON(),
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

// 회원 비활성화
async function deactivate(req, res) {
  try {
    await userService.updateUserStatus(req.user.id, 'INACTIVE');
    return res.status(204).end();
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

// 이메일 중복 체크
async function checkEmail(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        success: false,
        available: false,
        message: '이메일을 입력하세요.',
      });
    }

    const available = await userService.isEmailAvailable(email);
    return res.status(200).json({ success: true, available });
  } catch (err) {
    return res.status(400).json({
      success: false,
      available: false,
      message: err.message,
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  deactivate,
  checkEmail,
};
