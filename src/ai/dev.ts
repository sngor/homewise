'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/find-compatible-parts.ts';
import '@/ai/flows/extract-appliance-details.ts';
import '@/ai/flows/suggest-maintenance-schedule.ts';
import '@/ai/flows/find-repair-services.ts';
