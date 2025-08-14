'use server';

/**
 * @fileOverview AI flow to find compatible replacement parts for appliances.
 *
 * - findCompatibleParts - A function that handles the process of finding compatible parts.
 * - FindCompatiblePartsInput - The input type for the findCompatibleParts function.
 * - FindCompatiblePartsOutput - The return type for the findCompatibleParts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindCompatiblePartsInputSchema = z.object({
  applianceModel: z.string().describe('The model of the appliance.'),
});
export type FindCompatiblePartsInput = z.infer<typeof FindCompatiblePartsInputSchema>;

const FindCompatiblePartsOutputSchema = z.object({
  parts: z
    .array(z.string())
    .describe('A list of compatible replacement parts for the appliance.'),
});
export type FindCompatiblePartsOutput = z.infer<typeof FindCompatiblePartsOutputSchema>;

export async function findCompatibleParts(input: FindCompatiblePartsInput): Promise<FindCompatiblePartsOutput> {
  return findCompatiblePartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findCompatiblePartsPrompt',
  input: {schema: FindCompatiblePartsInputSchema},
  output: {schema: FindCompatiblePartsOutputSchema},
  prompt: `You are an expert appliance repair technician. A user has provided the following appliance model: {{{applianceModel}}}.\n\n  Identify and list compatible replacement parts for this appliance model.  Provide a list of specific part names.\n  Return a JSON array of strings.`,
});

const findCompatiblePartsFlow = ai.defineFlow(
  {
    name: 'findCompatiblePartsFlow',
    inputSchema: FindCompatiblePartsInputSchema,
    outputSchema: FindCompatiblePartsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
