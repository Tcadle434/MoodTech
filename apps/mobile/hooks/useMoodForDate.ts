import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMoodByDate } from "@/api/moods/getMoodByDate";
import { MoodEntry } from "shared";

export function useMoodForDate(dateString: string): UseQueryResult<MoodEntry | null> {
	console.log("in useMoodForDate, dateString:", dateString);
	return useQuery({
		queryKey: ["mood", "moodForDate", dateString],
		queryFn: async () => {
			console.log("in useMoodForDate - query fetching");
			const result = await getMoodByDate(dateString);
			console.log("in useMoodForDate - query fetched", result);
			return result;
		},
	});
}
