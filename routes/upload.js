const express = require("express");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { presignPut } = require("../src/s3");

router.post('/profile-image-presign', async (req, res) => {
  const { filename, contentType } = req.body;
  if (!filename || !contentType) return res.status(400).json({ message: "파일명/타입 필수" });
  const key = `profile/${Date.now()}-${uuidv4()}${path.extname(filename)}`;
  const url = await presignPut(key, contentType);
  res.json({ url, key });
});

module.exports = router;
