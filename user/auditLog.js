// user/auditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // 이벤트 수행한 사용자
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['register', 'login', 'update', 'deactivate', 'failLogin', 'changePassword'],
    },
    resource: {
      type: String,
      required: true,
      enum: ['user', 'reservation', 'profile', 'auth'],
    },
    targetId: {
      type: String, // 영향을 받은 리소스 id (userId, reservationId 등)
    },
    diff: {
      type: Object, // 변경 전/후 값 기록용 (정보 수정 시)
    },
    ip: {
      type: String, // 요청 IP
    },
    ua: {
      type: String, // User-Agent
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ actor: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
