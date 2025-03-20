import apiClient from "./client";
import apiConfig from "./config";

export interface HealthSettings {
	sleep?: boolean;
	steps?: boolean;
	heartRate?: boolean;
}

export interface NotificationSettings {
	dailyReminder?: boolean;
	weeklyInsights?: boolean;
	achievements?: boolean;
}

export const userService = {
	/**
	 * Get user profile by ID
	 */
	getProfile: async (userId: string) => {
		return apiClient.get(`${apiConfig.USERS.BASE}/${userId}/profile`);
	},

	/**
	 * Update health data integration settings
	 */
	updateHealthSettings: async (userId: string, settings: HealthSettings) => {
		return apiClient.put(`${apiConfig.USERS.BASE}/${userId}/settings/health`, settings);
	},

	/**
	 * Get user's health integration settings
	 */
	getHealthSettings: async (userId: string) => {
		return apiClient.get(`${apiConfig.USERS.BASE}/${userId}/settings/health`);
	},

	/**
	 * Update notification settings
	 */
	updateNotificationSettings: async (userId: string, settings: NotificationSettings) => {
		return apiClient.put(`${apiConfig.USERS.BASE}/${userId}/settings/notifications`, settings);
	},

	/**
	 * Get user's notification settings
	 */
	getNotificationSettings: async (userId: string) => {
		return apiClient.get(`${apiConfig.USERS.BASE}/${userId}/settings/notifications`);
	},

	/**
	 * Retrieve health data statistics
	 */
	getHealthStats: async (userId: string, fromDate: string, toDate: string) => {
		return apiClient.get(
			`${apiConfig.USERS.BASE}/${userId}/health/stats?fromDate=${fromDate}&toDate=${toDate}`
		);
	},
};
