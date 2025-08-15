export interface Appliance {
  id: string;
  name: string;
  type: 'refrigerator' | 'oven' | 'washer' | 'dishwasher' | 'tv' | 'ac' | 'microwave' | 'water-heater' | 'other';
  brand: string;
  model: string;
  serial: string;
  purchaseDate: string;
  installationDate: string;
  stickerImageUrl?: string;
  maintenanceSchedule: string;
}
