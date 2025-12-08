// src/components/mypage/MyProfilePhoto.jsx
import React, { useContext, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";

const MyProfilePhoto = () => {
  const { user, setUser } = useContext(AuthContext);
  const [previewImage, setPreviewImage] = useState(user?.profile_image_url || null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setPreviewImage(base64);

      // 로컬 상태 업데이트
      const updatedUser = { ...user, profile_image_url: base64 };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 서버에 profile_image_url 저장
      try {
        setUploading(true);
        await axiosInstance.patch("/auth/me", {
          profile_image_url: base64,
        });
      } catch (err) {
        console.error("프로필 이미지 업데이트 실패", err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const initialLetter = user?.name?.charAt(0) || "U";

  return (
    <div className="my-profile-photo">
      {previewImage ? (
        <img src={previewImage} alt="Profile" className="profile-image" />
      ) : (
        <div className="profile-placeholder">{initialLetter}</div>
      )}
      <label className="edit-photo-button">
        {uploading ? "⏳" : "✏️"}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

export default MyProfilePhoto;
