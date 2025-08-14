export interface Appliance {
  id: string;
  name: string;
  type: 'refrigerator' | 'oven' | 'washer' | 'dishwasher' | 'tv' | 'ac' | 'other';
  model: string;
  serial: string;
  purchaseDate: string;
  stickerImageUrl?: string;
  maintenanceSchedule: string;
}
