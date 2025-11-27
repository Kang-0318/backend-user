// src/user/model.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ERD 기반: user 정보 필드와 상태 관리
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  address: { type: String },
  birthdate: { type: Date },
  profile_image_url: { type: String },
  status: { type: String, enum: ["ACTIVE", "INACTIVE", "BANNED"], default: "ACTIVE" },
  created_at: { type: Date, default: Date.now }
});

// 비밀번호 해시 저장 메서드
userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// 비밀번호 등 민감값 제외 JSON 응답
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);

// src/user/model.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ERD 기반: user 정보 필드와 상태 관리
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  address: { type: String },
  birthdate: { type: Date },
  profile_image_url: { type: String },
  status: { type: String, enum: ["ACTIVE", "INACTIVE", "BANNED"], default: "ACTIVE" },
  created_at: { type: Date, default: Date.now }
});

// 비밀번호 해시 저장 메서드
userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// 비밀번호 등 민감값 제외 JSON 응답
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
