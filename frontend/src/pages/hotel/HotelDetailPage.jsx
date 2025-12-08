import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Amenities from "../../components/hotelpage/Amenities";
import AvailableRooms from "../../components/hotelpage/AvailableRooms";
import HotelDetailHeader from "../../components/hotelpage/HotelDetailHeader";
import HotelGallery from "../../components/hotelpage/HotelGallery";
import HotelMap from "../../components/hotelpage/HotelMap";
import HotelOverview from "../../components/hotelpage/HotelOverview";
import HotelReviews from "../../components/hotelpage/HotelReviews";
import "../../styles/pages/hotelpage/HotelDetailPage.scss";

// 🔹 백엔드 연동 전까지는 목업 데이터로 화면을 먼저 구현
import { mockHotelDetail } from "../../api/mockHotelDetail";
import { mockHotelRooms } from "../../api/mockHotelRooms";
import { mockReviews } from "../../api/mockReviews";
const HotelDetailPage = () => {
  const { hotelId } = useParams(); // URL에서 호텔 ID 추출
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // TODO: 백엔드 연동 시 실제 API(getHotelDetail, getHotelRooms, getReviews)로 교체
    try {
      setLoading(true);
      // 현재는 hotelId와 상관없이 동일한 목업 데이터를 사용
      setHotel(mockHotelDetail);
      setRooms(mockHotelRooms);
      setReviews(mockReviews);
      setError(null);
    } catch (err) {
      console.error("Failed to load mock hotel data:", err);
      setError("호텔 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  if (loading) {
    return (
      <div className="hotel-detail-container inner loading">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="hotel-detail-container inner error">Error: {error}</div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-detail-container inner">
        호텔을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="hotel-detail-container inner">
      <HotelDetailHeader hotel={hotel} />
      <HotelGallery images={hotel.images} hotelName={hotel.name} />
      <HotelOverview
        description={hotel.description}
        rating={hotel.ratingAverage}
        reviewCount={hotel.ratingCount}
        tags={hotel.tags}
      />
      <Amenities amenities={hotel.amenities} />
      <AvailableRooms rooms={rooms} />
      <HotelMap address={hotel.address} location={hotel.location} />
      <HotelReviews
        hotelId={hotelId}
        rating={hotel.ratingAverage}
        reviewCount={hotel.ratingCount}
        reviews={reviews}
      />
    </div>
  );
};

export default HotelDetailPage;
