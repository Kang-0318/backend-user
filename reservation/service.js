// reservation/service.js
const mongoose = require('mongoose');
const Reservation = require('./model');

// 예약 생성
async function createReservation({ user, room, check_in, check_out, special_requests }) {
  if (!check_in || !check_out || new Date(check_in) >= new Date(check_out)) {
    throw new Error('체크인/체크아웃 날짜가 올바르지 않습니다.');
  }

  // 동일 객실 기간 중복 체크
  const overlap = await Reservation.findOne({
    room,
    status: { $in: ['CONFIRMED', 'COMPLETED'] },
    check_in: { $lt: check_out },
    check_out: { $gt: check_in },
  });

  if (overlap) {
    throw new Error('해당 기간에 이미 예약된 객실입니다.');
  }

  const reservation = new Reservation({
    user,
    room,
    check_in,
    check_out,
    special_requests,
    status: 'CONFIRMED',
    requested_at: new Date(),
  });

  await reservation.save();
  return reservation;
}

// 내 예약 목록
async function getReservationsByUser(userId) {
  return Reservation.find({ user: userId })
    .sort({ check_in: -1 })
    .populate('room');
}

// 예약 단건 조회
async function getReservationById(reservationId) {
  if (!mongoose.Types.ObjectId.isValid(reservationId)) return null;
  return Reservation.findById(reservationId).populate('room').populate('user');
}

// 예약 취소
async function cancelReservation(reservationId, userId) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) throw new Error('예약 정보를 찾을 수 없습니다.');
  if (String(reservation.user) !== String(userId)) {
    throw new Error('본인의 예약만 취소할 수 있습니다.');
  }
  if (reservation.status !== 'CONFIRMED') {
    throw new Error('이미 취소되었거나 완료된 예약입니다.');
  }

  reservation.status = 'CANCELLED';
  reservation.cancelled_at = new Date();
  await reservation.save();
  return reservation;
}

// 예약 완료 (운영자/관리자용)
async function completeReservation(reservationId) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) throw new Error('예약 정보를 찾을 수 없습니다.');

  reservation.status = 'COMPLETED';
  reservation.completed_at = new Date();
  await reservation.save();
  return reservation;
}

module.exports = {
  createReservation,
  getReservationsByUser,
  getReservationById,
  cancelReservation,
  completeReservation,
};
