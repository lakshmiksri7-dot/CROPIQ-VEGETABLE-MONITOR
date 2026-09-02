export type ScreenId = 
  | 'splash'
  | 'login'
  | 'home'
  | 'storage'
  | 'configure-storage'
  | 'batches'
  | 'freshness'
  | 'energy'
  | 'market'
  | 'history'
  | 'alerts'
  | 'profile'
  | 'cooperative'
  | 'map-locations'
  | 'timeline'
  | 'ai-quality'
  | 'emergency';

export type UserRole = 'farmer' | 'cooperative' | 'collection';
export type AppLanguage = 'en' | 'hi' | 'as' | 'ta' | 'te' | 'bn';

export interface UserProfile {
  name: string;
  memberId: string;
  phone: string;
  role: UserRole;
  language: AppLanguage;
  location: string;
  storageUnit: string;
  smsAlerts: boolean;
  appAlerts: boolean;
  isLoggedIn: boolean;
}

export interface CropPreset {
  id: string;
  name: string;
  nameKey: string;
  category: string;
  image: string;
  altText: string;
  recTempMin: number;
  recTempMax: number;
  recHumidity: number;
  optimalDays: number;
  description: string;
}

export type BatchStatus = 'Stable' | 'Cooling' | 'Warning' | 'Critical';

export interface BatchItem {
  id: string;
  batchCode: string;
  crop: string;
  variety: string;
  quantityKg: number;
  storedDate: string;
  status: BatchStatus;
  freshnessPercent: number;
  spoilageRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  shelfLifeDays: number;
  targetTemp: string;
  targetHumidity: string;
  silo: string;
  farmerName?: string;
  farmerPhone?: string;
  image?: string;
  marketDemand: 'High' | 'Moderate' | 'Low';
  readyStatus: 'Ready for Transport' | 'Hold for Ripening' | 'Inspection Required';
  recommendedDate: string;
  transportRecommendation: 'Transport Today' | 'Safe to Store' | 'Sell Soon';
  transportReason: string;
  targetMandi: string;
  marketPriceEstimate: number;
  qrCodeValue?: string;
}

export type AlertSeverity = 'critical' | 'attention' | 'info';

export interface SmartAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: number;
  location: string;
  dismissed: boolean;
  actionRequired?: boolean;
}

export interface StorageSilo {
  id: string;
  name: string;
  unitCode: string;
  locationName: string;
  lat: number;
  lng: number;
  cluster: string;
  cropName: string;
  statusText: string;
  safetyStatus: 'SAFE' | 'WARNING' | 'CRITICAL';
  isOptimal: boolean;
  currentTemp: number;
  targetTempRange: string;
  currentHumidity: number;
  targetHumidityRange: string;
  doorStatus: 'CLOSED' | 'OPEN';
  doorOpenDurationSeconds: number;
  doorOpenCountToday: number;
  coolingSystem: 'ACTIVE' | 'STANDBY' | 'EMERGENCY_OVERDRIVE' | 'OFF';
  powerSource: 'AC POWER' | 'SOLAR' | 'BATTERY' | 'PCM_BACKUP';
  solarIntakeKw: number;
  solarIntakeLabel: string;
  batteryBackupPercent: number;
  estimatedBackupHours: number;
  batteryHealthSoH: number;
  pcmStoragePercent: number;
  pcmStatus: 'FULLY_CHARGED' | 'DISCHARGING_COLD' | 'STANDBY';
  weatherNotice: string;
  isWeatherSavingMode: boolean;
  tempTrend: { label: string; temp: number; heightPercent: number }[];
}

export interface HistoricalBatch {
  id: string;
  name: string;
  crop: string;
  quantityKg: number;
  storedRange: string;
  grade: 'EXCELLENT' | 'GOOD' | 'FAIR';
  image: string;
  avgTemp: string;
  avgHumidity: string;
}

export interface QualityCheckResult {
  id: string;
  cropName: string;
  batchCode: string;
  timestamp: string;
  qualityGrade: 'GOOD' | 'WARNING' | 'CRITICAL';
  spoilageRiskScore: number;
  freshnessScore: number;
  defects: {
    rottenDetected: boolean;
    colorDegradation: boolean;
    fungalGrowth: boolean;
    physicalDamage: boolean;
    details: string;
  };
  recommendation: string;
  imageUrl: string;
}

export interface TimelineStage {
  id: string;
  title: string;
  titleAs: string;
  titleHi: string;
  location: string;
  time: string;
  status: 'completed' | 'active' | 'upcoming';
  badge: string;
  description: string;
  icon: string;
}

export interface RegionalMandiPrice {
  id: string;
  mandiName: string;
  location: string;
  state: string;
  crop: string;
  currentPrice: number;
  previousPrice: number;
  priceTrend: 'up' | 'stable' | 'down';
  distanceKm: number;
  travelTimeHours: number;
  demandLevel: 'High' | 'Moderate' | 'Low';
  transportRecommendation: 'Transport Today' | 'Sell Soon' | 'Safe to Store';
}

export interface VoiceQueryOption {
  id: string;
  queryEn: string;
  queryHi: string;
  queryAs: string;
  icon: string;
  responseEn: string;
  responseHi: string;
  responseAs: string;
}

export interface TransitVehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  batchCode: string;
  cropName: string;
  quantityKg: number;
  origin: {
    name: string;
    lat: number;
    lng: number;
  };
  destination: {
    name: string;
    lat: number;
    lng: number;
  };
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  speedKmH: number;
  reeferTemp: number;
  targetTempRange: string;
  status: 'IN_TRANSIT' | 'SCHEDULED' | 'DELIVERED' | 'DELAYED';
  etaMinutes: number;
  distanceRemainingKm: number;
  departureTime: string;
  estimatedArrival: string;
  coldChainIntegrity: '100% SECURE' | 'WARNING';
  weatherAlert?: string;
  progressPercent: number;
}


