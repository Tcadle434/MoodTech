import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMoodByDate } from "@/api/moods/getMoodByDate";
import { MoodEntry } from "shared";

export function useMoodForDate(dateString: string): UseQueryResult<MoodEntry | null> {
	return useQuery({
		queryKey: ["mood", "moodForDate", dateString],
		queryFn: async () => {
			return await getMoodByDate(dateString);
		},
	});
}
