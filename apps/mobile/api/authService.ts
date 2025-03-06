import apiClient from './client';
import apiConfig from './config';
import { getToken, removeToken, validateToken, storeToken } from './client';

// Services for authentication-related API calls
export const authService = {
  // Login user
  login: async (email: string, password: string) => {
    console.log('authService: Starting login process');
    
    // Use direct fetch to ensure token is stored
    const response = await fetch(apiConfig.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store token immediately
    if (data.accessToken) {
      console.log('authService: Storing access token');
      await storeToken(data.accessToken);
      
      // Verify token is stored
      const storedToken = await getToken();
      console.log('authService: Token stored successfully:', !!storedToken);
    } else {
      console.error('authService: No access token in response');
      throw new Error('No access token received');
    }
    
    console.log('authService: Login successful');
    return data;
  },

  // Register user
  register: async (email: string, password: string, name?: string) => {
    console.log('authService: Starting registration process');
    
    // Use direct fetch to ensure token is stored
    const response = await fetch(apiConfig.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Store token immediately
    if (data.accessToken) {
      console.log('authService: Storing access token from registration');
      await storeToken(data.accessToken);
      
      // Verify token is stored
      const storedToken = await getToken();
      console.log('authService: Token stored successfully:', !!storedToken);
    } else {
      console.error('authService: No access token in response');
      throw new Error('No access token received');
    }
    
    console.log('authService: Registration successful');
    return data;
  },

  // Logout user
  logout: async () => {
    console.log('authService: Logging out user');
    return apiClient.logout();
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    console.log('authService: Checking authentication...');
    // First check if token exists
    const token = await getToken();
    if (!token) {
      console.log('authService: No token found');
      return false;
    }
    
    // Then validate the token
    const isValid = await validateToken();
    console.log('authService: Token validation result:', isValid);
    return isValid;
  },

  // Get current user profile
  getProfile: async () => {
    console.log('authService: Fetching user profile');
    return apiClient.get(apiConfig.USERS.PROFILE);
  },
};