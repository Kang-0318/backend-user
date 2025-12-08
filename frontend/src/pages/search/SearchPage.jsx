// src/pages/search/SearchPage.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import HotelListCards from "../../components/search/HotelListCards";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import "../../styles/components/search/SearchPage.scss";

const SearchPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError("");

      // 예: 기본 검색 조건 없이 전체 호텔 목록 조회
      const res = await axiosInstance.get("/hotels", {
        params: {
          page: 1,
          limit: 20,
          sort: "rating",
        },
      });

      const payload = res.data?.data || res.data;
      const list = payload?.hotels || [];
      const pagination = payload?.pagination || {};

      setHotels(list);
      setTotal(pagination.total ?? list.length);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "호텔 목록을 불러오는 중 오류가 발생했습니다.";
      setError(msg);
      setHotels([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) {
    return <div className="search-page loading">Loading hotels...</div>;
  }

  if (error) {
    return <div className="search-page error">{error}</div>;
  }

  return (
    <div className="search-page">
      {/* 🔥 검색폼(form-container) 밖에서 가장 먼저 배치 */}
      <div className="tabs-wrapper">
        <HotelTypesTabs />
      </div>

      {/* 호텔 리스트 섹션 */}
      <div className="search-content full-width">
        <div className="hotel-results">
          <HotelResultsHeader
            total={total}
            showing={hotels.length}
          />
          <HotelListCards hotels={hotels} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
