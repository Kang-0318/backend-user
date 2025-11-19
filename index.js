require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authroutes");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONT_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err.message));

app.get("/", (_req, res) => res.send("Hotel API OK"));
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.use((req, res) => res.status(404).json({ message: "요청 경로 없음" }));
app.use((err, req, res, next) => res.status(500).json({ message: "서버 오류", error: err.message }));

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
