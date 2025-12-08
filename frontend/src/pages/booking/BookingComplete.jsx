import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/pages/booking/BookingComplete.scss";

const BookingComplete = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const roomId = searchParams.get("roomId");

  // 예약 번호 생성 (실제로는 서버에서 받아옴)
  const bookingNumber = `BK${Date.now()}`;

  return (
    <div className="booking-complete">
      <div className="complete-icon">✓</div>
      <h2>예약이 완료되었습니다!</h2>
      <div className="booking-details">
        <div className="detail-item">
          <span className="detail-label">예약 번호</span>
          <span className="detail-value">{bookingNumber}</span>
        </div>
        {checkIn && (
          <div className="detail-item">
            <span className="detail-label">체크인</span>
            <span className="detail-value">{checkIn}</span>
          </div>
        )}
        {checkOut && (
          <div className="detail-item">
            <span className="detail-label">체크아웃</span>
            <span className="detail-value">{checkOut}</span>
          </div>
        )}
        {guests && (
          <div className="detail-item">
            <span className="detail-label">인원</span>
            <span className="detail-value">{guests}명</span>
          </div>
        )}
      </div>
      <div className="complete-actions">
        <button className="btn btn--primary" onClick={() => navigate("/mypage/bookings")}>
          예약 내역 보기
        </button>
        <button className="btn btn--secondary" onClick={() => navigate("/")}>
          홈으로
        </button>
      </div>
    </div>
  );
};

export default BookingComplete;
