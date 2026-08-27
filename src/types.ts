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
  | 'profile';

export type UserRole = 'farmer' | 'cooperative' | 'collection';
export type AppLanguage = 'en' | 'hi' | 'as';

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
  image?: string;
  marketDemand: 'High' | 'Moderate' | 'Low';
  readyStatus: 'Ready for Transport' | 'Hold for Ripening' | 'Inspection Required';
  recommendedDate: string;
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
  cropName: string;
  statusText: string;
  isOptimal: boolean;
  currentTemp: number;
  targetTempRange: string;
  currentHumidity: number;
  targetHumidityRange: string;
  doorStatus: 'CLOSED' | 'OPEN';
  coolingSystem: 'ACTIVE' | 'STANDBY' | 'OFF';
  powerSource: 'AC POWER' | 'SOLAR' | 'BATTERY';
  solarIntakeKw: number;
  solarIntakeLabel: string;
  batteryBackupPercent: number;
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
