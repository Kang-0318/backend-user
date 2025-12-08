import React, { useState, useEffect } from "react";
import HotelTypesTabs from "../../components/search/HotelTypesTabs";
import HotelResultsHeader from "../../components/search/HotelResultsHeader";
import HotelListCards from "../../components/search/HotelListCards";
import "../../styles/components/search/SearchPage.scss";
import { mockHotels } from "../../api/mockHotels"; 

const SearchPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHotels(mockHotels);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="search-page loading">Loading hotels...</div>;
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
            total={hotels.length}
            showing={hotels.length}
          />
          <HotelListCards hotels={hotels} />
        </div>
      </div>

  </div>
);

};

export default SearchPage;
