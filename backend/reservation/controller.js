// reservation/controller.js
const reservationService = require('./service');

// 예약 생성
async function create(req, res) {
  try {
    const { room, check_in, check_out, special_requests } = req.body;

    if (!room || !check_in || !check_out) {
      return res.status(400).json({ message: '객실, 체크인, 체크아웃은 필수입니다.' });
    }

    const reservation = await reservationService.createReservation({
      user: req.user.id,
      room,
      check_in,
      check_out,
      special_requests,
    });

    return res.status(201).json({ reservation });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// 내 예약 목록 조회
async function getMyReservations(req, res) {
  try {
    const reservations = await reservationService.getReservationsByUser(req.user.id);
    return res.status(200).json({ reservations });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// 예약 상세 조회
async function getOne(req, res) {
  try {
    const reservation = await reservationService.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: '예약 정보를 찾을 수 없습니다.' });
    }
    return res.status(200).json({ reservation });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// 예약 취소
async function cancel(req, res) {
  try {
    const reservation = await reservationService.cancelReservation(req.params.id, req.user.id);
    return res.status(200).json({ reservation });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// 예약 완료 (관리자/운영자용, 필요 시 권한 체크 추가)
async function complete(req, res) {
  try {
    const reservation = await reservationService.completeReservation(req.params.id);
    return res.status(200).json({ reservation });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = {
  create,
  getMyReservations,
  getOne,
  cancel,
  complete,
};
