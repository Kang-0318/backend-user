// common/response.js

// 성공 응답
function success(res, data = null, message = '성공', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

// 실패/에러 응답
function error(res, message = '요청 실패', status = 400, data = null) {
  return res.status(status).json({
    success: false,
    message,
    data,
  });
}

// 전역 에러 핸들러 미들웨어
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);
  const status = err.status || 500;
  const message = err.message || '서버 오류가 발생했습니다.';
  return error(res, message, status);
}

module.exports = {
  success,
  error,
  errorHandler,
};
