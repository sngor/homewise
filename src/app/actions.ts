'use server'
import { findCompatibleParts, type FindCompatiblePartsInput } from '@/ai/flows/find-compatible-parts';

export async function getCompatibleParts(input: FindCompatiblePartsInput): Promise<string[]> {
    try {
        const result = await findCompatibleParts(input);
        return result.parts;
    } catch (error) {
        console.error("Error finding compatible parts:", error);
        return [];
    }
}
