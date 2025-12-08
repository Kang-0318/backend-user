import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getMockHotelRooms } from "../../api/mockHotelRooms";
import { getHotelRooms } from "../../api/hotelClient";
import "../../styles/pages/booking/BookingStepLayout.scss";

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true" || false;

const BookingStepLayout = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get("roomId");

  // 날짜 및 인원
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  // 객실
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // 추가 옵션
  const [extras, setExtras] = useState({
    breakfast: false,
    parking: false,
    wifi: false,
    spa: false,
  });

  // 결제
  const [paymentMethod, setPaymentMethod] = useState("card");

  const today = new Date().toISOString().split("T")[0];

  const extrasOptions = [
    { id: "breakfast", label: "조식", price: 25000 },
    { id: "parking", label: "주차", price: 15000 },
    { id: "wifi", label: "WiFi", price: 0 },
    { id: "spa", label: "스파 이용", price: 50000 },
  ];

  useEffect(() => {
    const loadRooms = async () => {
      try {
        if (USE_REAL_API) {
          const roomsData = await getHotelRooms(hotelId);
          setRooms(roomsData);
        } else {
          const roomsData = getMockHotelRooms(hotelId);
          setRooms(roomsData);
        }
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setRoomsLoading(false);
      }
    };

    loadRooms();
  }, [hotelId]);

  useEffect(() => {
    if (preselectedRoomId && rooms.length > 0) {
      const room = rooms.find((r) => r.id === preselectedRoomId);
      if (room) {
        setSelectedRoom(room);
      }
    }
  }, [preselectedRoomId, rooms]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateExtrasTotal = () => {
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

  const handleExtraChange = (id) => {
    setExtras((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = () => {
    if (!checkIn || !checkOut) {
      alert("체크인과 체크아웃 날짜를 선택해주세요.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.");
      return;
    }

    if (!selectedRoom) {
      alert("객실을 선택해주세요.");
      return;
    }

    const params = new URLSearchParams();
    params.append("roomId", selectedRoom.id);
    params.append("checkIn", checkIn);
    params.append("checkOut", checkOut);
    params.append("guests", guests.toString());
    params.append("extras", JSON.stringify(extras));

    navigate(`/booking/${hotelId}/complete?${params.toString()}`);
  };

  const nights = calculateNights();
  const extrasTotal = calculateExtrasTotal();
  const total = calculateTotal();

  return (
    <div className="booking-step-layout">
      <div className="booking-container inner">
        <h1>예약하기</h1>
        <div className="booking-content">
          {/* 날짜 및 인원 선택 */}
          <section className="booking-section">
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
            {nights > 0 && (
              <div className="nights-info">
                <p>총 {nights}박</p>
              </div>
            )}
          </section>

          {/* 객실 선택 */}
          <section className="booking-section">
            <h2>객실 선택</h2>
            {roomsLoading ? (
              <div className="loading">로딩 중...</div>
            ) : (
              <div className="rooms-list">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`room-card ${selectedRoom?.id === room.id ? "selected" : ""}`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="room-image">
                      <img src={room.images[0]} alt={room.name} />
                    </div>
                    <div className="room-info">
                      <h3>{room.name}</h3>
                      <p className="room-type">{room.type}</p>
                      <p className="room-price">₩{room.price.toLocaleString()} / 박</p>
                    </div>
                    <div className="room-select">
                      <input
                        type="radio"
                        name="room"
                        checked={selectedRoom?.id === room.id}
                        onChange={() => setSelectedRoom(room)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 추가 옵션 */}
          <section className="booking-section">
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
            {extrasTotal > 0 && nights > 0 && (
              <div className="extras-total">
                <p>추가 옵션 총액 (1박 기준): ₩{extrasTotal.toLocaleString()}</p>
              </div>
            )}
          </section>

          {/* 결제 정보 */}
          <section className="booking-section">
            <h2>결제 정보</h2>
            <div className="payment-content">
              <div className="booking-summary">
                <h3>예약 요약</h3>
                {selectedRoom && nights > 0 ? (
                  <>
                    <div className="summary-item">
                      <p>객실: {selectedRoom.name}</p>
                      <p>₩{selectedRoom.price.toLocaleString()} × {nights}박</p>
                    </div>
                    <div className="summary-item">
                      <p>체크인: {checkIn}</p>
                      <p>체크아웃: {checkOut}</p>
                    </div>
                    <div className="summary-item">
                      <p>인원: {guests}명</p>
                    </div>
                    {extrasTotal > 0 && (
                      <div className="summary-item">
                        <p>추가 옵션</p>
                        <p>₩{(extrasTotal * nights).toLocaleString()}</p>
                      </div>
                    )}
                    <div className="summary-total">
                      <p>총 결제 금액</p>
                      <p className="total-price">₩{total.toLocaleString()}</p>
                    </div>
                  </>
                ) : (
                  <p className="summary-empty">날짜와 객실을 선택해주세요.</p>
                )}
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
          </section>

          {/* 결제 버튼 */}
          <div className="booking-actions">
            <button className="btn btn--primary btn--block btn--lg" onClick={handleSubmit}>
              예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStepLayout;
