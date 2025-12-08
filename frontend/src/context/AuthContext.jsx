// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthed = !!user;

  // ========================
  // 로그인 성공 처리 (백엔드 응답 기준)
  // data: { user, accessToken, refreshToken }
  // ========================
  const login = (data) => {
    const { user: userData, accessToken, refreshToken } = data;

    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  // ========================
  // 로그아웃
  // ========================
  const logout = async () => {
    try {
      // 필요하면 서버에 로그아웃 API 호출 (예: POST /api/auth/logout)
      // await axiosInstance.post("/auth/logout");
    } catch (e) {
      // 실패해도 클라이언트 상태는 정리
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  // ========================
  // 앱 첫 로드 시: 토큰/유저 복원 + 백엔드에서 내 정보 확인
  // ========================
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");

        if (savedUser && accessToken) {
          // 일단 로컬에 저장된 정보로 상태 복원
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem("user");
          }
        }

        if (accessToken) {
          // 백엔드에서 최신 내 정보 조회 (토큰 유효성 검증)
          const res = await axiosInstance.get("/auth/me");
          const me = res.data?.data || res.data?.user || res.data;

          if (me) {
            setUser(me);
            localStorage.setItem("user", JSON.stringify(me));
          } else {
            // 응답 형식이 예상과 다르거나 실패 시 정리
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }
      } catch (err) {
        // 토큰 만료/검증 실패 등
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, isAuthed, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
