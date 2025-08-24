'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/find-compatible-parts.ts';
import '@/ai/flows/extract-appliance-details.ts';
import '@/ai/flows/suggest-maintenance-schedule.ts';
import '@/ai/flows/find-repair-services.ts';
import '@/ai/flows/get-part-details.ts';
import '@/ai/flows/find-manual-url.ts';
import '@/ai/flows/generate-repair-guide.ts';
import '@/ai/flows/estimate-energy-consumption.ts';
