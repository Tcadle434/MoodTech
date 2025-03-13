import { format } from "date-fns";
import { MoodType, SubMoodType, MoodEntry } from "shared";
import apiClient from "./client";
import apiConfig from "./config";

//TODO: we should use react query here

// Services for mood-related API calls
export const moodService = {
	// Get all moods for the current user
	getAllMoods: async () => {
		return apiClient.get(apiConfig.MOODS.BASE);
	},

	// Get mood for a specific date
	getMoodByDate: async (date: Date): Promise<MoodEntry | null> => {
		try {
			const formattedDate = format(date, "yyyy-MM-dd");
			return apiClient.get(apiConfig.MOODS.BY_DATE(formattedDate));
		} catch (error) {
			console.error("[Debug] moodService: API error:", error);
			return null;
		}
	},

	// Get moods for a date range
	getMoodsByDateRange: async (startDate: Date, endDate: Date) => {
		try {
			console.log("[Debug] moodService: Getting moods for range:", { startDate, endDate });
			const formattedStartDate = format(startDate, "yyyy-MM-dd");
			const formattedEndDate = format(endDate, "yyyy-MM-dd");
			const response = await apiClient.get(
				apiConfig.MOODS.BY_RANGE(formattedStartDate, formattedEndDate)
			);
			console.log("[Debug] moodService: Range API response:", response?.data);
			return response?.data || [];
		} catch (error) {
			console.error("[Debug] moodService: Range API error:", error);
			return [];
		}
	},

	// Create or update a mood entry
	saveMood: async (date: Date, mood: MoodType, note?: string, subMood?: SubMoodType) => {
		const formattedDate = format(date, "yyyy-MM-dd");
		return apiClient.post(apiConfig.MOODS.BASE, {
			date: formattedDate,
			mood,
			subMood,
			note,
		});
	},

	// Update an existing mood entry
	updateMood: async (id: string, mood: MoodType, note?: string, subMood?: SubMoodType) => {
		return apiClient.put(apiConfig.MOODS.BY_ID(id), {
			mood,
			subMood,
			note,
		});
	},

	// Delete a mood entry
	deleteMood: async (id: string) => {
		return apiClient.delete(apiConfig.MOODS.BY_ID(id));
	},
};
