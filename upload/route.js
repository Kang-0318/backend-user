// src/upload/route.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // 메모리 방식(이미지, 파일 버퍼)

const authMiddleware = require('../common/authMiddleware');
const { uploadToS3 } = require('./s3'); // v2 방식: 서버가 직접 업로드
// v3 presign 방식: const { presignPut, presignGet, deleteObject } = require('./s3');

// 회원 프로필 이미지 업로드 (실제 파일)
router.post('/profile', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: '파일이 없습니다.' });
    const imageUrl = await uploadToS3(req.file, 'profile');
    // (옵션) 사용자 모델에 imageUrl 저장하는 로직 추가  
    res.json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 프론트엔드 직접 S3 PUT presigned url 발급
router.get('/profile/presign', authMiddleware, async (req, res) => {
  try {
    const { Key, ContentType } = req.query;
    // presign 방식: require('./s3').presignPut
    const { presignPut } = require('./s3');
    const url = await presignPut(Key, ContentType);
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// S3에서 파일 삭제(API)
router.delete('/profile', authMiddleware, async (req, res) => {
  try {
    const { Key } = req.body;
    const { deleteObject } = require('./s3');
    await deleteObject(Key);
    res.json({ success: true, message: '삭제 완료' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
