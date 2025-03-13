import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { saveMood } from "@/api/moods/saveMood";
import { MoodType } from "shared";

interface SaveMoodVariables {
	dateString: string;
	mood: MoodType;
	note?: string;
}

export function useSaveMood(): UseMutationResult<void, Error, SaveMoodVariables> {
	return useMutation({
		mutationFn: async ({ dateString, mood, note }: SaveMoodVariables) => {
			await saveMood(dateString, mood, note);
		},
	});
}
