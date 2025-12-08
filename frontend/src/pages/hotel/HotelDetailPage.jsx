// src/pages/hotelpage/HotelDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Amenities from "../../components/hotelpage/Amenities";
import AvailableRooms from "../../components/hotelpage/AvailableRooms";
import HotelDetailHeader from "../../components/hotelpage/HotelDetailHeader";
import HotelMap from "../../components/hotelpage/HotelMap";
import HotelOverview from "../../components/hotelpage/HotelOverview";
import HotelReviews from "../../components/hotelpage/HotelReviews";
import "../../styles/pages/hotelpage/HotelDetailPage.scss";

// 실제 API 클라이언트
import { getHotelDetail, getHotelRooms } from "../../api/hotelClient";
import { getReviews } from "../../api/reviewClient";

// 목업 데이터 (개발/테스트용)
import { getMockHotelDetail } from "../../api/mockHotelDetail";
import { getMockHotelRooms } from "../../api/mockHotelRooms";
import { mockReviews } from "../../api/mockReviews";

// 실제 API 사용 여부
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === "true" || false;

const HotelDetailPage = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadHotelData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (USE_REAL_API) {
          const [hotelData, roomsData, reviewsData] = await Promise.all([
            getHotelDetail(hotelId),
            getHotelRooms(hotelId),
            getReviews(hotelId),
          ]);

          // 백엔드 Hotel 스키마 → 프론트용 필드 매핑
          const mappedHotel = {
            ...hotelData,
            description: hotelData.description,
            ratingAverage:
              hotelData.reviewStats?.average ?? hotelData.ratingAverage ?? 0,
            ratingCount:
              hotelData.reviewStats?.total ?? hotelData.ratingCount ?? 0,
            tags: hotelData.tags || [],
            amenities: hotelData.facilities || hotelData.amenities || [],
            address: hotelData.location?.address || hotelData.address || "",
            location: hotelData.location || null,
          };

          setHotel(mappedHotel);
          setRooms(roomsData || []);
          setReviews(reviewsData || []);
        } else {
          const hotelDetail = getMockHotelDetail(hotelId);
          setHotel(hotelDetail);
          setRooms(getMockHotelRooms(hotelId));
          setReviews(mockReviews);
        }
      } catch (err) {
        console.error("Failed to load hotel data:", err);
        setError("호텔 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadHotelData();
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
      <HotelOverview
        description={hotel.description}
        rating={hotel.ratingAverage}
        reviewCount={hotel.ratingCount}
        tags={hotel.tags}
      />
      <Amenities amenities={hotel.amenities} />
      <AvailableRooms rooms={rooms} hotelId={hotelId} />
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
