'use server';
/**
 * @fileOverview An AI flow to extract appliance details from an image.
 *
 * - extractApplianceDetails - A function that handles extracting appliance details from a sticker image.
 * - ExtractApplianceDetailsInput - The input type for the extractApplianceDetails function.
 * - ExtractApplianceDetailsOutput - The return type for the extractApplianceDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractApplianceDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an appliance sticker, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractApplianceDetailsInput = z.infer<typeof ExtractApplianceDetailsInputSchema>;

const ExtractApplianceDetailsOutputSchema = z.object({
  name: z.string().describe('A suggested name for the appliance, e.g., "Kitchen Fridge".'),
  type: z.enum(['refrigerator', 'oven', 'washer', 'dishwasher', 'tv', 'ac', 'other']).describe('The type of the appliance.'),
  model: z.string().describe('The model number of the appliance. If not found, return an empty string.'),
  serial: z.string().describe('The serial number of the appliance. If not found, return an empty string.'),
});
export type ExtractApplianceDetailsOutput = z.infer<typeof ExtractApplianceDetailsOutputSchema>;

export async function extractApplianceDetails(input: ExtractApplianceDetailsInput): Promise<ExtractApplianceDetailsOutput> {
  return extractApplianceDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractApplianceDetailsPrompt',
  input: {schema: ExtractApplianceDetailsInputSchema},
  output: {schema: ExtractApplianceDetailsOutputSchema},
  prompt: `You are an expert at reading appliance stickers from images. Analyze the provided image of an appliance sticker.

Your task is to extract the following information:
1.  **Appliance Type**: Determine the type of appliance (e.g., refrigerator, oven, etc.).
2.  **Model Number**: Find the model number.
3.  **Serial Number**: Find the serial number.
4.  **Appliance Name**: Suggest a descriptive name for the appliance (e.g., "Kitchen Fridge").

If you cannot find a specific piece of information (like the model or serial number), return an empty string for that field.

Use the following image as your source:
Photo: {{media url=photoDataUri}}`,
});

const extractApplianceDetailsFlow = ai.defineFlow(
  {
    name: 'extractApplianceDetailsFlow',
    inputSchema: ExtractApplianceDetailsInputSchema,
    outputSchema: ExtractApplianceDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
