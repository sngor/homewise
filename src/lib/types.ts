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
}
