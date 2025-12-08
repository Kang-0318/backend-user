import React from "react";
import {
  FaStar,
  FaTree,
  FaGlassMartini,
  FaTheaterMasks,
  FaBroom,
  FaMapMarkerAlt,
  FaSmile,
  FaCrown,
} from "react-icons/fa";
import "../../styles/components/hotelpage/HotelOverview.scss";

const HotelOverview = ({ description, rating, reviewCount, tags = [] }) => {
  // 태그에 따른 아이콘 매핑 (한글 태그 지원)
  const tagIcons = {
    // 영어 태그
    park: { icon: <FaTree />, label: "Near park" },
    nightlife: { icon: <FaGlassMartini />, label: "Near nightlife" },
    theater: { icon: <FaTheaterMasks />, label: "Near theater" },
    clean: { icon: <FaBroom />, label: "Clean Hotel" },
    luxury: { icon: <FaCrown />, label: "Luxury" },
    beach: { icon: <FaTree />, label: "Beach" },
    family: { icon: <FaStar />, label: "Family Friendly" },
    // 한글 태그
    럭셔리: { icon: <FaCrown />, label: "럭셔리" },
    "좋은 위치": { icon: <FaMapMarkerAlt />, label: "좋은 위치" },
    "친절한 직원": { icon: <FaSmile />, label: "친절한 직원" },
    깨끗함: { icon: <FaBroom />, label: "깨끗함" },
    해변뷰: { icon: <FaTree />, label: "해변뷰" },
    리조트: { icon: <FaTree />, label: "리조트" },
    수영장: { icon: <FaTree />, label: "수영장" },
    스파: { icon: <FaTree />, label: "스파" },
    레스토랑: { icon: <FaGlassMartini />, label: "레스토랑" },
  };

  // 평점 텍스트 변환
  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Fair";
    return "Average";
  };

  // 별점을 별 아이콘으로 표시 (5개 별)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="star-filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="star-half" />);
      } else {
        stars.push(<FaStar key={i} className="star-empty" />);
      }
    }
    return stars;
  };

  return (
    <div className="hotel-overview">
      <h2 className="overview-title">Overview</h2>

      <div className="overview-features">
        {/* 평점 카드 */}
        <div className="feature-card rating-card">
          <div className="rating-stars">{renderStars(rating || 0)}</div>
          <div className="rating-score">{rating?.toFixed(1) || "N/A"}</div>
          <div className="rating-label">{getRatingText(rating)}</div>
          <div className="review-count">{reviewCount || 0} reviews</div>
        </div>

        {/* 태그/특징 카드들 */}
        {tags.slice(0, 4).map((tag, index) => {
          // 한글 태그는 그대로, 영어 태그는 소문자로 변환
          const tagKey = typeof tag === 'string' && /[가-힣]/.test(tag) ? tag : tag.toLowerCase();
          const tagData = tagIcons[tagKey] || { icon: <FaStar />, label: tag };

          return (
            <div key={index} className="feature-card">
              <div className="feature-icon">{tagData.icon}</div>
              <div className="feature-label">{tagData.label}</div>
            </div>
          );
        })}
      </div>

      {/* 호텔 설명 */}
      <div className="overview-description">
        <p>{description || "호텔 설명이 없습니다."}</p>
      </div>
    </div>
  );
};

export default HotelOverview;
