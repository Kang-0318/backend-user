// reservation/model.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // 예약자
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room', // 실제 Room 모델과 연동 예정
      required: true,
    },
    check_in: {
      type: Date,
      required: true,
    },
    check_out: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'CONFIRMED',
    },
    requested_at: {
      type: Date,
      default: Date.now,
    },
    cancelled_at: {
      type: Date,
    },
    completed_at: {
      type: Date,
    },
    special_requests: {
      type: String,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  { timestamps: true }
);

// 조회/통계용 인덱스
reservationSchema.index({ user: 1, room: 1, check_in: -1 });

module.exports = mongoose.model('Reservation', reservationSchema);
