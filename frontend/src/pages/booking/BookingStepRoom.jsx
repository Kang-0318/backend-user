import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getMockHotelRooms } from "../../api/mockHotelRooms";
import { getHotelRooms } from "../../api/hotelClient";
import "../../styles/pages/booking/BookingStepRoom.scss";

const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true" || false;

const BookingStepRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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

  const handleNext = () => {
    if (!selectedRoom) {
      alert("객실을 선택해주세요.");
      return;
    }

    if (!checkIn || !checkOut) {
      navigate(`/booking/${hotelId}`);
      return;
    }

    const params = new URLSearchParams();
    params.append("roomId", selectedRoom.id);
    params.append("checkIn", checkIn);
    params.append("checkOut", checkOut);
    params.append("guests", guests || "2");

    navigate(`/booking/${hotelId}/extras?${params.toString()}`);
  };

  if (loading) {
    return <div className="booking-step-room loading">로딩 중...</div>;
  }

  return (
    <div className="booking-step-room">
      <h2>객실 선택</h2>
      {checkIn && checkOut && (
        <div className="booking-summary">
          <p>
            체크인: {checkIn} | 체크아웃: {checkOut} | 인원: {guests || 2}명
          </p>
        </div>
      )}
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
      <div className="booking-actions">
        <button className="btn btn--secondary" onClick={() => navigate(`/booking/${hotelId}`)}>
          이전
        </button>
        <button className="btn btn--primary" onClick={handleNext}>
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default BookingStepRoom;
