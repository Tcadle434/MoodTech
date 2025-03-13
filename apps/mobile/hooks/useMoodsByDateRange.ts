import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMoodsByDateRange } from "@/api/moods/getMoodsByDateRange";
import { MoodEntry } from "shared";

export const useMoodsByDateRange = (
	startDateString: string,
	endDateString: string
): UseQueryResult<MoodEntry[]> => {
	return useQuery({
		queryKey: ["moods", startDateString, endDateString],
		queryFn: () => getMoodsByDateRange(startDateString, endDateString),
	});
};
