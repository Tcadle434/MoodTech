import { MoodType } from "shared";
import apiClient from "../client";
import apiConfig from "../config";

export const updateMood = async (id: string, mood: MoodType, note?: string) => {
	return apiClient.put(apiConfig.MOODS.BY_ID(id), { mood, note });
};
