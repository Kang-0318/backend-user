// src/common/response.js

// 성공 응답
function success(res, data, message = "성공", status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }
  
  // 실패/에러 응답
  function error(res, message = "요청 실패", status = 400, data = null) {
    return res.status(status).json({
      success: false,
      message,
      data,
    });
  }
  
  // 예외 캐치 처리용 미들웨어
  function errorHandler(err, req, res, next) {
    // 에러 핸들 미들웨어로 express에 직접 등록 가능
    return error(res, err.message || "서버 오류", err.status || 500);
  }
  
  module.exports = {
    success,
    error,
    errorHandler,
  };
  