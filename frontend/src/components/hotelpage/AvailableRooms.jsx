import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/hotelpage/AvailableRooms.scss";


const AvailableRooms = ({ rooms, hotelId }) => {
 const navigate = useNavigate();

 const handleBookRoom = (room) => {
  const params = new URLSearchParams();
  params.append("roomId", room.id);
  navigate(`/booking/${hotelId}?${params.toString()}`);
 };

 return (
  <div className="available-rooms">
    <h3>예약 가능한 객실</h3>
   {rooms.map((room) => (
    <div key={room.id} className="room-card">
     <div className="left">
      <div className="img-wrap">
       <img src={room.images[0]} alt={room.name} />
      </div>
      <div className="room-info">
       <h3 className="room-name">{room.name}</h3>
       <p className="room-type">{room.type}</p>
      </div>
     </div>
     <div className="right">
      <p className="room-price">{room.price.toLocaleString()}원</p>
      <button 
       className="btn btn--primary" 
       onClick={() => handleBookRoom(room)}
      >
       예약하기
      </button>
     </div>
    </div>
   ))}
  </div>
 );
};

export default AvailableRooms;
