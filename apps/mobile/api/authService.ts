import apiClient from './client';
import apiConfig from './config';
import { validateToken } from './client';

// Services for authentication-related API calls
export const authService = {
  // Login user
  login: async (email: string, password: string) => {
    return apiClient.login(email, password);
  },

  // Register user
  register: async (email: string, password: string, name?: string) => {
    return apiClient.register(email, password, name);
  },

  // Logout user
  logout: async () => {
    return apiClient.logout();
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    return validateToken();
  },

  // Get current user profile
  getProfile: async () => {
    return apiClient.get(apiConfig.USERS.PROFILE);
  },
};