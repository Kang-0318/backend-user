// reservation/route.js
const express = require('express');
const router = express.Router();

const reservationController = require('./controller');
const authMiddleware = require('../common/authMiddleware');

// 예약 생성
router.post('/', authMiddleware, reservationController.create);

// 내 예약 목록 조회
router.get('/me', authMiddleware, reservationController.getMyReservations);

// 예약 상세 조회
router.get('/:id', authMiddleware, reservationController.getOne);

// 예약 취소
router.delete('/:id', authMiddleware, reservationController.cancel);

// 예약 완료 (관리자/운영자용으로 필요 시 권한 미들웨어 추가)
router.patch('/:id/complete', authMiddleware, reservationController.complete);

module.exports = router;
