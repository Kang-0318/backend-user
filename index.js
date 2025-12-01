require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { errorHandler } = require('./common/response');

const authRoutes = require('./user/route');
const uploadRoutes = require('./upload/route');
const reservationRoutes = require('./reservation/route');
const hotelRoutes = require('./hotel/route');
const paymentRoutes = require('./payment/route');
const etcRoutes = require('./etc/route');

const app = express();
const PORT = process.env.PORT || 3000;

// DB 연결
connectDB();

// 미들웨어 설정
app.use(helmet());
app.use(morgan('combined'));
app.use(
  cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 헬스 체크
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: '🏨 Hotel Reservation API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      hotels: '/api/hotels',
      payments: '/api/payments',
      etc: '/api/etc',
      reservations: '/api/reservation',
      uploads: '/api/upload'
    }
  });
});

// ===== 모든 라우트 등록 (404 전에!) =====
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/etc', etcRoutes);

// ===== 404 핸들러 (라우트들 다음에!) =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청하신 API 경로를 찾을 수 없습니다.',
    path: req.originalUrl
  });
});

// ===== 전역 에러 핸들러 (마지막!) =====
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Hotel API Server running: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
});
