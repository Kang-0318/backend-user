// src/reservation/route.js
const express = require('express');
const router = express.Router();

const reservationController = require('./controller');
const authMiddleware = require('../common/authMiddleware');

// 예약 생성 (로그인한 유저만 가능)
router.post('/', authMiddleware, reservationController.createReservation);

// 내 예약 목록 조회
router.get('/', authMiddleware, reservationController.getMyReservations);

// 예약 상세 조회
router.get('/:reservationId', authMiddleware, reservationController.getReservationDetail);

// 예약 취소
router.delete('/:reservationId', authMiddleware, reservationController.cancelReservation);

// 예약 완료 (운영자/관리자 등, 관리자 인증 미들웨어 추가 필요)
router.patch('/:reservationId/complete', authMiddleware, reservationController.completeReservation);

module.exports = router;
