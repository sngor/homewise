import { format } from 'date-fns';
import type { Appliance } from './types';

// In-memory store for local development
let appliances: Appliance[] = [
    {
        id: '1',
        name: 'Kitchen Fridge',
        type: 'refrigerator',
        brand: 'Samsung',
        model: 'RF28R7351SR',
        serial: 'DA42-00234B',
        purchaseDate: '2022-01-15',
        installationDate: '2022-01-20',
        stickerImageUrl: 'https://placehold.co/600x400.png',
        maintenanceSchedule: 'Replace water filter every 6 months',
    },
    {
        id: '2',
        name: 'Living Room TV',
        type: 'tv',
        brand: 'LG',
        model: 'OLED65C1PUB',
        serial: '109INWDEE769',
        purchaseDate: '2021-05-20',
        installationDate: '2021-05-22',
        stickerImageUrl: 'https://placehold.co/600x400.png',
        maintenanceSchedule: 'Annually',
    },
];

let nextId = 3;

// Simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAppliances = async (): Promise<Appliance[]> => {
    await sleep(500);
    // Return a copy to prevent direct mutation
    return [...appliances].sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
}

export const getApplianceById = async (id: string): Promise<Appliance | null> => {
    await sleep(300);
    const appliance = appliances.find(a => a.id === id);
    return appliance ? { ...appliance } : null;
}

export const addAppliance = async (applianceData: Omit<Appliance, 'id'>): Promise<Appliance> => {
    await sleep(700);
    const newAppliance: Appliance = {
        id: (nextId++).toString(),
        ...applianceData,
    };
    appliances = [newAppliance, ...appliances];
    return { ...newAppliance };
}

export const deleteAppliance = async (id: string): Promise<void> => {
    await sleep(400);
    const initialLength = appliances.length;
    appliances = appliances.filter(a => a.id !== id);
    if (appliances.length === initialLength) {
        throw new Error("Appliance not found");
    }
};
