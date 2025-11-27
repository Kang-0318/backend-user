// user/model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User 스키마 정의
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // 기본 조회에서 제외
    },
    name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    profile_image_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'BANNED'],
      default: 'ACTIVE',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    // 로그인/잠금 관련 필드 (노션 요구사항 반영용)
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastLoginAttempt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// 비밀번호 해시 설정
userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

// 비밀번호 비교
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// 응답 시 민감 정보 제거
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.failedLoginAttempts;
  delete obj.lastLoginAttempt;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
