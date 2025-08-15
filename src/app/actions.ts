'use server';

import {
  findCompatibleParts,
  type FindCompatiblePartsInput,
  type FindCompatiblePartsOutput,
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
import {
  getPartDetails,
  type GetPartDetailsInput,
  type GetPartDetailsOutput,
} from '@/ai/flows/get-part-details';
import {
  findManualUrl,
  type FindManualUrlInput,
  type FindManualUrlOutput,
} from '@/ai/flows/find-manual-url';

export async function getCompatibleParts(
  input: FindCompatiblePartsInput
): Promise<FindCompatiblePartsOutput> {
  try {
    const result = await findCompatibleParts(input);
    return result;
  } catch (error) {
    console.error('Error finding compatible parts:', error);
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
    const result = await extractApplianceDetails(input);
    if (!result) {
      throw new Error('The AI flow returned no result.');
    }
    return result;
  } catch (error) {
    console.error('Error extracting appliance details:', error);
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

export async function getSinglePartDetails(
  input: GetPartDetailsInput
): Promise<GetPartDetailsOutput> {
  try {
    const result = await getPartDetails(input);
    return result;
  } catch (error) {
    console.error('Error getting part details:', error);
    if (error instanceof Error) {
      throw new Error(`AI part detail finder failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred while getting part details.');
  }
}


export async function getManualUrl(
  input: FindManualUrlInput
): Promise<FindManualUrlOutput> {
  try {
    const result = await findManualUrl(input);
    return result;
  } catch (error) {
    console.error('Error finding manual URL:', error);
    if (error instanceof Error) {
      throw new Error(`AI manual finder failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred while finding the manual.');
  }
}
