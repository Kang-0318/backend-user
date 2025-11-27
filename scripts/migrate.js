// scripts/migrate.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../user/model');
const Reservation = require('../reservation/model');

connectDB();

async function main() {
  try {
    // 1. 테스트 유저 생성
    let user = await User.findOne({ email: 'test@hotel.com' });
    if (!user) {
      user = new User({
        email: 'test@hotel.com',
        name: '테스트사용자',
        phone_number: '01012345678',
        address: '서울특별시 강남구',
        birthdate: new Date('2000-01-01'),
        status: 'ACTIVE',
      });
      await user.setPassword('password1234');
      await user.save();
      console.log('[migrate] test user created');
    } else {
      console.log('[migrate] test user already exists');
    }

    // 2. status 없는 기존 예약 데이터 보정
    const updated = await Reservation.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'CONFIRMED' } }
    );
    if (updated.modifiedCount > 0) {
      console.log(`[migrate] reservation status updated: ${updated.modifiedCount}`);
    }

    // 3. 테스트 예약 생성 (해당 유저가 예약이 없을 때)
    const count = await Reservation.countDocuments({ user: user._id });
    if (count === 0) {
      const now = Date.now();
      const reservation = new Reservation({
        user: user._id,
        room: new mongoose.Types.ObjectId(), // 실제 Room 데이터와 연동 시 수정
        check_in: new Date(now + 24 * 60 * 60 * 1000),
        check_out: new Date(now + 2 * 24 * 60 * 60 * 1000),
        status: 'CONFIRMED',
        special_requests: '테스트 예약입니다.',
      });
      await reservation.save();
      console.log('[migrate] test reservation created');
    }

    console.log('[migrate] done');
    process.exit(0);
  } catch (err) {
    console.error('[migrate] error:', err);
    process.exit(1);
  }
}

main();
