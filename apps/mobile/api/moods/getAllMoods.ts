import apiClient from "../client";
import apiConfig from "../config";

export const getAllMoods = async () => {
	const response = await apiClient.get(apiConfig.MOODS.BASE);
	return response.data;
};
