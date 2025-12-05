// user/route.js
const express = require('express');
const router = express.Router();

const userController = require('./controller');
const authMiddleware = require('../common/authMiddleware');

// 회원가입
router.post('/register', userController.register);

// 로그인
router.post('/login', userController.login);

// 내 정보 조회
router.get('/me', authMiddleware, userController.getMe);

// 내 정보 수정
router.patch('/me', authMiddleware, userController.updateMe);

// 회원 비활성화(탈퇴)
router.delete('/me', authMiddleware, userController.deactivate);

// 이메일 중복 체크
router.get('/check-email', userController.checkEmail);

module.exports = router;
