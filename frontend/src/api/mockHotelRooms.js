// 호텔 ID별 객실 데이터
const mockHotelRoomsData = {
  1: [
    {
      id: "r1-1",
      name: "디럭스 더블룸",
      type: "더블 침대 · 2인",
      price: 240000,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      ],
    },
    {
      id: "r1-2",
      name: "프리미어 트윈룸",
      type: "트윈 침대 · 3인",
      price: 280000,
      images: [
        "https://images.unsplash.com/photo-1505692794401-7f6a4d3131d9",
      ],
    },
    {
      id: "r1-3",
      name: "스위트룸",
      type: "킹 침대 · 4인",
      price: 450000,
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      ],
    },
  ],
  2: [
    {
      id: "r2-1",
      name: "오션뷰 디럭스룸",
      type: "더블 침대 · 2인",
      price: 310000,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      ],
    },
    {
      id: "r2-2",
      name: "해변뷰 스위트",
      type: "킹 침대 · 4인",
      price: 520000,
      images: [
        "https://images.unsplash.com/photo-1505692794401-7f6a4d3131d9",
      ],
    },
    {
      id: "r2-3",
      name: "프리미엄 패밀리룸",
      type: "트윈 침대 · 5인",
      price: 680000,
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      ],
    },
  ],
  3: [
    {
      id: "r3-1",
      name: "스탠다드 더블룸",
      type: "더블 침대 · 2인",
      price: 310000,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      ],
    },
    {
      id: "r3-2",
      name: "디럭스 트윈룸",
      type: "트윈 침대 · 3인",
      price: 380000,
      images: [
        "https://images.unsplash.com/photo-1505692794401-7f6a4d3131d9",
      ],
    },
  ],
  4: [
    {
      id: "r4-1",
      name: "클래식 더블룸",
      type: "더블 침대 · 2인",
      price: 310000,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      ],
    },
    {
      id: "r4-2",
      name: "프리미엄 스위트",
      type: "킹 침대 · 4인",
      price: 550000,
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      ],
    },
    {
      id: "r4-3",
      name: "패밀리 스위트",
      type: "트윈 침대 · 6인",
      price: 750000,
      images: [
        "https://images.unsplash.com/photo-1505692794401-7f6a4d3131d9",
      ],
    },
  ],
};

// 호텔 ID에 따라 객실 목록을 반환하는 함수
export const getMockHotelRooms = (hotelId) => {
  const id = parseInt(hotelId);
  return mockHotelRoomsData[id] || mockHotelRoomsData[1]; // 기본값은 ID 1
};

// 기존 호환성을 위한 기본 export
export const mockHotelRooms = mockHotelRoomsData[1];
