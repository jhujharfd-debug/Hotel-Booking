export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  amenities: string[];
  priceMin: number;
  featured: boolean;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  size: string;
  bedType: string;
  capacity: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  availableCount: number;
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelLocation: string;
  hotelImage: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  totalPrice: number;
  nights: number;
  status: 'confirmed' | 'cancelled';
  bookingDate: string;
}

export interface SearchQuery {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
