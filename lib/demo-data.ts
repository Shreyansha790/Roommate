export type DemoListing = {
  id: string;
  title: string;
  locality: string;
  city: string;
  rent: number;
  deposit?: number;
  room_type: "single" | "shared" | "entire_flat";
  available_from: string;
  photos: string[];
  user_id: string;
  description?: string;
  amenities?: string[];
  tags?: string[];
  profiles: {
    id?: string;
    full_name: string;
    avatar_url?: string;
    is_verified: boolean;
    profession?: string;
    phone?: string;
    lifestyle?: {
      sleep?: string;
      cleanliness?: number;
      food?: string;
      smoking?: string;
      work?: string;
    };
  };
};

export const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "demo-1",
    title: "Penthouse Master Bedroom with Private Balcony & Sunset View",
    locality: "Indiranagar",
    city: "Bangalore",
    rent: 24500,
    deposit: 50000,
    room_type: "single",
    available_from: "2026-09-01",
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    user_id: "demo-user-1",
    description: "Spacious master suite in a designer 3BHK duplex. High-speed 1Gbps fiber, dedicated work desk, smart TV, modular kitchen access, and daily housekeeping. Looking for a chilled-out professional who respects personal space.",
    amenities: ["WiFi", "AC", "Washing Machine", "Parking", "Gym", "Power Backup"],
    tags: ["Techie Friendly", "Pet Friendly", "Night Owl"],
    profiles: {
      id: "demo-user-1",
      full_name: "Aanya Verma",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      is_verified: true,
      profession: "Product Designer @ Figma",
      phone: "+91 98765 43210",
      lifestyle: {
        sleep: "1:00 AM - 9:00 AM",
        cleanliness: 9,
        food: "Eggetarian / Flexible",
        smoking: "Balcony only",
        work: "Hybrid (2 days office)"
      }
    }
  },
  {
    id: "demo-2",
    title: "Chic Minimalist 2BHK Shared Room in Luxury High-Rise",
    locality: "Bandra West",
    city: "Mumbai",
    rent: 32000,
    deposit: 60000,
    room_type: "shared",
    available_from: "2026-08-28",
    photos: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
    ],
    user_id: "demo-user-2",
    description: "Prime Bandra location 5 mins from Carter Road promenade. Sea breeze, ambient natural lighting, Scandinavian interiors, and rooftop infinity pool. Seeking an easygoing roomie who loves creative energy.",
    amenities: ["WiFi", "AC", "Gym", "Swimming Pool", "Housekeeping"],
    tags: ["Creative Hub", "Fitness Buff", "Early Bird"],
    profiles: {
      id: "demo-user-2",
      full_name: "Kabir Mehra",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      is_verified: true,
      profession: "Cinematographer & Writer",
      phone: "+91 98200 11223",
      lifestyle: {
        sleep: "11:30 PM - 7:30 AM",
        cleanliness: 8,
        food: "Foodie / Non-Veg",
        smoking: "Non-smoker",
        work: "Freelance Studio"
      }
    }
  },
  {
    id: "demo-3",
    title: "Sunlit Bohemian Studio Loft with Terrace Garden",
    locality: "Hauz Khas Village",
    city: "Delhi",
    rent: 28000,
    deposit: 40000,
    room_type: "entire_flat",
    available_from: "2026-09-15",
    photos: [
      "https://images.unsplash.com/photo-1502005229762-ee152da92e06?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    user_id: "demo-user-3",
    description: "Peaceful oasis overlooking the deer park. Exposed brick walls, indoor plants, custom coffee bar, and huge terrace for morning yoga. Walking distance to Hauz Khas Social and metro.",
    amenities: ["WiFi", "AC", "Washing Machine", "Terrace Garden", "Pet Friendly"],
    tags: ["Boho Vibe", "Plant Parent", "Quiet Sanctuary"],
    profiles: {
      id: "demo-user-3",
      full_name: "Roshni Sen",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      is_verified: true,
      profession: "Architectural Consultant",
      phone: "+91 97110 44556",
      lifestyle: {
        sleep: "12:00 AM - 8:00 AM",
        cleanliness: 10,
        food: "Vegetarian",
        smoking: "Non-smoker",
        work: "Remote"
      }
    }
  },
  {
    id: "demo-4",
    title: "Modern Smart-Home 1BHK in Gated Tech Township",
    locality: "Hitec City",
    city: "Hyderabad",
    rent: 19500,
    deposit: 35000,
    room_type: "single",
    available_from: "2026-09-01",
    photos: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"
    ],
    user_id: "demo-user-4",
    description: "Fully automated smart home with Alexa lighting, dual monitors workstation, ergonomic Herman Miller chair, clubhouse with Olympic pool, tennis court, and 24/7 security. Ideal for software devs.",
    amenities: ["WiFi", "AC", "Gym", "Tennis Court", "Smart Home", "EV Charging"],
    tags: ["Tech Savvy", "Gamer", "Fitness"],
    profiles: {
      id: "demo-user-4",
      full_name: "Vikram Reddy",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      is_verified: true,
      profession: "AI Systems Engineer @ Microsoft",
      phone: "+91 94400 33221",
      lifestyle: {
        sleep: "2:00 AM - 10:00 AM",
        cleanliness: 8,
        food: "Flexible",
        smoking: "Non-smoker",
        work: "Full Remote"
      }
    }
  },
  {
    id: "demo-5",
    title: "Cozy Furnished Room in Green Gated Community",
    locality: "Koregaon Park",
    city: "Pune",
    rent: 14000,
    deposit: 25000,
    room_type: "single",
    available_from: "2026-08-30",
    photos: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
    ],
    user_id: "demo-user-5",
    description: "Tree-lined boulevard vibes in Pune's trendiest neighborhood. Cozy room with queen bed, wardrobe, wide study desk, attached washroom, and sunny balcony. Walking distance to German Bakery and cafes.",
    amenities: ["WiFi", "AC", "Washing Machine", "Cafe Nearby", "Balcony"],
    tags: ["Coffee Lover", "Chill Vibe", "Music Enthusiast"],
    profiles: {
      id: "demo-user-5",
      full_name: "Tanvi Deshmukh",
      avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      is_verified: true,
      profession: "Brand Strategist",
      phone: "+91 99220 88776",
      lifestyle: {
        sleep: "12:30 AM - 8:30 AM",
        cleanliness: 9,
        food: "Vegetarian",
        smoking: "Occasional social",
        work: "Hybrid"
      }
    }
  },
  {
    id: "demo-6",
    title: "Ultra-Modern Golf Course Road 3BHK Shared Flat",
    locality: "DLF Phase 5",
    city: "Gurgaon",
    rent: 27000,
    deposit: 50000,
    room_type: "single",
    available_from: "2026-09-10",
    photos: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ],
    user_id: "demo-user-6",
    description: "Premium high-rise apartment in DLF Phase 5 right on Golf Course Road. Features floor-to-ceiling glass windows, central AC, modern modular kitchen, full power backup, concierge, and fitness center.",
    amenities: ["WiFi", "AC", "Concierge", "Gym", "Power Backup", "Parking"],
    tags: ["Corporate Pro", "Clean Freak", "Weekend Traveler"],
    profiles: {
      id: "demo-user-6",
      full_name: "Siddharth Khanna",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      is_verified: true,
      profession: "Management Consultant @ Bain",
      phone: "+91 98111 22334",
      lifestyle: {
        sleep: "11:00 PM - 6:30 AM",
        cleanliness: 10,
        food: "Flexible",
        smoking: "Non-smoker",
        work: "Office Focused"
      }
    }
  }
];

