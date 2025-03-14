import { MoodType, SubMoodType } from "shared";
import apiClient from "../client";
import apiConfig from "../config";

export const saveMood = async (
	dateString: string,
	mood: MoodType,
	subMood?: SubMoodType,
	note?: string
) => {
	return apiClient.post(apiConfig.MOODS.BASE, { date: dateString, mood, subMood, note });
};
