import React from "react";
import "../../styles/components/hotelpage/HotelReviews.scss";
import {
 renderStars,
 getRatingLabel,
 getRatingDistribution,
 calculateAverageRating,
} from "../../util/reviewHelper";

const HotelReviews = ({
 hotelId,
 rating,
 reviewCount,
 createReview,
 updateReview,
 deleteReview,
 reviews = [],
 getReviews,
}) => {
 console.log("HotelReviews reviews:", reviews);
 return (
  <div className="hotel-reviews">
   <div className="dep">
    <h3>리뷰 ({reviewCount})</h3>
    <button className="btn btn--primary">리뷰 작성</button>
   </div>
   <div className="dep">
    <div className="average-rating">
     {renderStars(calculateAverageRating(reviews))}
     <span>{calculateAverageRating(reviews)}</span>
     <span>{getRatingLabel(calculateAverageRating(reviews))}</span>
    </div>
   </div>
   {/* 리뷰 컴포넌트 내용 작성 */}
   <ul className="review-list">
    {reviews && reviews.length > 0 ? (
     reviews.map((review) => {
       const userName = review.userId?.name || review.user || "익명";
       const profileImageUrl = `https://i.pravatar.cc/150?img=${review.id}`;
       
       return (
        <li key={review.id}>
         <div className="profile-image">
          <img src={profileImageUrl} alt={userName} />
         </div>
         <div className="review-content">
          <div className="review-header">
           <span className="review-author">{userName}</span>
           <span className="review-rating">{renderStars(review.rating)}</span>
           <span className="review-date">
            {new Date(review.createdAt || review.date).toLocaleDateString()}
           </span>
          </div>
          <p className="review-comment">{review.comment}</p>
         </div>
        </li>
       );
     })
    ) : (
     <li>리뷰가 없습니다.</li>
    )}
   </ul>
  </div>
 );
};

export default HotelReviews;
