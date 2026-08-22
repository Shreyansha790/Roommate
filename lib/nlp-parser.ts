import { DEMO_LISTINGS, DemoListing } from "./demo-data";

export interface ParsedSearchVectors {
  rawQuery: string;
  budget?: {
    min?: number;
    max?: number;
    target?: number;
    confidence: number;
  };
  geoFence?: {
    city?: string;
    locality?: string;
    subLocalities?: string[];
    metroProximityRequired?: boolean;
    confidence: number;
  };
  roomType?: "single" | "shared" | "entire_flat";
  lifestyleSync: {
    sleepRhythm?: "night_owl" | "early_bird" | "flexible";
    cleanlinessMin?: number;
    foodPreference?: "veg" | "nonveg" | "flexible";
    smoking?: boolean;
    petsAllowed?: boolean;
    socialBattery?: "introvert" | "ambivert" | "extrovert";
    workStyle?: "wfh" | "hybrid" | "office";
  };
  amenityTokens: string[];
  vibeTokens: string[];
  extractedTokensCount: number;
}

export function parseNlpQuery(query: string): ParsedSearchVectors {
  const normalized = (query || "").toLowerCase().trim();
  const result: ParsedSearchVectors = {
    rawQuery: query || "",
    lifestyleSync: {},
    amenityTokens: [],
    vibeTokens: [],
    extractedTokensCount: 0,
  };

  if (!normalized) return result;

  // 1. Budget extraction
  const rangeMatch = normalized.match(
    /(?:between\s+)?(?:₹|rs\.?|inr)?\s*(\d+(?:k)?)\s*(?:and|to|-)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:k)?)/i
  );
  if (rangeMatch) {
    const parseVal = (v: string) => (v.endsWith("k") ? parseFloat(v) * 1000 : parseFloat(v));
    const minVal = parseVal(rangeMatch[1]);
    const maxVal = parseVal(rangeMatch[2]);
    result.budget = {
      min: Math.min(minVal, maxVal),
      max: Math.max(minVal, maxVal),
      confidence: 0.95,
    };
    result.extractedTokensCount++;
  } else {
    const maxMatch = normalized.match(/(?:under|below|max|<=|<|upto|within)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:k)?)/i);
    const minMatch = normalized.match(/(?:above|min|>=|>)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:k)?)/i);
    const parseVal = (v: string) => (v.endsWith("k") ? parseFloat(v) * 1000 : parseFloat(v));

    if (maxMatch || minMatch) {
      result.budget = {
        max: maxMatch ? parseVal(maxMatch[1]) : undefined,
        min: minMatch ? parseVal(minMatch[1]) : undefined,
        confidence: 0.9,
      };
      result.extractedTokensCount++;
    }
  }

  // 2. Geo-fence extraction
  const localitiesMap: Record<string, { locality: string; city: string }> = {
    indiranagar: { locality: "Indiranagar", city: "Bangalore" },
    koramangala: { locality: "Koramangala", city: "Bangalore" },
    "hsr layout": { locality: "HSR Layout", city: "Bangalore" },
    hsr: { locality: "HSR Layout", city: "Bangalore" },
    whitefield: { locality: "Whitefield", city: "Bangalore" },
    bellandur: { locality: "Bellandur", city: "Bangalore" },
    marathahalli: { locality: "Marathahalli", city: "Bangalore" },
    "electronic city": { locality: "Electronic City", city: "Bangalore" },
    "bandra west": { locality: "Bandra West", city: "Mumbai" },
    bandra: { locality: "Bandra West", city: "Mumbai" },
    andheri: { locality: "Andheri", city: "Mumbai" },
    juhu: { locality: "Juhu", city: "Mumbai" },
    powai: { locality: "Powai", city: "Mumbai" },
    "hauz khas": { locality: "Hauz Khas Village", city: "Delhi" },
    "hauz khas village": { locality: "Hauz Khas Village", city: "Delhi" },
    saket: { locality: "Saket", city: "Delhi" },
    "dlf phase 5": { locality: "DLF Phase 5", city: "Gurgaon" },
    "golf course road": { locality: "DLF Phase 5", city: "Gurgaon" },
    gurgaon: { locality: "DLF Phase 5", city: "Gurgaon" },
    hitec: { locality: "Hitec City", city: "Hyderabad" },
    "hitec city": { locality: "Hitec City", city: "Hyderabad" },
    gachibowli: { locality: "Gachibowli", city: "Hyderabad" },
    madhapur: { locality: "Madhapur", city: "Hyderabad" },
    "koregaon park": { locality: "Koregaon Park", city: "Pune" },
    koregaon: { locality: "Koregaon Park", city: "Pune" },
    "viman nagar": { locality: "Viman Nagar", city: "Pune" },
    hinjawadi: { locality: "Hinjawadi", city: "Pune" },
    bangalore: { locality: "", city: "Bangalore" },
    mumbai: { locality: "", city: "Mumbai" },
    delhi: { locality: "", city: "Delhi" },
    hyderabad: { locality: "", city: "Hyderabad" },
    pune: { locality: "", city: "Pune" },
  };

  for (const [key, val] of Object.entries(localitiesMap)) {
    if (normalized.includes(key)) {
      result.geoFence = {
        city: val.city,
        locality: val.locality || undefined,
        metroProximityRequired: normalized.includes("metro"),
        confidence: val.locality ? 0.95 : 0.85,
      };
      result.extractedTokensCount++;
      break;
    }
  }

  // 3. Room type
  if (
    normalized.includes("single") ||
    normalized.includes("private room") ||
    normalized.includes("master bedroom") ||
    normalized.includes("1rk")
  ) {
    result.roomType = "single";
    result.extractedTokensCount++;
  } else if (
    normalized.includes("shared") ||
    normalized.includes("twin") ||
    normalized.includes("flatmate") ||
    normalized.includes("roommate")
  ) {
    result.roomType = "shared";
    result.extractedTokensCount++;
  } else if (
    normalized.includes("entire flat") ||
    normalized.includes("full flat") ||
    normalized.includes("studio") ||
    normalized.includes("entire apartment")
  ) {
    result.roomType = "entire_flat";
    result.extractedTokensCount++;
  }

  // 4. Lifestyle vectors
  if (
    normalized.includes("night owl") ||
    normalized.includes("late night") ||
    normalized.includes("nocturnal")
  ) {
    result.lifestyleSync.sleepRhythm = "night_owl";
    result.extractedTokensCount++;
  } else if (
    normalized.includes("early bird") ||
    normalized.includes("morning person") ||
    normalized.includes("early riser")
  ) {
    result.lifestyleSync.sleepRhythm = "early_bird";
    result.extractedTokensCount++;
  }

  if (
    normalized.includes("clean") ||
    normalized.includes("neat") ||
    normalized.includes("tidy") ||
    normalized.includes("clean freak")
  ) {
    result.lifestyleSync.cleanlinessMin = 8;
    result.extractedTokensCount++;
  }

  if (normalized.includes("vegan")) {
    result.lifestyleSync.foodPreference = "veg";
    result.vibeTokens.push("vegan");
    result.extractedTokensCount++;
  } else if (
    normalized.includes("veg") ||
    normalized.includes("vegetarian") ||
    normalized.includes("pure veg") ||
    normalized.includes("jain")
  ) {
    result.lifestyleSync.foodPreference = "veg";
    result.extractedTokensCount++;
  } else if (
    normalized.includes("non-veg") ||
    normalized.includes("nonveg") ||
    normalized.includes("meat")
  ) {
    result.lifestyleSync.foodPreference = "nonveg";
    result.extractedTokensCount++;
  }

  if (
    normalized.includes("non-smoker") ||
    normalized.includes("no smoking") ||
    normalized.includes("smoke free")
  ) {
    result.lifestyleSync.smoking = false;
    result.extractedTokensCount++;
  } else if (
    normalized.includes("smoker") ||
    normalized.includes("smoking friendly") ||
    normalized.includes("420")
  ) {
    result.lifestyleSync.smoking = true;
    result.extractedTokensCount++;
  }

  if (
    normalized.includes("pet") ||
    normalized.includes("dog") ||
    normalized.includes("cat") ||
    normalized.includes("pets allowed")
  ) {
    result.lifestyleSync.petsAllowed = true;
    result.vibeTokens.push("pet_friendly");
    result.extractedTokensCount++;
  }

  if (
    normalized.includes("wfh") ||
    normalized.includes("remote") ||
    normalized.includes("work from home")
  ) {
    result.lifestyleSync.workStyle = "wfh";
    result.extractedTokensCount++;
  } else if (normalized.includes("hybrid")) {
    result.lifestyleSync.workStyle = "hybrid";
    result.extractedTokensCount++;
  } else if (normalized.includes("office") || normalized.includes("onsite")) {
    result.lifestyleSync.workStyle = "office";
    result.extractedTokensCount++;
  }

  if (
    normalized.includes("introvert") ||
    normalized.includes("quiet") ||
    normalized.includes("peaceful")
  ) {
    result.lifestyleSync.socialBattery = "introvert";
    result.extractedTokensCount++;
  } else if (
    normalized.includes("extrovert") ||
    normalized.includes("party") ||
    normalized.includes("social")
  ) {
    result.lifestyleSync.socialBattery = "extrovert";
    result.extractedTokensCount++;
  }

  // 5. Amenity tokens
  const amenitiesList = [
    { token: "wifi", keywords: ["wifi", "wi-fi", "internet", "fiber", "broadband"] },
    { token: "ac", keywords: ["ac", "air condition", "aircon", "central ac"] },
    { token: "gym", keywords: ["gym", "fitness", "workout", "weights"] },
    { token: "pool", keywords: ["pool", "swimming"] },
    { token: "parking", keywords: ["parking", "garage", "car park"] },
    { token: "power_backup", keywords: ["power backup", "generator", "ups"] },
    { token: "washing_machine", keywords: ["washing machine", "laundry"] },
    { token: "balcony", keywords: ["balcony", "terrace", "deck"] },
    { token: "housekeeping", keywords: ["housekeeping", "maid", "cleaning"] },
    { token: "smart_home", keywords: ["smart home", "alexa", "automation"] },
    { token: "ev_charging", keywords: ["ev charging", "ev charger"] },
  ];

  for (const item of amenitiesList) {
    if (item.keywords.some((kw) => normalized.includes(kw))) {
      result.amenityTokens.push(item.token);
      result.extractedTokensCount++;
    }
  }

  return result;
}

export function rankListingsByQuery(
  listings: any[],
  query: string,
  _userProfile?: any
): Array<any & { matchScore: number }> {
  const parsed = parseNlpQuery(query);

  return listings
    .map((listing) => {
      let score = 50; // base score

      // Budget check
      if (parsed.budget) {
        if (parsed.budget.max && listing.rent <= parsed.budget.max) score += 20;
        else if (parsed.budget.max && listing.rent > parsed.budget.max) score -= 25;

        if (parsed.budget.min && listing.rent >= parsed.budget.min) score += 10;
        else if (parsed.budget.min && listing.rent < parsed.budget.min) score -= 15;
      }

      // Geo check
      if (parsed.geoFence) {
        if (parsed.geoFence.city && listing.city?.toLowerCase() === parsed.geoFence.city.toLowerCase()) {
          score += 15;
        }
        if (
          parsed.geoFence.locality &&
          listing.locality?.toLowerCase().includes(parsed.geoFence.locality.toLowerCase())
        ) {
          score += 25;
        }
      }

      // Room type check
      if (parsed.roomType && listing.room_type === parsed.roomType) {
        score += 15;
      }

      // Lifestyle matches
      if (parsed.lifestyleSync.sleepRhythm === "night_owl" && listing.tags?.includes("Night Owl")) {
        score += 10;
      }
      if (
        parsed.lifestyleSync.workStyle === "wfh" &&
        listing.profiles?.lifestyle?.work?.toLowerCase().includes("remote")
      ) {
        score += 10;
      }
      if (
        parsed.lifestyleSync.petsAllowed &&
        (listing.tags?.includes("Pet Friendly") || listing.amenities?.includes("Pet Friendly"))
      ) {
        score += 10;
      }

      // Amenities match
      if (parsed.amenityTokens.length > 0 && listing.amenities) {
        const matches = parsed.amenityTokens.filter((a) =>
          listing.amenities?.some((item: string) => item.toLowerCase().includes(a.replace("_", " ")))
        );
        score += (matches.length / parsed.amenityTokens.length) * 15;
      }

      return {
        ...listing,
        matchScore: Math.min(100, Math.max(0, Math.round(score))),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
