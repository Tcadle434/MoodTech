import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { saveMood } from "@/api/moods/saveMood";
import { MoodType, SubMoodType } from "shared";

interface SaveMoodVariables {
	dateString: string;
	mood: MoodType;
	subMood?: SubMoodType;
	note?: string;
}

export function useSaveMood(): UseMutationResult<void, Error, SaveMoodVariables> {
	return useMutation({
		mutationFn: async ({ dateString, mood, subMood, note }: SaveMoodVariables) => {
			await saveMood(dateString, mood, subMood, note);
		},
	});
}
