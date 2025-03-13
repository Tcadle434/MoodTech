import apiClient from "../client";
import apiConfig from "../config";
import { MoodEntry } from "shared";
export const getAllMoods = async (): Promise<MoodEntry[]> => {
	return await apiClient.get(apiConfig.MOODS.BASE);
};
