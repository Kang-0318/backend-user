import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/pages/booking/BookingStepExtras.scss";

const BookingStepExtras = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  const [extras, setExtras] = useState({
    breakfast: false,
    parking: false,
    wifi: false,
    spa: false,
  });

  const extrasOptions = [
    { id: "breakfast", label: "조식", price: 25000 },
    { id: "parking", label: "주차", price: 15000 },
    { id: "wifi", label: "WiFi", price: 0 },
    { id: "spa", label: "스파 이용", price: 50000 },
  ];

  const handleExtraChange = (id) => {
    setExtras((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const calculateExtrasTotal = () => {
    return extrasOptions.reduce((total, option) => {
      return extras[option.id] ? total + option.price : total;
    }, 0);
  };

  const handleNext = () => {
    if (!roomId || !checkIn || !checkOut) {
      navigate(`/booking/${hotelId}`);
      return;
    }

    const params = new URLSearchParams();
    params.append("roomId", roomId);
    params.append("checkIn", checkIn);
    params.append("checkOut", checkOut);
    params.append("guests", guests || "2");
    
    // 추가 옵션을 JSON으로 인코딩하여 전달
    params.append("extras", JSON.stringify(extras));

    navigate(`/booking/${hotelId}/payment?${params.toString()}`);
  };

  return (
    <div className="booking-step-extras">
      <h2>추가 옵션 선택</h2>
      <div className="extras-list">
        {extrasOptions.map((option) => (
          <div
            key={option.id}
            className={`extra-item ${extras[option.id] ? "selected" : ""}`}
            onClick={() => handleExtraChange(option.id)}
          >
            <div className="extra-info">
              <h3>{option.label}</h3>
              {option.price > 0 && <p className="extra-price">₩{option.price.toLocaleString()}</p>}
              {option.price === 0 && <p className="extra-price">무료</p>}
            </div>
            <div className="extra-checkbox">
              <input
                type="checkbox"
                checked={extras[option.id]}
                onChange={() => handleExtraChange(option.id)}
              />
            </div>
          </div>
        ))}
      </div>
      {calculateExtrasTotal() > 0 && (
        <div className="extras-total">
          <p>추가 옵션 총액: ₩{calculateExtrasTotal().toLocaleString()}</p>
        </div>
      )}
      <div className="booking-actions">
        <button
          className="btn btn--secondary"
          onClick={() => navigate(`/booking/${hotelId}/room?${searchParams.toString()}`)}
        >
          이전
        </button>
        <button className="btn btn--primary" onClick={handleNext}>
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default BookingStepExtras;
