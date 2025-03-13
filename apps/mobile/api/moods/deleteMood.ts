import apiClient from "../client";
import apiConfig from "../config";

export const deleteMood = async (id: string) => {
	return apiClient.delete(apiConfig.MOODS.BY_ID(id));
};
