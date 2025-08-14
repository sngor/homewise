'use server';
/**
 * @fileOverview An AI flow to suggest a maintenance schedule for an appliance.
 *
 * - suggestMaintenanceSchedule - A function that suggests a maintenance schedule.
 * - SuggestMaintenanceScheduleInput - The input type for the suggestMaintenanceSchedule function.
 * - SuggestMaintenanceScheduleOutput - The return type for the suggestMaintenanceSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMaintenanceScheduleInputSchema = z.object({
  applianceType: z.string().describe('The type of the appliance (e.g., refrigerator, oven).'),
  applianceModel: z.string().describe('The model of the appliance.'),
});
export type SuggestMaintenanceScheduleInput = z.infer<typeof SuggestMaintenanceScheduleInputSchema>;

const SuggestMaintenanceScheduleOutputSchema = z.object({
  schedule: z.string().describe('A concise suggested maintenance schedule (e.g., "Every 6 months", "Annually").'),
});
export type SuggestMaintenanceScheduleOutput = z.infer<typeof SuggestMaintenanceScheduleOutputSchema>;

export async function suggestMaintenanceSchedule(input: SuggestMaintenanceScheduleInput): Promise<SuggestMaintenanceScheduleOutput> {
  return suggestMaintenanceScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMaintenanceSchedulePrompt',
  input: {schema: SuggestMaintenanceScheduleInputSchema},
  output: {schema: SuggestMaintenanceScheduleOutputSchema},
  prompt: `You are an appliance maintenance expert. Based on the appliance type '{{{applianceType}}}' and model '{{{applianceModel}}}', suggest a concise maintenance schedule. For example, 'Every 6 months' or 'Annually'. Keep the response brief.`,
});

const suggestMaintenanceScheduleFlow = ai.defineFlow(
  {
    name: 'suggestMaintenanceScheduleFlow',
    inputSchema: SuggestMaintenanceScheduleInputSchema,
    outputSchema: SuggestMaintenanceScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
