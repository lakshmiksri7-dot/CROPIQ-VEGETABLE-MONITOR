// Location & GPS Utility for CROPIQ Smart Cold Storage

export interface UserGeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  speed?: number | null;
  heading?: number | null;
  timestamp: number;
  address?: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  isLiveGps: boolean;
}

export interface NearbyPlaceDistance {
  id: string;
  name: string;
  type: 'storage' | 'mandi' | 'reefer';
  lat: number;
  lng: number;
  distanceKm: number;
  travelTimeMin: number;
  direction: string;
  details: string;
  pricePerKg?: number;
  temp?: number;
}

// Fallback / Preset agricultural zones across India for instant selection
export const REGIONAL_AGRO_PRESETS: { id: string; name: string; state: string; lat: number; lng: number }[] = [
  { id: 'cbe', name: 'Coimbatore & Pollachi Agri Zone (Tamil Nadu)', state: 'Tamil Nadu', lat: 10.9983, lng: 76.9620 },
  { id: 'mdu', name: 'Madurai & Oddanchatram Mandi Belt (Tamil Nadu)', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { id: 'jht', name: 'Jorhat Agri Hub & Tea Belt (Assam)', state: 'Assam', lat: 26.7509, lng: 94.2037 },
  { id: 'gwh', name: 'Guwahati Pamohi APMC Zone (Assam)', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { id: 'nsk', name: 'Nashik Onion & Tomato Valley (Maharashtra)', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { id: 'blr', name: 'Kolar & Bengaluru Peri-Urban Belt (Karnataka)', state: 'Karnataka', lat: 13.1367, lng: 78.1292 },
  { id: 'shl', name: 'Shillong Organic Plateau (Meghalaya)', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 }
];

// Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

// Calculate cardinal compass direction from origin to destination
export function calculateDirection(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const angle = (Math.atan2(dLon, dLat) * 180) / Math.PI;
  const normalized = (angle + 360) % 360;

  if (normalized >= 337.5 || normalized < 22.5) return 'N (North)';
  if (normalized >= 22.5 && normalized < 67.5) return 'NE (North-East)';
  if (normalized >= 67.5 && normalized < 112.5) return 'E (East)';
  if (normalized >= 112.5 && normalized < 157.5) return 'SE (South-East)';
  if (normalized >= 157.5 && normalized < 202.5) return 'S (South)';
  if (normalized >= 202.5 && normalized < 247.5) return 'SW (South-West)';
  if (normalized >= 247.5 && normalized < 292.5) return 'W (West)';
  return 'NW (North-West)';
}

// Real reverse geocoding via OpenStreetMap Nominatim with cached results
const geocodeCache = new Map<string, { address: string; city: string; state: string; postcode?: string }>();

export async function reverseGeocodeCoords(
  lat: number,
  lng: number
): Promise<{ address: string; city: string; state: string; road?: string; postcode?: string }> {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en,ta,hi'
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const road = addr.road || addr.pedestrian || addr.street || '';
      const suburb = addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || '';
      const city = addr.city || addr.town || addr.county || addr.district || 'Local Region';
      const state = addr.state || 'India';
      const postcode = addr.postcode || '';

      const parts = [road, suburb, city, state].filter(Boolean);
      const formattedAddress = parts.length > 0 ? parts.join(', ') : data.display_name?.split(',').slice(0, 3).join(',') || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;

      const result = {
        address: formattedAddress,
        city,
        state,
        road,
        postcode
      };
      geocodeCache.set(cacheKey, result);
      return result;
    }
  } catch {
    // Network or timeout failure fallback
  }

  // Fallback state identification by geographic coordinates
  let state = 'Live GPS Location';
  let city = 'Local Farm Area';
  if (lat >= 8.0 && lat <= 13.5 && lng >= 76.0 && lng <= 80.5) {
    state = 'Tamil Nadu';
    city = 'Coimbatore / Tamil Nadu Agri Zone';
  } else if (lat >= 24.0 && lat <= 28.5 && lng >= 89.5 && lng <= 96.0) {
    state = 'Assam';
    city = 'Brahmaputra Agro Basin';
  } else if (lat >= 18.0 && lat <= 21.0 && lng >= 72.5 && lng <= 76.0) {
    state = 'Maharashtra';
    city = 'Nashik / Western Maharashtra';
  } else if (lat >= 11.5 && lat <= 18.5 && lng >= 74.0 && lng <= 78.5) {
    state = 'Karnataka';
    city = 'Bengaluru Rural / Kolar Region';
  }

  const fallback = {
    address: `${city}, ${state} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`,
    city,
    state
  };
  return fallback;
}

// Request real browser GPS coordinates
export async function getCurrentGpsLocation(): Promise<UserGeoLocation> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser or environment.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;
        const geoInfo = await reverseGeocodeCoords(latitude, longitude);

        resolve({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          altitude: altitude ? Math.round(altitude) : null,
          speed: speed ? Math.round(speed * 3.6) : null, // convert m/s to km/h
          heading: heading ? Math.round(heading) : null,
          timestamp: position.timestamp,
          address: geoInfo.address,
          city: geoInfo.city,
          state: geoInfo.state,
          road: geoInfo.road,
          postcode: geoInfo.postcode,
          isLiveGps: true
        });
      },
      (error) => {
        let msg = 'Unable to retrieve your live GPS location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location access permission was denied. Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is temporarily unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );
  });
}

// Watch real-time continuous GPS location updates as device moves
export function watchGpsLocation(
  onUpdate: (loc: UserGeoLocation) => void,
  onError?: (err: Error) => void
): () => void {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    if (onError) onError(new Error('Geolocation not supported'));
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;
      const geoInfo = await reverseGeocodeCoords(latitude, longitude);

      onUpdate({
        latitude,
        longitude,
        accuracy: Math.round(accuracy),
        altitude: altitude ? Math.round(altitude) : null,
        speed: speed ? Math.round(speed * 3.6) : null,
        heading: heading ? Math.round(heading) : null,
        timestamp: position.timestamp,
        address: geoInfo.address,
        city: geoInfo.city,
        state: geoInfo.state,
        road: geoInfo.road,
        postcode: geoInfo.postcode,
        isLiveGps: true
      });
    },
    (error) => {
      if (onError) onError(new Error(error.message));
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 2000
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

// Generate realistic nearby cold storage facilities and mandis anchored around the user's REAL live GPS coordinates
export function getDynamicFacilitiesForLocation(userLat: number, userLng: number, userCity?: string, userState?: string) {
  // Offset coordinates slightly (3-15 km) from user's live position to create real geographical POIs
  // 0.01 deg lat ~= 1.11 km, 0.01 deg lng ~= 1.05 km
  const isTN = userLat >= 8.0 && userLat <= 13.5 && userLng >= 76.0 && userLng <= 80.5;

  const storageUnits = [
    {
      id: 'unit-01',
      name: isTN ? 'Coimbatore Central Solar Cold Hub (Unit 1)' : `${userCity || 'Regional'} Solar Cold Storage (U1)`,
      lat: userLat + 0.024,
      lng: userLng + 0.018,
      temp: 8.5,
      humidity: 88,
      solarBatteryPercent: 92,
      backupHours: 19,
      capacityKg: 5000,
      occupiedKg: 3200,
      status: 'optimal' as const,
      zone: isTN ? 'Coimbatore Agri Park' : `${userCity || 'Local'} Farm Cluster`
    },
    {
      id: 'unit-02',
      name: isTN ? 'Pollachi Organic Cold Vault (Unit 2)' : `${userState || 'District'} Agro Cold Hub (U2)`,
      lat: userLat - 0.038,
      lng: userLng + 0.032,
      temp: 2.8,
      humidity: 94,
      solarBatteryPercent: 84,
      backupHours: 16,
      capacityKg: 4000,
      occupiedKg: 2850,
      status: 'cooling' as const,
      zone: isTN ? 'Pollachi Green Belt' : `${userCity || 'Rural'} FPO Cluster`
    },
    {
      id: 'unit-03',
      name: isTN ? 'Mettupalayam Mountain Produce Hub (Unit 3)' : 'Express Reefer Hub & Depot (U3)',
      lat: userLat + 0.052,
      lng: userLng - 0.041,
      temp: 11.2,
      humidity: 85,
      solarBatteryPercent: 96,
      backupHours: 22,
      capacityKg: 6000,
      occupiedKg: 4100,
      status: 'optimal' as const,
      zone: isTN ? 'Nilgiris Foothill Hub' : 'High-Capacity Regional Facility'
    }
  ];

  const mandis = [
    {
      id: 'mandi-01',
      name: isTN ? 'Coimbatore APMC Wholesale Mandi' : `${userCity || 'City'} APMC Wholesale Mandi`,
      lat: userLat + 0.065,
      lng: userLng - 0.035,
      currentPrice: 44,
      trend: '+12%',
      demand: 'High',
      distanceKm: calculateDistanceKm(userLat, userLng, userLat + 0.065, userLng - 0.035)
    },
    {
      id: 'mandi-02',
      name: isTN ? 'Oddanchatram Vegetable Market' : `${userState || 'Regional'} Primary Mandi`,
      lat: userLat - 0.082,
      lng: userLng + 0.058,
      currentPrice: 38,
      trend: '+5%',
      demand: 'Moderate',
      distanceKm: calculateDistanceKm(userLat, userLng, userLat - 0.082, userLng + 0.058)
    },
    {
      id: 'mandi-03',
      name: isTN ? 'Tirupur Mega Farmers Market' : 'District Commodity Exchange',
      lat: userLat + 0.095,
      lng: userLng + 0.075,
      currentPrice: 48,
      trend: '+18%',
      demand: 'Very High',
      distanceKm: calculateDistanceKm(userLat, userLng, userLat + 0.095, userLng + 0.075)
    }
  ];

  const reeferVehicles = [
    {
      id: 'veh-live-1',
      vehicleNumber: isTN ? 'TN-38-BZ-4412' : 'IND-COLD-01',
      driverName: isTN ? 'Murugan K.' : 'Rajesh Sharma',
      driverPhone: '+91 98421 78910',
      lat: userLat + 0.012,
      lng: userLng + 0.008,
      destinationLat: userLat + 0.065,
      destinationLng: userLng - 0.035,
      destinationName: isTN ? 'Coimbatore APMC Mandi' : 'APMC Wholesale Mandi',
      crop: 'Roma Tomatoes (Grade A)',
      reeferTemp: 8.9,
      speedKmH: 42,
      progressPercent: 45,
      etaMinutes: 14
    },
    {
      id: 'veh-live-2',
      vehicleNumber: isTN ? 'TN-41-E-8820' : 'IND-COLD-02',
      driverName: isTN ? 'Selvam R.' : 'Bikash Gogoi',
      driverPhone: '+91 94432 11098',
      lat: userLat - 0.022,
      lng: userLng + 0.019,
      destinationLat: userLat + 0.024,
      destinationLng: userLng + 0.018,
      destinationName: 'Solar Cold Storage Hub (U1)',
      crop: 'Cabbage & Capsicum',
      reeferTemp: 3.2,
      speedKmH: 38,
      progressPercent: 70,
      etaMinutes: 8
    }
  ];

  return { storageUnits, mandis, reeferVehicles };
}

