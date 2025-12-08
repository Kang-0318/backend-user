import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { authenticateUser } from "../../api/mockUser";
// import "../../styles/components/auth/LoginForm.scss";

const LoginForm = () => {
 const [formData, setFormData] = useState({
  email: "",
  password: "",
  rememberMe: false,
 });
 const [error, setError] = useState("");
 const { login } = useContext(AuthContext);
 const navigate = useNavigate();

 const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
   ...prev,
   [name]: type === "checkbox" ? checked : value,
  }));
  // 입력 시 에러 메시지 초기화
  setError("");
 };

 const handleSubmit = (e) => {
  e.preventDefault();

  // 임시 사용자 인증
  const result = authenticateUser(formData.email, formData.password);

  if (result.success) {
   // 로그인 성공
   login(result.user);
   // 토큰 저장
   localStorage.setItem("accessToken", result.token);
   // 마이페이지로 이동
   navigate("/mypage");
  } else {
   // 로그인 실패
   setError(result.message);
  }
 };

 const handleSocialLogin = (provider) => {
  // 소셜 로그인 로직 구현 예정
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
     />
    </div>
    <div className="form-group">
     <label className="form-label">Password</label>
     <div className="password-input-wrapper">
      <input
       type="password"
       name="password"
       className="form-input"
       placeholder="1234"
       value={formData.password}
       onChange={handleInputChange}
       required
      />
      <button type="button" className="password-toggle">
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
    <button type="submit" className="btn btn--primary btn--block">
     Login
    </button>{" "}
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
