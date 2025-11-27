// upload/route.js
const express = require('express');
const multer = require('multer');

const router = express.Router();
const authMiddleware = require('../common/authMiddleware');
const { uploadToS3, presignPut } = require('./s3');

// 메모리 저장소 (S3 직업로드용)
const upload = multer({ storage: multer.memoryStorage() });

// 헬스체크용
router.get('/ping', (req, res) => {
  return res.json({ ok: true });
});

// presigned URL 발급 (프론트에서 직접 PUT 업로드)
router.post('/presign', authMiddleware, async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if (!filename || !contentType) {
      return res.status(400).json({ message: 'filename, contentType는 필수입니다.' });
    }

    const ext = filename.includes('.') ? filename.substring(filename.lastIndexOf('.')) : '';
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const url = await presignPut(key, contentType);
    return res.json({ url, key });
  } catch (err) {
    console.error('[presign] error:', err);
    return res.status(500).json({ message: 'presign 생성 중 오류가 발생했습니다.' });
  }
});

// 서버 경유 업로드 (선택 사항)
router.post('/file', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '파일이 필요합니다.' });
    }
    const url = await uploadToS3(req.file, 'uploads');
    return res.status(201).json({ url });
  } catch (err) {
    console.error('[upload] error:', err);
    return res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
