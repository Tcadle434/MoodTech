// useTodayHealthQuery.js
import { useQuery } from "@tanstack/react-query";
import { useHealthKitInit } from "@/hooks/useHealthKitInit";
import get24HourStepCount from "@/api/healthKit/get24HourStepCount";

export function useStepCount(date: Date) {
	const isInitialized = useHealthKitInit();

	return useQuery({
		queryKey: ["health", "stepCount", date.toISOString()],
		queryFn: async () => {
			const result = await get24HourStepCount(date);
			return result;
		},
		enabled: isInitialized,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
