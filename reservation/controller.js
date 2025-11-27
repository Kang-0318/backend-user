// src/reservation/controller.js
const reservationService = require('./service');
const response = require('../common/response');

// 예약 생성
exports.createReservation = async (req, res) => {
  try {
    const { room, check_in, check_out, special_requests } = req.body;
    // user 정보는 JWT 인증 미들웨어 후 req.user.id로 할당
    const reservation = await reservationService.createReservation({
      user: req.user.id,
      room,
      check_in,
      check_out,
      special_requests,
    });
    return response.success(res, reservation, "예약이 성공적으로 등록되었습니다.", 201);
  } catch (err) {
    return response.error(res, err.message, 400);
  }
};

// 내 예약 목록 조회
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getReservationsByUser(req.user.id);
    return response.success(res, reservations, "예약 목록 조회 성공");
  } catch (err) {
    return response.error(res, err.message, 400);
  }
};

// 예약 상세 조회
exports.getReservationDetail = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationService.getReservationById(reservationId);
    if (!reservation) return response.error(res, "예약 정보를 찾을 수 없습니다.", 404);
    return response.success(res, reservation, "예약 상세 조회 성공");
  } catch (err) {
    return response.error(res, err.message, 400);
  }
};

// 예약 취소
exports.cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationService.cancelReservation(reservationId, req.user.id);
    return response.success(res, reservation, "예약이 취소되었습니다.");
  } catch (err) {
    return response.error(res, err.message, 400);
  }
};

// 예약 완료 (관리자/운영자 기능 예시)
exports.completeReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationService.completeReservation(reservationId);
    return response.success(res, reservation, "숙박 완료 처리되었습니다.");
  } catch (err) {
    return response.error(res, err.message, 400);
  }
};
