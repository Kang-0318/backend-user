// src/config/db.js
const mongoose = require('mongoose');

// 환경변수에서 MongoDB URI 가져옴 (.env 파일에 MONGO_URI 세팅 필요)
const MONGO_URI = process.env.MONGO_URI;

function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI 환경변수가 설정되어 있지 않습니다.');
  }

  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // 필요한 옵션 추가 가능
  }).then(() => {
    console.log('✅ MongoDB 연결 성공');
  }).catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err.message);
    process.exit(1);
  });
}

module.exports = connectDB;
