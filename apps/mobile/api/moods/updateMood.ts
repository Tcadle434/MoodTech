import { MoodType, SubMoodType } from "shared";
import apiClient from "../client";
import apiConfig from "../config";

export const updateMood = async (
	id: string,
	mood: MoodType,
	subMood?: SubMoodType,
	note?: string
) => {
	return apiClient.put(apiConfig.MOODS.BY_ID(id), { mood, subMood, note });
};
