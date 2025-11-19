const mongoose = require("mongoose");
const AuditLogSchema= new mongoose.Schema({
  actor: { type: mongoose.Types.ObjectId, ref: "User" },
  action: { type: String, enum: ["create", "login", "update", "delete", "reserve", "cancel"] },
  resource: { type: String, enum: ["user", "reservation", "review"] },
  targetId: { type: String },
  diff: Object,
  ip: String,
  ua: String
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
