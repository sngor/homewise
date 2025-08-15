
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
  description: z.string().describe('A detailed, one-paragraph description of the part and its function.'),
  failureSymptoms: z.string().describe('A markdown-formatted, bulleted list of 3-5 common symptoms of failure. Each symptom should be on its own line.'),
  purchaseUrl: z.string().describe("A fictional URL to a product page where the user could purchase this part."),
  tutorialUrl: z.string().describe("A real YouTube URL for a video tutorial on how to replace this specific part. If no relevant video can be found, this should be an empty string."),
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
2.  **description**: A detailed, one-paragraph description of the part and its primary function within the appliance.
3.  **failureSymptoms**: A markdown-formatted list of 3-5 common symptoms that indicate this part might be failing. Each symptom must be on a new line and start with a bullet point (*).
4.  **purchaseUrl**: A fictional, but realistic-looking, 'example.com' URL for a product page where the user could purchase this specific part. For instance, 'https://parts.example.com/{{{applianceModel}}}/{{{partName}}}'.
5.  **tutorialUrl**: Search the web to find a real YouTube URL for a video tutorial showing how to replace this specific '{{{partName}}}' for the '{{{applianceModel}}}'. If you cannot find a relevant video, return an empty string.
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
