// scripts/migrate.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// 데이터베이스 연결
connectDB();

// 모델 import (도메인별 파일 구조에 맞게)
const User = require('../src/user/model');
const Reservation = require('../reservation/model');

async function main() {
  try {
    // 1. 테스트 회원 정보 생성 (없는 경우만 추가)
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
      console.log('[migrate] Test user created!');
    } else {
      console.log('[migrate] Test user already exists.');
    }

    // 2. 예약 데이터 status·필수값 보정 (기존 예약 중 status 없으면 "CONFIRMED"로 세팅)
    const result = await Reservation.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'CONFIRMED' } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[migrate] Reservation status updated: ${result.modifiedCount}`);
    }

    // 3. 예시 추가: 중복 테스트 예약 생성
    const today = new Date();
    const reservations = await Reservation.find({ user: user._id });
    if (reservations.length === 0) {
      const newReservation = new Reservation({
        user: user._id,
        room: new mongoose.Types.ObjectId(), // 실제 room 모델/데이터 연동 시 수정
        check_in: new Date(today.getTime() + 86400000),
        check_out: new Date(today.getTime() + 172800000),
        status: 'CONFIRMED',
        special_requests: '테스트 예약',
      });
      await newReservation.save();
      console.log('[migrate] Test reservation created!');
    }

    // 모든 작업 종료
    console.log('[migrate] Database migration finished.');
    process.exit(0);
  } catch (err) {
    console.error('[migrate][error]', err);
    process.exit(1);
  }
}

main();
