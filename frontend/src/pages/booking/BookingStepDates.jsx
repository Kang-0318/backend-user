import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/pages/booking/BookingStepDates.scss";

const BookingStepDates = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const today = new Date().toISOString().split("T")[0];

  const handleNext = () => {
    if (!checkIn || !checkOut) {
      alert("체크인과 체크아웃 날짜를 선택해주세요.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.");
      return;
    }

    const params = new URLSearchParams();
    if (roomId) params.append("roomId", roomId);
    params.append("checkIn", checkIn);
    params.append("checkOut", checkOut);
    params.append("guests", guests);

    navigate(`/booking/${hotelId}/room?${params.toString()}`);
  };

  return (
    <div className="booking-step-dates">
      <h2>날짜 및 인원 선택</h2>
      <div className="dates-form">
        <div className="form-group">
          <label htmlFor="checkIn">체크인</label>
          <input
            type="date"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkOut">체크아웃</label>
          <input
            type="date"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || today}
          />
        </div>
        <div className="form-group">
          <label htmlFor="guests">인원 수</label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            min={1}
            max={10}
          />
        </div>
      </div>
      <div className="booking-actions">
        <button className="btn btn--primary" onClick={handleNext}>
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default BookingStepDates;
