import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const EstimateEnergyConsumptionInputSchema = z.object({
  applianceType: z.string(),
  applianceBrand: z.string(),
  applianceModel: z.string(),
});
export type EstimateEnergyConsumptionInput = z.infer<typeof EstimateEnergyConsumptionInputSchema>;

export const EstimateEnergyConsumptionOutputSchema = z.object({
  estimatedAnnualKwh: z.number().describe("The estimated annual energy consumption in kWh."),
  estimatedAnnualCost: z.number().describe("The estimated annual running cost, assuming an average electricity cost of $0.17 per kWh."),
  tips: z.array(z.object({
    title: z.string().describe("A short, catchy title for the energy-saving tip."),
    description: z.string().describe("A longer description of the tip, explaining how to implement it."),
  })).describe("A list of 3-5 practical, actionable tips for reducing energy consumption."),
  sources: z.array(z.string().url()).describe("A list of 1-3 URL sources used for the data."),
});
export type EstimateEnergyConsumptionOutput = z.infer<typeof EstimateEnergyConsumptionOutputSchema>;


const estimateEnergyConsumptionFlow = ai.defineFlow(
  {
    name: 'estimateEnergyConsumptionFlow',
    inputSchema: EstimateEnergyConsumptionInputSchema,
    outputSchema: EstimateEnergyConsumptionOutputSchema,
  },
  async (input) => {
    const { applianceType, applianceBrand, applianceModel } = input;

    const prompt = `
      You are an expert in home appliance energy consumption.
      Analyze the following appliance and provide an estimate of its energy usage and cost, along with actionable savings tips.

      Appliance Details:
      - Type: ${applianceType}
      - Brand: ${applianceBrand}
      - Model: ${applianceModel}

      Instructions:
      1.  Research the typical energy consumption (in kWh) for this specific model or a similar one if the exact model is not found.
      2.  Estimate the annual energy consumption in kWh.
      3.  Estimate the annual running cost. Assume an average electricity cost of $0.17 per kWh.
      4.  Provide 3-5 practical, actionable tips for reducing the energy consumption of this specific type of appliance. Each tip should have a title and a description.
      5.  Provide a list of 1-3 URLs of the sources you used to find the data. If you are making an estimate based on similar models, provide the sources for those models.
    `;

    const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-2.0-flash',
        output: {
            schema: EstimateEnergyConsumptionOutputSchema,
        },
        config: {
            temperature: 0.2,
        }
    });

    const result = llmResponse.output;
    if (!result) {
      throw new Error("Failed to get a valid response from the LLM.");
    }

    return result;
  }
);

export async function estimateEnergyConsumption(input: EstimateEnergyConsumptionInput): Promise<EstimateEnergyConsumptionOutput> {
    return estimateEnergyConsumptionFlow(input);
}
