'use server';
/**
 * @fileOverview An AI flow to find the online manual for an appliance.
 *
 * - findManualUrl - A function that finds the manual URL.
 * - FindManualUrlInput - The input type for the findManualUrl function.
 * - FindManualUrlOutput - The return type for the findManualUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindManualUrlInputSchema = z.object({
  applianceBrand: z.string().describe('The brand of the appliance.'),
  applianceModel: z.string().describe('The model of the appliance.'),
});
export type FindManualUrlInput = z.infer<typeof FindManualUrlInputSchema>;

const FindManualUrlOutputSchema = z.object({
  manualUrl: z.string().describe("A URL to the appliance's user manual. Should be a direct link to a PDF or manual page if possible. If no manual can be found, this should be an empty string."),
});
export type FindManualUrlOutput = z.infer<typeof FindManualUrlOutputSchema>;

export async function findManualUrl(input: FindManualUrlInput): Promise<FindManualUrlOutput> {
  return findManualUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findManualUrlPrompt',
  input: {schema: FindManualUrlInputSchema},
  output: {schema: FindManualUrlOutputSchema},
  prompt: `You are an expert at finding appliance documentation. Find the URL for the user manual for an appliance with brand '{{{applianceBrand}}}' and model '{{{applianceModel}}}'.

Search the web to find the official user manual. Prioritize direct PDF links from the manufacturer.

If you cannot find a relevant manual, return an empty string for the 'manualUrl'.`,
});

const findManualUrlFlow = ai.defineFlow(
  {
    name: 'findManualUrlFlow',
    inputSchema: FindManualUrlInputSchema,
    outputSchema: FindManualUrlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
