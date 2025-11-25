// src/user/auditLog.js
const mongoose = require('mongoose');

// ERD 기준: 유저 이벤트 감사/이력 기록용 필드 구성
const AuditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // 이벤트 발생자
  action: { type: String, required: true, enum: [
    'register', 'login', 'update', 'deactivate', 'failLogin', 'changePassword'
  ]},
  resource: { type: String, required: true, enum: [
    'user', 'reservation', 'profile', 'auth'
  ]},
  targetId: { type: String }, // 영향받은 리소스(id), 예: 회원id, 예약id
  diff: { type: Object }, // 변경내역 기록용(정보수정시)
  ip: { type: String },    // IP주소(로깅 중요)
  ua: { type: String },    // 유저에이전트(브라우저/장치 정보)
}, { timestamps: true });

// 인덱스 추가로 이벤트정렬/검색 성능 향상
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ actor: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
