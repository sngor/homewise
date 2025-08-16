'use server';

/**
 * @fileOverview AI flow to generate DIY repair guides for appliances.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRepairGuideInputSchema = z.object({
  applianceType: z.string().describe('The type of the appliance (e.g., refrigerator, oven).'),
  applianceModel: z.string().describe('The model number of the appliance.'),
  problemDescription: z.string().describe('A description of the problem the user is facing.'),
});
export type GenerateRepairGuideInput = z.infer<typeof GenerateRepairGuideInputSchema>;

const GenerateRepairGuideOutputSchema = z.object({
  guide: z.string().describe('A step-by-step DIY repair guide in Markdown format.'),
});
export type GenerateRepairGuideOutput = z.infer<typeof GenerateRepairGuideOutputSchema>;


export async function generateRepairGuide(input: GenerateRepairGuideInput): Promise<GenerateRepairGuideOutput> {
  return generateRepairGuideFlow(input);
}

const repairGuidePrompt = ai.definePrompt({
  name: 'generateRepairGuidePrompt',
  input: { schema: GenerateRepairGuideInputSchema },
  output: { schema: GenerateRepairGuideOutputSchema },
  prompt: `
    You are an expert appliance repair technician with years of experience.
    A user needs help with a repair. Your task is to provide a clear, safe, and effective DIY repair guide.

    **Appliance Details:**
    - Type: {{{applianceType}}}
    - Model: {{{applianceModel}}}

    **Problem Description:**
    "{{{problemDescription}}}"

    **Your Task:**
    Generate a step-by-step repair guide based on the information provided.

    **Instructions:**
    1.  **Safety First:** Start with a "Safety Precautions" section. This is critical. Mention things like unplugging the appliance, wearing gloves, etc.
    2.  **Tools & Parts:** Create a "Required Tools and Parts" section. List everything the user might need.
    3.  **Step-by-Step Guide:** Provide a detailed, numbered list of steps to diagnose and fix the problem. Be very clear and specific in your instructions.
    4.  **Formatting:** Use Markdown for clear formatting. Use headings, bold text, and lists to make the guide easy to read.
    5.  **Tone:** Be encouraging and professional. Assume the user has basic DIY skills but is not an expert.

    If the problem sounds too complex or dangerous for a DIY repair, advise the user to call a professional service instead of providing a guide.
  `,
});

const generateRepairGuideFlow = ai.defineFlow(
  {
    name: 'generateRepairGuideFlow',
    inputSchema: GenerateRepairGuideInputSchema,
    outputSchema: GenerateRepairGuideOutputSchema,
  },
  async (input) => {
    const { output } = await repairGuidePrompt(input);
    return output!;
  }
);
