import apiClient from "./client";
import apiConfig from "./config";
import { getToken, saveToken, saveRefreshToken, clearTokens } from "@/utils/tokenStorage";
import { User } from "shared";

// Services for authentication-related API calls
export const authService = {
	/**
	 * Login with email and password
	 */
	login: async (email: string, password: string) => {
		return apiClient.login(email, password);
	},

	/**
	 * Register a new user
	 */
	register: async (email: string, password: string, name?: string) => {
		return apiClient.register(email, password, name);
	},

	/**
	 * Logout the current user
	 */
	logout: async () => {
		return apiClient.logout();
	},

	/**
	 * Get the current user
	 */
	getCurrentUser: async () => {
		return apiClient.get(apiConfig.USERS.PROFILE);
	},

	/**
	 * Update user profile
	 */
	updateProfile: async (userId: string, userData: Partial<User>) => {
		return apiClient.put(`${apiConfig.USERS.BASE}/${userId}`, userData);
	},

	/**
	 * Complete the onboarding process
	 */
	completeOnboarding: async (userId: string) => {
		return apiClient.put(`${apiConfig.USERS.BASE}/${userId}`, {
			hasCompletedOnboarding: true,
		});
	},
};
