import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthed = !!user;

  // 로그인
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // 로그인 유지 + 개발용 자동 로그인
  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    } else {
      // ===============================
      // 🔥 개발용 자동 로그인 코드 (백엔드 없이 MyPage 작업 가능)
      // ===============================
      const devUser = {
        name: "Tomhoon",
        email: "gnsdl9079@gmail.com",
        profileImage: "",
        phone: "010-5555-5555",
        address: "경기도 화성시 도메이아파트 101동 101호",
        dateOfBirth: "1999-01-01",
      };
      localStorage.setItem("user", JSON.stringify(devUser));
      setUser(devUser);
    }

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, isAuthed, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
