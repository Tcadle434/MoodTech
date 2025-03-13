import apiClient from "../client";
import apiConfig from "../config";

export const getMoodsByDateRange = async (startDateString: string, endDateString: string) => {
	return apiClient.get(apiConfig.MOODS.BY_RANGE(startDateString, endDateString));
};
