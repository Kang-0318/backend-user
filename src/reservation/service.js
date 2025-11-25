// src/reservation/service.js
const Reservation = require('./model');

// 예약 생성 (필수: user, room, check_in, check_out, special_requests)
async function createReservation({ user, room, check_in, check_out, special_requests }) {
  // 체크인/체크아웃 날짜 유효성 검사
  if (!check_in || !check_out || new Date(check_in) >= new Date(check_out)) {
    throw new Error("체크인/체크아웃 날짜가 올바르지 않습니다.");
  }

  // 동일 객실+기간 중복 예약 방지 (중복 체크 예시)
  const overlap = await Reservation.findOne({
    room,
    status: { $in: ["CONFIRMED", "COMPLETED"] },
    $or: [
      { check_in: { $lt: check_out }, check_out: { $gt: check_in } }
    ]
  });
  if (overlap) throw new Error("해당 기간에 이미 예약된 객실입니다.");

  const reservation = new Reservation({
    user,
    room,
    check_in,
    check_out,
    special_requests,
    status: "CONFIRMED",
    requested_at: new Date(),
  });
  await reservation.save();
  return reservation;
}

// 예약 조회 (user가 자신의 예약 목록 보기)
async function getReservationsByUser(userId) {
  return await Reservation.find({ user: userId }).sort({ check_in: -1 }).populate('room');
}

// 단일 예약 상세 (예약ID)
async function getReservationById(reservationId) {
  return await Reservation.findById(reservationId).populate('room').populate('user');
}

// 예약 취소
async function cancelReservation(reservationId, userId) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) throw new Error("예약 정보가 없습니다.");
  if (reservation.user.toString() !== userId.toString()) throw new Error("본인 예약이 아닙니다.");
  if (reservation.status !== "CONFIRMED") throw new Error("이미 취소된 예약입니다.");

  reservation.status = "CANCELLED";
  reservation.cancelled_at = new Date();
  await reservation.save();
  return reservation;
}

// 예약 완료(관리자/운영자 기능 예시)
async function completeReservation(reservationId) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) throw new Error("예약 정보가 없습니다.");
  reservation.status = "COMPLETED";
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
