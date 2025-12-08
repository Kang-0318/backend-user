import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getMockHotelRooms } from "../../api/mockHotelRooms";
import { getHotelRooms } from "../../api/hotelClient";
import "../../styles/pages/booking/BookingStepPayment.scss";

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true" || false;

const BookingStepPayment = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  const extrasParam = searchParams.get("extras");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [extras, setExtras] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        let rooms = [];
        if (USE_REAL_API) {
          rooms = await getHotelRooms(hotelId);
        } else {
          rooms = getMockHotelRooms(hotelId);
        }
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
          setSelectedRoom(room);
        }
      } catch (error) {
        console.error("Failed to load room:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      loadRoom();
    }

    if (extrasParam) {
      try {
        setExtras(JSON.parse(extrasParam));
      } catch (e) {
        console.error("Failed to parse extras:", e);
      }
    }
  }, [hotelId, roomId, extrasParam]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateExtrasTotal = () => {
    const extrasOptions = [
      { id: "breakfast", price: 25000 },
      { id: "parking", price: 15000 },
      { id: "wifi", price: 0 },
      { id: "spa", price: 50000 },
    ];
    return extrasOptions.reduce((total, option) => {
      return extras[option.id] ? total + option.price : total;
    }, 0);
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    const roomTotal = selectedRoom.price * nights;
    const extrasTotal = calculateExtrasTotal() * nights;
    return roomTotal + extrasTotal;
  };

  const handleSubmit = () => {
    if (!selectedRoom || !checkIn || !checkOut) {
      alert("예약 정보가 불완전합니다.");
      return;
    }

    // 실제로는 API 호출로 예약 생성
    const params = new URLSearchParams();
    params.append("roomId", roomId);
    params.append("checkIn", checkIn);
    params.append("checkOut", checkOut);
    params.append("guests", guests || "2");
    if (extrasParam) params.append("extras", extrasParam);

    navigate(`/booking/${hotelId}/complete?${params.toString()}`);
  };

  if (loading) {
    return <div className="booking-step-payment loading">로딩 중...</div>;
  }

  if (!selectedRoom) {
    return <div className="booking-step-payment error">객실 정보를 불러올 수 없습니다.</div>;
  }

  const nights = calculateNights();
  const roomTotal = selectedRoom.price * nights;
  const extrasTotal = calculateExtrasTotal() * nights;
  const total = calculateTotal();

  return (
    <div className="booking-step-payment">
      <h2>결제 정보</h2>
      <div className="payment-content">
        <div className="booking-summary">
          <h3>예약 요약</h3>
          <div className="summary-item">
            <p>객실: {selectedRoom.name}</p>
            <p>₩{selectedRoom.price.toLocaleString()} × {nights}박</p>
          </div>
          <div className="summary-item">
            <p>체크인: {checkIn}</p>
            <p>체크아웃: {checkOut}</p>
          </div>
          <div className="summary-item">
            <p>인원: {guests || 2}명</p>
          </div>
          {extrasTotal > 0 && (
            <div className="summary-item">
              <p>추가 옵션</p>
              <p>₩{extrasTotal.toLocaleString()}</p>
            </div>
          )}
          <div className="summary-total">
            <p>총 결제 금액</p>
            <p className="total-price">₩{total.toLocaleString()}</p>
          </div>
        </div>
        <div className="payment-method">
          <h3>결제 수단</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              신용/체크카드
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              계좌이체
            </label>
          </div>
        </div>
      </div>
      <div className="booking-actions">
        <button
          className="btn btn--secondary"
          onClick={() => navigate(`/booking/${hotelId}/extras?${searchParams.toString()}`)}
        >
          이전
        </button>
        <button className="btn btn--primary" onClick={handleSubmit}>
          결제하기
        </button>
      </div>
    </div>
  );
};

export default BookingStepPayment;
