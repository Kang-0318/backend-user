// config/db.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI 환경 변수가 설정되어 있지 않습니다.');
  }

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB 연결 성공');
    })
    .catch((err) => {
      console.error('❌ MongoDB 연결 실패:', err.message);
      process.exit(1);
    });
}

module.exports = connectDB;
