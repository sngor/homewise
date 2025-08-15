
import type { Appliance } from './types';

// Using an in-memory array to simulate a database for local session storage.
export let MOCK_APPLIANCES: Appliance[] = [
    {
        id: '1',
        name: 'Kitchen Refrigerator',
        type: 'refrigerator',
        brand: 'Frigidaire',
        model: 'FFSS2615TS',
        serial: 'BA12345678',
        purchaseDate: '2022-01-15',
        maintenanceSchedule: 'Every 6 months',
        stickerImageUrl: 'https://placehold.co/600x400.png'
    },
    {
        id: '2',
        name: 'Living Room TV',
        type: 'tv',
        brand: 'LG',
        model: 'OLED55C1PUB',
        serial: 'SN98765432',
        purchaseDate: '2021-11-20',
        maintenanceSchedule: 'As needed',
        stickerImageUrl: 'https://placehold.co/600x400.png'
    },
    {
        id: '3',
        name: 'Laundry Room Washer',
        type: 'washer',
        brand: 'LG',
        model: 'WM4000HWA',
        serial: 'WM55555555',
        purchaseDate: '2023-03-10',
        maintenanceSchedule: 'Every 3 months',
        stickerImageUrl: 'https://placehold.co/600x400.png'
    }
];

export const getAppliances = async (): Promise<Appliance[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return a copy of the array sorted by purchase date
    return [...MOCK_APPLIANCES].sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
}

export const getApplianceById = async (id: string): Promise<Appliance | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const appliance = MOCK_APPLIANCES.find(app => app.id === id);
    return appliance || null;
}

export const addAppliance = async (applianceData: Omit<Appliance, 'id'>): Promise<Appliance> => {
    // Simulate network delay and ID generation
    await new Promise(resolve => setTimeout(resolve, 300));
    const newAppliance: Appliance = {
        id: new Date().getTime().toString(), // Simple unique ID
        ...applianceData,
    };
    MOCK_APPLIANCES.unshift(newAppliance); // Add to the beginning of the array
    return newAppliance;
}

export const deleteAppliance = async (id: string): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_APPLIANCES = MOCK_APPLIANCES.filter(app => app.id !== id);
    return;
};

    
