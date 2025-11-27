// upload/s3.js
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 서버에서 직접 업로드할 때 사용
async function uploadToS3(file, folder = 'uploads') {
  const ext = path.extname(file.originalname || '');
  const key = `${folder}/${Date.now()}-${uuidv4()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
  return url;
}

// 프론트가 직접 PUT 업로드할 수 있게 presigned URL 발급
async function presignPut(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5분
  return url;
}

// 객체 삭제
async function deleteObject(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await s3.send(command);
}

module.exports = {
  uploadToS3,
  presignPut,
  deleteObject,
};
