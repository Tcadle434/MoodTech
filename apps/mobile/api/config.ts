import Constants from "expo-constants";
import * as Device from "expo-device";

// Get the API URLs from environment variables
const API_URL = Device.isDevice
	? Constants.expoConfig?.extra?.apiUrlDevice
	: Constants.expoConfig?.extra?.apiUrlSimulator;

if (!API_URL) {
	throw new Error("API URL not configured. Please check your .env file.");
}

export default {
	API_URL,
	AUTH: {
		LOGIN: `${API_URL}/auth/login`,
		REGISTER: `${API_URL}/auth/register`,
	},
	USERS: {
		PROFILE: `${API_URL}/users/profile`,
	},
	MOODS: {
		BASE: `${API_URL}/moods`,
		BY_DATE: (date: string) => `${API_URL}/moods/date/${date}`,
		BY_RANGE: (startDate: string, endDate: string) =>
			`${API_URL}/moods/range?startDate=${startDate}&endDate=${endDate}`,
		BY_ID: (id: string) => `${API_URL}/moods/${id}`,
	},
};
