'use server';

import {
  findCompatibleParts,
  type FindCompatiblePartsInput,
} from '@/ai/flows/find-compatible-parts';
import {
  extractApplianceDetails,
  type ExtractApplianceDetailsInput,
  type ExtractApplianceDetailsOutput,
} from '@/ai/flows/extract-appliance-details';
import {
  suggestMaintenanceSchedule,
  type SuggestMaintenanceScheduleInput,
  type SuggestMaintenanceScheduleOutput,
} from '@/ai/flows/suggest-maintenance-schedule';
import {
  findRepairServices,
  type FindRepairServicesInput,
  type FindRepairServicesOutput,
} from '@/ai/flows/find-repair-services';


export async function getCompatibleParts(
  input: FindCompatiblePartsInput
): Promise<string[]> {
  try {
    const result = await findCompatibleParts(input);
    return result.parts;
  } catch (error) {
    console.error('Error finding compatible parts:', error);
    // Re-throw the error to be handled by the component
    if (error instanceof Error) {
      throw new Error(`AI part finder failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred while finding compatible parts.');
  }
}

export async function getApplianceDetailsFromImage(
  input: ExtractApplianceDetailsInput
): Promise<ExtractApplianceDetailsOutput> {
  try {
    // Ensure the flow call is awaited
    const result = await extractApplianceDetails(input);
    if (!result) {
      throw new Error('The AI flow returned no result.');
    }
    return result;
  } catch (error) {
    console.error('Error extracting appliance details:', error);
    // Re-throw the error to be handled by the component
    if (error instanceof Error) {
      throw new Error(`AI extraction failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during image extraction.');
  }
}

export async function getMaintenanceScedule(
  input: SuggestMaintenanceScheduleInput
): Promise<SuggestMaintenanceScheduleOutput> {
  try {
    const result = await suggestMaintenanceSchedule(input);
    return result;
  } catch (error) {
    console.error('Error suggesting maintenance schedule:', error);
    if (error instanceof Error) {
      throw new Error(`AI suggestion failed: ${error.message}`);
    }
    throw new Error(
      'An unknown error occurred while suggesting the schedule.'
    );
  }
}

export async function getRepairServices(
  input: FindRepairServicesInput
): Promise<FindRepairServicesOutput> {
  try {
    const result = await findRepairServices(input);
    return result;
  } catch (error) {
    console.error('Error finding repair services:', error);
    if (error instanceof Error) {
      throw new Error(`AI service finder failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred while finding repair services.');
  }
}
