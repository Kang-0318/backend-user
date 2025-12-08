import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // 백엔드 로그인 API 호출
      const res = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // 응답 형식 가정: { success, data: { user, accessToken, refreshToken } }
      const payload = res.data?.data || res.data;

      if (!payload?.accessToken || !payload?.user) {
        throw new Error("로그인 응답 형식이 올바르지 않습니다.");
      }

      // Context에 로그인 처리 (토큰/유저 저장)
      login({
        user: payload.user,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });

      // rememberMe 처리: 필요 시 토큰을 sessionStorage로 전환하는 등 정책 적용 가능
      // 현재는 localStorage에 저장되므로 별도 처리 불필요

      // 마이페이지로 이동
      navigate("/mypage");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "로그인 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // 소셜 로그인은 추후 /api/auth/{provider}로 리다이렉트 구현 가능
    console.log(`${provider} login`);
  };

  return (
    <div className="common-form">
      <div className="form-header">
        <h1 className="form-title">Login</h1>
        <p className="form-subtitle">로그인하세요</p>
      </div>

      <form className="form-content" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="user@test.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="password-input-wrapper">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => {
                // 필요 시 비밀번호 표시 토글 구현
              }}
              aria-label="Toggle password visibility"
            >
              👁️
            </button>
          </div>
        </div>

        <div className="form-options">
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <span className="checkbox-label">비밀번호 기억하기</span>
          </label>
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--block"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>

        <div className="divider">
          <span className="divider-text">회원가입하세요</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="btn btn--accent btn--block"
        >
          Sign Up
        </button>

        <div className="social-login">
          <p className="social-login-text">Or login with</p>
          <div className="social-buttons">
            <button
              type="button"
              className="btn--social facebook"
              onClick={() => handleSocialLogin("facebook")}
            >
              <span className="social-icon">f</span>
            </button>
            <button
              type="button"
              className="btn--social google"
              onClick={() => handleSocialLogin("google")}
            >
              <span className="social-icon">G</span>
            </button>
            <button
              type="button"
              className="btn--social apple"
              onClick={() => handleSocialLogin("apple")}
            >
              <span className="social-icon">🍎</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
