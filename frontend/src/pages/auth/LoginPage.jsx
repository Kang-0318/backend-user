// frontend/src/pages/auth/LoginPage.jsx
import React from "react";
import AuthImageWrap from "../../components/auth/AuthImageWrap";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="auth-layout-page">
      <div className="auth-layout-container">
        <div className="auth-layout-content">
          <div className="auth-layout-form-section">
            <LoginForm />
          </div>
          <div className="auth-layout-image-section">
            <AuthImageWrap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
