import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllMoods } from "@/api/moods/getAllMoods";
import { MoodEntry } from "shared";

export const useAllMoods = (): UseQueryResult<MoodEntry[]> => {
	return useQuery({ queryKey: ["moods"], queryFn: getAllMoods });
};
