
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
  applianceBrand: z.string().describe('The brand of the appliance.'),
  applianceModel: z.string().describe('The model of the appliance.'),
  applianceType: z.string().describe('The type of the appliance.'),
});
export type FindCompatiblePartsInput = z.infer<typeof FindCompatiblePartsInputSchema>;

const PartSchema = z.object({
  name: z.string().describe('The name of the compatible replacement part.'),
  description: z.string().describe('A brief, one-sentence description of the part.'),
});
export type Part = z.infer<typeof PartSchema>;


const FindCompatiblePartsOutputSchema = z.object({
  parts: z
    .array(PartSchema)
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
  prompt: `You are an expert appliance repair technician. A user has provided the following appliance brand '{{{applianceBrand}}}' and model: '{{{applianceModel}}}'. The appliance type is '{{{applianceType}}}'.

  Identify and list compatible replacement parts for this appliance model. For each part, provide its name and a brief, one-sentence description.
  
  {{#if applianceType}}
  If the applianceType is 'refrigerator', you MUST include "Water Filter" as one of the parts.
  {{/if}}
  `,
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
