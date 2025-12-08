import React, { useState, useEffect } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../styles/components/hotelpage/HotelGalleryModal.scss";

const HotelGalleryModal = ({
  images = [],
  hotelName = "",
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // 모달 열릴 때 스크롤 방지

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {/* 메인 이미지 */}
        <div className="modal-main-image">
          <img
            src={images[currentIndex]}
            alt={`${hotelName} - Image ${currentIndex + 1}`}
          />

          {/* 이전/다음 버튼 */}
          {images.length > 1 && (
            <>
              <button
                className="modal-nav-btn modal-nav-prev"
                onClick={handlePrevious}
              >
                <FaChevronLeft />
              </button>
              <button
                className="modal-nav-btn modal-nav-next"
                onClick={handleNext}
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* 이미지 카운터 */}
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* 썸네일 네비게이션 */}
        {images.length > 1 && (
          <div className="modal-thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail-item ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelGalleryModal;