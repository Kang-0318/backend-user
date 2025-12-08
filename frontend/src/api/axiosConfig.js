import axios from "axios";

// API 기본 URL 설정
// 개발 환경: Vite 프록시 사용 (/api -> http://localhost:3000)
// 프로덕션: Nginx 프록시 사용
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 전송을 위한 설정
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 처리 (인증 실패)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 새로운 액세스 토큰 요청
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          // 🔽 백엔드 라우트 구조에 맞게 /api/auth/refresh 로 수정
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그인 페이지로 이동
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 에러 메시지 처리
    const errorMessage =
      error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.";

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

export default axiosInstance;
