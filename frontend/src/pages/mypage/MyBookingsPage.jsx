import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { mockReservations } from "../../api/mockReservations";
import "../../styles/pages/mypage/MyBookingsPage.scss";

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("upcoming");

  const filteredReservations = mockReservations.filter(
    (reservation) => reservation.status === filter
  );

  const handleDownloadTicket = (reservationId) => {
    console.log("Download ticket for reservation:", reservationId);
    // TODO: 티켓 다운로드 기능 구현
  };

  return (
    <div className="bookings-page">
      {/* 예약내역 섹션 헤더 */}
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

      {/* 예약 카드 리스트 */}
      <div className="reservations-list">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="hotel-logo">
                <img
                  src={reservation.hotelLogo}
                  alt={reservation.hotelName}
                  onError={(e) => {
                    e.target.src = "/images/hotel.jpg";
                  }}
                />
              </div>
              <div className="reservation-info">
                <h4 className="hotel-name">{reservation.hotelName}</h4>
                <div className="check-dates">
                  <div className="check-item">
                    <span className="check-label">Check-In</span>
                    <span className="check-date">
                      {reservation.checkIn.date}
                    </span>
                    <div className="check-time">
                      <span className="time-icon">🕐</span>
                      <span>체크인 {reservation.checkIn.time}</span>
                    </div>
                  </div>
                  <div className="check-item">
                    <span className="check-label">Check Out</span>
                    <span className="check-date">
                      {reservation.checkOut.date}
                    </span>
                    <div className="check-time">
                      <span className="time-icon">🕐</span>
                      <span>체크아웃 {reservation.checkOut.time}</span>
                    </div>
                  </div>
                </div>
                <div className="room-number">
                  <span className="room-icon">🏢</span>
                  <span>방번호 {reservation.roomNumber}</span>
                </div>
              </div>
              <button
                className="download-button"
                onClick={() => handleDownloadTicket(reservation.id)}
              >
                Download Ticket
                <span className="arrow-icon">→</span>
              </button>
            </div>
          ))
        ) : (
          <div className="no-reservations">
            예약 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
