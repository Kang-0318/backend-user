import React, { useState, useEffect } from "react";
import WishlistCard from "../../components/wishlist/WishlistCard";
import WishlistEmpty from "../../components/wishlist/WishlistEmpty";
import "../../styles/pages/mypage/WishlistPage.scss";

const WishlistPage = () => {
  const [wishlistHotels, setWishlistHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재는 목업 데이터를 사용합니다. 실제 API로 교체 가능합니다.
    const loadWishlist = () => {
      const mockWishlist = [
        {
          id: 1,
          name: "Grand Hyatt Seoul",
          location: "서울",
          image: "/images/hotel-1.jpg",
          imageCount: 8,
          stars: 5,
          amenities: 25,
          rating: 9.2,
          ratingLabel: "Excellent",
          reviews: 1234,
          basePrice: 250000,
        },
        {
          id: 2,
          name: "Paradise City",
          location: "인천",
          image: "/images/hotel-2.jpg",
          imageCount: 12,
          stars: 5,
          amenities: 30,
          rating: 8.9,
          ratingLabel: "Very Good",
          reviews: 856,
          basePrice: 320000,
        },
        {
          id: 3,
          name: "The Shilla Seoul",
          location: "서울",
          image: "/images/hotel-3.png",
          imageCount: 10,
          stars: 5,
          amenities: 28,
          rating: 9.5,
          ratingLabel: "Exceptional",
          reviews: 2103,
          basePrice: 450000,
        },
      ];

      setWishlistHotels(mockWishlist);
      setLoading(false);
    };

    loadWishlist();
  }, []);

  const handleRemoveWishlist = (hotelId) => {
    setWishlistHotels((prev) => prev.filter((hotel) => hotel.id !== hotelId));
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__header">
        <h1 className="wishlist-page__title">찜 목록</h1>
        <p className="wishlist-page__subtitle">찜한 숙소 {wishlistHotels.length}개</p>
      </div>

      <div className="wishlist-page__content">
        {wishlistHotels.length === 0 ? (
          <WishlistEmpty />
        ) : (
          <div className="wishlist-page__list">
            {wishlistHotels.map((hotel) => (
              <WishlistCard key={hotel.id} hotel={hotel} onRemove={handleRemoveWishlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
