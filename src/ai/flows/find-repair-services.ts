'use server';
/**
 * @fileOverview An AI flow to find nearby repair services for an appliance.
 *
 * - findRepairServices - A function that finds repair services.
 * - FindRepairServicesInput - The input type for the findRepairServices function.
 * - FindRepairServicesOutput - The return type for the findRepairServices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindRepairServicesInputSchema = z.object({
  applianceType: z.string().describe('The type of the appliance (e.g., refrigerator, oven).'),
});
export type FindRepairServicesInput = z.infer<typeof FindRepairServicesInputSchema>;

const RepairServiceSchema = z.object({
    name: z.string().describe("The name of the repair service company."),
    phone: z.string().describe("The phone number of the service."),
    rating: z.number().describe("The user rating of the service, out of 5."),
});

const FindRepairServicesOutputSchema = z.object({
  services: z
    .array(RepairServiceSchema)
    .describe('A list of 3-5 suggested repair services for the appliance.'),
});
export type FindRepairServicesOutput = z.infer<typeof FindRepairServicesOutputSchema>;

export async function findRepairServices(input: FindRepairServicesInput): Promise<FindRepairServicesOutput> {
  return findRepairServicesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findRepairServicesPrompt',
  input: {schema: FindRepairServicesInputSchema},
  output: {schema: FindRepairServicesOutputSchema},
  prompt: `You are an expert local service finder. A user needs to find repair services for their '{{{applianceType}}}'. 
  
  Please provide a list of 3 to 5 highly-rated, fictional appliance repair service companies that would service this type of appliance. For each service, provide a realistic name, a US-based phone number, and a user rating between 4.0 and 5.0.`,
});

const findRepairServicesFlow = ai.defineFlow(
  {
    name: 'findRepairServicesFlow',
    inputSchema: FindRepairServicesInputSchema,
    outputSchema: FindRepairServicesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
