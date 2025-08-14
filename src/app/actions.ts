'use server'
import { findCompatibleParts, type FindCompatiblePartsInput } from '@/ai/flows/find-compatible-parts';
import { extractApplianceDetails, type ExtractApplianceDetailsInput, type ExtractApplianceDetailsOutput } from '@/ai/flows/extract-appliance-details';

export async function getCompatibleParts(input: FindCompatiblePartsInput): Promise<string[]> {
    try {
        const result = await findCompatibleParts(input);
        return result.parts;
    } catch (error) {
        console.error("Error finding compatible parts:", error);
        return [];
    }
}

export async function getApplianceDetailsFromImage(input: ExtractApplianceDetailsInput): Promise<ExtractApplianceDetailsOutput | null> {
    try {
        const result = await extractApplianceDetails(input);
        return result;
    } catch (error) {
        console.error("Error extracting appliance details:", error);
        return null;
    }
}
