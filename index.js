require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./user/route');
const uploadRoutes = require('./upload/route');
const reservationRoutes = require('./reservation/route');
const { errorHandler } = require('./common/response');

const app = express();
const PORT = process.env.PORT || 3000;

// DB 연결
connectDB();

app.use(
  cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

// 헬스 체크
app.get('/', (_req, res) => res.send('Hotel API OK'));

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reservation', reservationRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: '요청 경로 없음' }));
// 에러 핸들러
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
