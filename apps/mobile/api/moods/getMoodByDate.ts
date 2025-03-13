import { format } from "date-fns";
import apiClient from "../client";
import apiConfig from "../config";
import { MoodEntry } from "shared";

export const getMoodByDate = async (dateString: string): Promise<MoodEntry | null> => {
	const response = await apiClient.get(apiConfig.MOODS.BY_DATE(dateString));
	console.log("Raw API response:", response);
	return response;
};
