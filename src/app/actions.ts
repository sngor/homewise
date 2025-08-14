'use server'
import { findCompatibleParts, type FindCompatiblePartsInput } from '@/ai/flows/find-compatible-parts';
import { extractApplianceDetails, type ExtractApplianceDetailsInput, type ExtractApplianceDetailsOutput } from '@/ai/flows/extract-appliance-details';

export async function getCompatibleParts(input: FindCompatiblePartsInput): Promise<string[]> {
    try {
        const result = await findCompatibleParts(input);
        return result.parts;
    } catch (error) {
        console.error("Error finding compatible parts:", error);
        // Re-throw the error to be handled by the component
        if (error instanceof Error) {
            throw new Error(`AI part finder failed: ${error.message}`);
        }
        throw new Error('An unknown error occurred while finding compatible parts.');
    }
}

export async function getApplianceDetailsFromImage(input: ExtractApplianceDetailsInput): Promise<ExtractApplianceDetailsOutput> {
    try {
        // Ensure the flow call is awaited
        const result = await extractApplianceDetails(input);
        if (!result) {
            throw new Error("The AI flow returned no result.");
        }
        return result;
    } catch (error) {
        console.error("Error extracting appliance details:", error);
         // Re-throw the error to be handled by the component
        if (error instanceof Error) {
            throw new Error(`AI extraction failed: ${error.message}`);
        }
        throw new Error('An unknown error occurred during image extraction.');
    }
}
