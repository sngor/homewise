import type { Appliance } from './types';

export const MOCK_APPLIANCES: Appliance[] = [
  {
    id: '1',
    name: 'Kitchen Refrigerator',
    type: 'refrigerator',
    model: 'FRS6LF7JS3',
    serial: 'BA83451234',
    purchaseDate: '2022-01-15',
    maintenanceSchedule: 'Every 6 months',
    stickerImageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    name: 'Living Room TV',
    type: 'tv',
    model: 'OLED65C1PUB',
    serial: 'SN02983487',
    purchaseDate: '2021-11-20',
    maintenanceSchedule: 'As needed',
    stickerImageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    name: 'Laundry Washer',
    type: 'washer',
    model: 'WM4000HWA',
    serial: 'LW23456789',
    purchaseDate: '2023-03-10',
    maintenanceSchedule: 'Every 3 months',
    stickerImageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '4',
    name: 'Kitchen Dishwasher',
    type: 'dishwasher',
    model: 'SHPM65Z55N',
    serial: 'DW98765432',
    purchaseDate: '2022-05-25',
    maintenanceSchedule: 'Monthly filter clean',
    stickerImageUrl: 'https://placehold.co/600x400.png',
  }
];

export const getApplianceById = (id: string): Appliance | undefined => {
    return MOCK_APPLIANCES.find(appliance => appliance.id === id);
}
