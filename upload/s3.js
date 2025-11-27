// src/upload/s3.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// .env 파일에 아래 설정 필요
// AWS_ACCESS_KEY_ID=...
// AWS_SECRET_ACCESS_KEY=...
// AWS_REGION=ap-northeast-2
// S3_BUCKET=your-bucket-name

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucket = process.env.S3_BUCKET;

// 파일을 S3에 업로드
async function uploadToS3(file, dir = 'profile') {
  const fileExt = file.originalname.split('.').pop();
  const fileKey = `${dir}/${uuidv4()}.${fileExt}`;

  const params = {
    Bucket: bucket,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // 공개 URL 반환용
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(err);
      resolve(data.Location); // 업로드된 파일의 S3 URL 반환
    });
  });
}

module.exports = { uploadToS3 };
