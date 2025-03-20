import Constants from "expo-constants";

// Get the API URL from environment variables or use localhost default
// Note: Use your machine's IP instead of localhost when testing on a real device
const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000/api";

export default {
	API_URL,
	AUTH: {
		LOGIN: `${API_URL}/auth/login`,
		REGISTER: `${API_URL}/auth/register`,
	},
	USERS: {
		PROFILE: `${API_URL}/users/profile`,
		BASE: `${API_URL}/users`,
	},
	MOODS: {
		BASE: `${API_URL}/moods`,
		BY_DATE: (date: string) => `${API_URL}/moods/date/${date}`,
		BY_RANGE: (startDate: string, endDate: string) =>
			`${API_URL}/moods/range?startDate=${startDate}&endDate=${endDate}`,
		BY_ID: (id: string) => `${API_URL}/moods/${id}`,
	},
};
