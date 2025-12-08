import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/search/HotelListCards.scss";

const HotelListCards = ({ hotels = [] }) => {
  const navigate = useNavigate();

  if (!hotels || hotels.length === 0) {
    return (
      <div className="hotel-list-cards empty">호텔을 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="hotel-list-cards">
      {hotels.map((hotel, i) => {
        const price = hotel.basePrice ?? hotel.price ?? 0;

        return (
          <div
            key={i}
            className="hotel-card"
            onClick={() => navigate(`/hotels/${hotel.id}`)}
          >
            {/* ========== LEFT IMAGE (꽉 채우기) ========== */}
            <div className="hotel-image">
              <img src={hotel.image} alt={hotel.name} />
              <div className="image-count">{hotel.imageCount} images</div>
            </div>

            {/* ========== RIGHT CONTENT ========== */}
            <div className="hotel-content">

              {/* -------- TOP TEXT + PRICE -------- */}
              <div className="hotel-header">
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <div className="hotel-location">{hotel.location}</div>

                  <div className="hotel-meta">
                    <span className="hotel-stars">
                      {"⭐".repeat(hotel.stars)} {hotel.stars} Star Hotel
                    </span>
                    <span className="hotel-amenities">
                      🏨 {hotel.amenities}+ Amenities
                    </span>
                  </div>

                  <div className="hotel-rating">
                    <span className="rating-score">{hotel.rating}</span>
                    <span className="rating-label">{hotel.ratingLabel}</span>
                    <span className="rating-reviews">
                      {hotel.reviews} reviews
                    </span>
                  </div>
                </div>

                <div className="hotel-price">
                  <div className="price-label">starting from</div>
                  <div className="price-amount">
                    ₩{Number(price).toLocaleString()}/night
                  </div>
                  <div className="price-note">excl. tax</div>
                </div>
              </div>

              {/* -------- BOTTOM BUTTONS -------- */}
              <div className="hotel-footer">
                <button
                  className="wishlist-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  ❤️
                </button>

                <button
                  className="view-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/hotels/${hotel.id}`);
                  }}
                >
                  View Place
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HotelListCards;
