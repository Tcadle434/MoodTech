import apiClient from "../client";
import apiConfig from "../config";
import { MoodEntry } from "shared";

export const getMoodsByDateRange = async (
	startDateString: string,
	endDateString: string
): Promise<MoodEntry[]> => {
	return apiClient.get(apiConfig.MOODS.BY_RANGE(startDateString, endDateString));
};
