export interface Appliance {
  id: string;
  name: string;
  type: 'refrigerator' | 'oven' | 'washer' | 'dishwasher' | 'tv' | 'ac' | 'microwave' | 'water-heater' | 'other';
  model: string;
  serial: string;
  purchaseDate: string;
  stickerImageUrl?: string;
  maintenanceSchedule: string;
}
