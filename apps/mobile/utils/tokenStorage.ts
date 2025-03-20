import * as SecureStore from "expo-secure-store";

// Keys for storing tokens securely
const ACCESS_TOKEN_KEY = "moodtech_access_token";
const REFRESH_TOKEN_KEY = "moodtech_refresh_token";

/**
 * Save access token to secure storage
 */
export async function saveToken(token: string): Promise<void> {
	try {
		await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
	} catch (error) {
		console.error("Error saving access token:", error);
		throw error;
	}
}

/**
 * Get access token from secure storage
 */
export async function getToken(): Promise<string | null> {
	try {
		return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
	} catch (error) {
		console.error("Error getting access token:", error);
		return null;
	}
}

/**
 * Save refresh token to secure storage
 */
export async function saveRefreshToken(token: string): Promise<void> {
	try {
		await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
	} catch (error) {
		console.error("Error saving refresh token:", error);
		throw error;
	}
}

/**
 * Get refresh token from secure storage
 */
export async function getRefreshToken(): Promise<string | null> {
	try {
		return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
	} catch (error) {
		console.error("Error getting refresh token:", error);
		return null;
	}
}

/**
 * Clear all tokens from secure storage
 */
export async function clearTokens(): Promise<void> {
	try {
		await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
		await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
	} catch (error) {
		console.error("Error clearing tokens:", error);
		throw error;
	}
}

/**
 * Check if user has valid tokens stored
 */
export async function hasValidTokens(): Promise<boolean> {
	const token = await getToken();
	return token !== null && token !== "";
}
