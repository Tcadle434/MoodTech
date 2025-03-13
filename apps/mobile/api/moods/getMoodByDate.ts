import apiClient from "../client";
import apiConfig from "../config";
import { MoodEntry } from "shared";

export const getMoodByDate = async (dateString: string): Promise<MoodEntry | null> => {
	return apiClient.get(apiConfig.MOODS.BY_DATE(dateString));
};
