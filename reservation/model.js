// src/reservation/model.js
const mongoose = require('mongoose');

// 호텔 예약의 기본 정보: 예약자, 객실, 일정, 상태 등
const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },    // 예약자(회원)
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },    // 객실(다중호텔, 객실 모델 필요)
  check_in: { type: Date, required: true },
  check_out: { type: Date, required: true },
  status: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED'], default: 'CONFIRMED' }, // 예약상태
  requested_at: { type: Date, default: Date.now },   // 예약시각
  cancelled_at: { type: Date },                      // 취소된 경우 기록
  completed_at: { type: Date },                      // 숙박완료시 기록
  special_requests: { type: String },                // 기타 요청사항
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },   // 결제 연동(선택)
}, { timestamps: true });

// 검색 성능, 통계용 인덱스 예시
reservationSchema.index({ user: 1, room: 1, check_in: -1 });

module.exports = mongoose.model('Reservation', reservationSchema);
