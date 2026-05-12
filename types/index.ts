export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  locality: string;
  city: string;
  rent: number;
  room_type: string;
  available_from: string;
  is_active: boolean;
  description: string;
  photos: string[];
}

export interface RoommateProfile {
  id: string;
  user_id: string;
  sleep_time: string;
  cleanliness: string;
  guests_policy: string;
  food_pref: string;
  smoking: boolean;
  profession: string;
}
