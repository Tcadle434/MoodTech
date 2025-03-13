import { format } from "date-fns";
import apiClient from "../client";
import apiConfig from "../config";

export const getMoodsByDateRange = async (startDate: Date, endDate: Date) => {
	const formattedStartDate = format(startDate, "yyyy-MM-dd");
	const formattedEndDate = format(endDate, "yyyy-MM-dd");
	return apiClient.get(apiConfig.MOODS.BY_RANGE(formattedStartDate, formattedEndDate));
};
