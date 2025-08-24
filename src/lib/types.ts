export interface Appliance {
  id: string;
  name: string;
  type: 'refrigerator' | 'oven' | 'washer' | 'dishwasher' | 'ac' | 'microwave' | 'water-heater' | 'dryer' | 'furnace' | 'garbage-disposal' | 'range-hood' | 'other';
  brand: string;
  model: string;
  serial: string;
  purchaseDate: string;
  installationDate: string;
  stickerImageUrl?: string;
  maintenanceSchedule: string;
  manualUrl?: string;
  receiptUrl?: string;
  warrantyUrl?: string;
  warrantyEndDate?: string;
  energyReadings?: EnergyReading[];
}

export interface EnergyReading {
    date: string;
    consumption: number; // in kWh
}

export interface EnergyInsight {
  estimatedAnnualKwh: number;
  estimatedAnnualCost: number;
  tips: {
    title: string;
    description: string;
  }[];
  sources: string[];
}
