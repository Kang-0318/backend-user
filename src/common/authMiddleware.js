// src/common/authMiddleware.js
const jwt = require('jsonwebtoken');

// .env에 JWT_SECRET=... 반드시 세팅 필요
const JWT_SECRET = process.env.JWT_SECRET;

// 인증된 사용자만 접근 허용하는 미들웨어
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: '토큰 인증 실패.' });
  }
}

module.exports = authMiddleware;
