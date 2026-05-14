export type DemoListing = {
  id: string;
  title: string;
  locality: string;
  city: string;
  rent: number;
  room_type: "single" | "shared" | "entire_flat";
  available_from: string;
  photos: string[];
  user_id: string;
  profiles: {
    full_name: string;
    is_verified: boolean;
  };
};

export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "demo-1",
    title: "Sunny 2BHK Room Near Metro",
    locality: "Koramangala",
    city: "Bengaluru",
    rent: 18000,
    room_type: "single",
    available_from: "2026-06-01",
    photos: ["https://placehold.co/640x400?text=Koramangala+Room"],
    user_id: "demo-user-1",
    profiles: { full_name: "Riya Shah", is_verified: true }
  },
  {
    id: "demo-2",
    title: "Shared Room in Gated Society",
    locality: "Hinjewadi",
    city: "Pune",
    rent: 9500,
    room_type: "shared",
    available_from: "2026-05-20",
    photos: ["https://placehold.co/640x400?text=Hinjewadi+Shared"],
    user_id: "demo-user-2",
    profiles: { full_name: "Karan Mehta", is_verified: false }
  },
  {
    id: "demo-3",
    title: "Entire Studio Flat for Working Professional",
    locality: "Andheri East",
    city: "Mumbai",
    rent: 32000,
    room_type: "entire_flat",
    available_from: "2026-06-10",
    photos: ["https://placehold.co/640x400?text=Andheri+Studio"],
    user_id: "demo-user-3",
    profiles: { full_name: "Aman Kapoor", is_verified: true }
  }
];
