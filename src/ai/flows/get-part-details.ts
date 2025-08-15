
'use server';
/**
 * @fileOverview An AI flow to get details for a specific appliance part.
 *
 * - getPartDetails - A function that gets details for a given part name.
 * - GetPartDetailsInput - The input type for the getPartDetails function.
 * - GetPartDetailsOutput - The return type for the getPartDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPartDetailsInputSchema = z.object({
  partName: z.string().describe('The name of the appliance part.'),
  applianceModel: z.string().describe('The model of the appliance the part belongs to.'),
});
export type GetPartDetailsInput = z.infer<typeof GetPartDetailsInputSchema>;

const GetPartDetailsOutputSchema = z.object({
  partName: z.string().describe('The name of the part.'),
  description: z.string().describe('A detailed description of the part, its function, and common symptoms of failure. Formatted as Markdown.'),
  purchaseUrl: z.string().describe('A fictional URL to a product page where the user could purchase this part.'),
});
export type GetPartDetailsOutput = z.infer<typeof GetPartDetailsOutputSchema>;

export async function getPartDetails(input: GetPartDetailsInput): Promise<GetPartDetailsOutput> {
  return getPartDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPartDetailsPrompt',
  input: {schema: GetPartDetailsInputSchema},
  output: {schema: GetPartDetailsOutputSchema},
  prompt: `You are an expert appliance part specialist. A user is asking for details about the part named '{{{partName}}}' for their appliance with model number '{{{applianceModel}}}'.

Provide the following information:
1.  **partName**: The name of the part.
2.  **description**: A detailed description of the part. Explain its function within the appliance and list some common symptoms that might indicate this part is failing. Format this as Markdown.
3.  **purchaseUrl**: A fictional, but realistic-looking, 'example.com' URL for a product page where the user could purchase this specific part. For instance, 'https://parts.example.com/{{{applianceModel}}}/{{{partName}}}'.
`,
});

const getPartDetailsFlow = ai.defineFlow(
  {
    name: 'getPartDetailsFlow',
    inputSchema: GetPartDetailsInputSchema,
    outputSchema: GetPartDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Sanitize partName for URL
    const sanitizedPartName = input.partName.replace(/\s+/g, '-').toLowerCase();
    const purchaseUrl = `https://parts.example.com/part/${input.applianceModel}/${sanitizedPartName}`;
    
    return {
        ...output!,
        partName: input.partName, // Ensure original part name is returned
        purchaseUrl,
    };
  }
);
