// src/pages/mypage/MyBookingsPage.jsx
import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/pages/mypage/MyBookingsPage.scss";

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("upcoming");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReservations = async (status) => {
    try {
      setLoading(true);
      setError("");

      // 예: GET /api/reservation/me?status=upcoming
      const res = await axiosInstance.get("/reservation/me", {
        params: { status },
      });

      const list = res.data?.data || res.data?.reservations || [];
      setReservations(list);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "예약 내역을 불러오는 중 오류가 발생했습니다.";
      setError(msg);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchReservations(filter);
  }, [user, filter]);

  const handleDownloadTicket = (reservationId) => {
    console.log("Download ticket for reservation:", reservationId);
    // TODO: /api/reservation/:id/ticket 같은 엔드포인트와 연동
  };

  return (
    <div className="bookings-page">
      <div className="bookings-section-header">
        <div className="section-title-wrapper">
          <span className="book-icon">🛏️</span>
          <h3 className="section-title">예약내역</h3>
        </div>
        <div className="section-controls">
          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="reservations-loading">예약 내역을 불러오는 중...</div>
      ) : error ? (
        <div className="reservations-error">{error}</div>
      ) : (
        <div className="reservations-list">
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <div key={reservation._id} className="reservation-card">
                <div className="hotel-logo">
                  <img
                    src={
                      reservation.hotelLogo ||
                      reservation.hotel_image_url ||
                      "/images/hotel.jpg"
                    }
                    alt={reservation.hotelName || reservation.hotel_name}
                    onError={(e) => {
                      e.target.src = "/images/hotel.jpg";
                    }}
                  />
                </div>
                <div className="reservation-info">
                  <h4 className="hotel-name">
                    {reservation.hotelName || reservation.hotel_name}
                  </h4>
                  <div className="check-dates">
                    <div className="check-item">
                      <span className="check-label">Check-In</span>
                      <span className="check-date">
                        {reservation.checkInDate ||
                          reservation.checkIn ||
                          reservation.check_in}
                      </span>
                      <div className="check-time">
                        <span className="time-icon">🕐</span>
                        <span>
                          체크인{" "}
                          {reservation.checkInTime ||
                            reservation.check_in_time ||
                            "15:00"}
                        </span>
                      </div>
                    </div>
                    <div className="check-item">
                      <span className="check-label">Check Out</span>
                      <span className="check-date">
                        {reservation.checkOutDate ||
                          reservation.checkOut ||
                          reservation.check_out}
                      </span>
                      <div className="check-time">
                        <span className="time-icon">🕐</span>
                        <span>
                          체크아웃{" "}
                          {reservation.checkOutTime ||
                            reservation.check_out_time ||
                            "11:00"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="room-number">
                    <span className="room-icon">🏢</span>
                    <span>
                      방번호{" "}
                      {reservation.roomNumber ||
                        reservation.room_number ||
                        "-"}
                    </span>
                  </div>
                </div>
                <button
                  className="download-button"
                  onClick={() => handleDownloadTicket(reservation._id)}
                >
                  Download Ticket
                  <span className="arrow-icon">→</span>
                </button>
              </div>
            ))
          ) : (
            <div className="no-reservations">예약 내역이 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
