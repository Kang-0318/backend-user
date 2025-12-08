// src/components/mypage/MyProfile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/components/mypage/myProfile.scss";
import MyProfilePhoto from "./MyProfilePhoto";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [coverImage, setCoverImage] = useState(null);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayName = user?.name || "사용자";
  const displayEmail = user?.email || "";

  return (
    <div className="my-profile">
      <div
        className="my-profile-bg"
        style={{
          backgroundImage: coverImage ? `url(${coverImage})` : undefined,
        }}
      >
        <label className="upload-cover-button">
          ☁️ Upload new cover
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <MyProfilePhoto />

      <div className="profile-info">
        <h2 className="profile-name">{displayName}</h2>
        {displayEmail && <p className="profile-email">{displayEmail}</p>}
      </div>
    </div>
  );
};

export default MyProfile;
