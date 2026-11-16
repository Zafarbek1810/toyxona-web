export type AmenityId =
  | "parking"
  | "wifi"
  | "ac"
  | "stage"
  | "led"
  | "sound"
  | "kids"
  | "halal";

export type SessionId = "morning" | "lunch" | "evening";

export type Hall = {
  id: string;
  name: string;
  capacity: number;
  price: number | null;
};

export type Venue = {
  id: number;
  name: string;
  region: string;
  district: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  minGuests: number;
  maxGuests: number;
  priceFrom: number | null;
  image: string;
  gallery: string[];
  amenities: AmenityId[];
  halls: Hall[];
  menu: string[];
  rating: number;
  reviewCount: number;
};

export type Specialist = {
  id: number;
  name: string;
  categoryId: string;
  region: string;
  district?: string;
  phone: string;
  priceFrom: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  bio: string;
  featured?: boolean;
};

export type Review = {
  id: number | string;
  target: "venue" | "specialist";
  targetId: number;
  name: string;
  rating: number;
  text: string;
  reply?: string | null;
  createdAt: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: number | string;
  venueId: number;
  venueName: string;
  image: string;
  session: SessionId;
  date: string;
  guests: number;
  name: string;
  phone: string;
  note: string;
  status: BookingStatus;
  createdAt: string;
};

export type Favorite = {
  kind: "venue" | "specialist";
  id: number;
};

export type VenueQuery = {
  q?: string;
  date?: string;
  region?: string;
  district?: string;
  guests?: number;
  amenities?: AmenityId[];
};
