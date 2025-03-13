import * as SecureStore from "expo-secure-store";
import apiConfig from "./config";

// Token storage key
const TOKEN_KEY = "auth_token";

// In-memory token cache for immediate access
let cachedToken: string | null = null;

// Function to get the stored token
export const getToken = async (): Promise<string | null> => {
	// Return from cache if available
	if (cachedToken) {
		return cachedToken;
	}

	try {
		const token = await SecureStore.getItemAsync(TOKEN_KEY);
		cachedToken = token;
		return token;
	} catch (error) {
		console.error("Error getting token:", error);
		return null;
	}
};

// Function to store the token
export const storeToken = async (token: string): Promise<void> => {
	try {
		// Update cache immediately
		cachedToken = token;
		// Store persistently
		await SecureStore.setItemAsync(TOKEN_KEY, token);
	} catch (error) {
		console.error("Error storing token:", error);
	}
};

// Function to remove the token
export const removeToken = async (): Promise<void> => {
	try {
		// Clear cache immediately
		cachedToken = null;
		// Remove from persistent storage
		await SecureStore.deleteItemAsync(TOKEN_KEY);
	} catch (error) {
		console.error("Error removing token:", error);
	}
};

// Base64 URL decoding function
const base64UrlDecode = (str: string): string => {
	// Replace non-url compatible chars with base64 standard chars
	let input = str.replace(/-/g, "+").replace(/_/g, "/");

	// Pad out with standard base64 required padding characters
	const pad = input.length % 4;
	if (pad) {
		if (pad === 1) {
			throw new Error(
				"InvalidLengthError: Input base64url string is the wrong length to determine padding"
			);
		}
		input += new Array(5 - pad).join("=");
	}

	return input;
};

// Function to decode JWT payload
const decodeJwtPayload = (token: string): any => {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) {
			throw new Error("Invalid JWT format");
		}

		const base64Url = parts[1];
		const base64 = base64UrlDecode(base64Url);
		const rawPayload = atob(base64);
		return JSON.parse(rawPayload);
	} catch (error) {
		console.error("Error decoding JWT:", error);
		throw error;
	}
};

// Validate token expiration
export const validateToken = async (): Promise<boolean> => {
	const token = await getToken();
	if (!token) {
		return false;
	}

	try {
		// Validate based on expiry time
		const payload = decodeJwtPayload(token);
		if (payload.exp) {
			const expiryTime = payload.exp * 1000; // Convert seconds to milliseconds
			return Date.now() < expiryTime;
		}
		return true;
	} catch (error) {
		console.error("Error validating token:", error);
		return false;
	}
};

// Create headers with authorization token
export const createAuthHeaders = async (): Promise<HeadersInit> => {
	const token = await getToken();
	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
};

// Parse API response handling various formats
const parseResponse = async (response: Response) => {
	const responseText = await response.text();

	if (!responseText || responseText.trim() === "") {
		return null;
	}

	try {
		return JSON.parse(responseText);
	} catch (e) {
		// If not JSON, return the raw text
		return responseText;
	}
};

// API client with authentication
class ApiClient {
	// Auth endpoints
	async login(email: string, password: string) {
		try {
			const response = await fetch(apiConfig.AUTH.LOGIN, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await parseResponse(response);

			if (!response.ok) {
				throw new Error(data?.message || "Login failed");
			}

			// Store the token
			if (data.accessToken) {
				await storeToken(data.accessToken);
			} else {
				throw new Error("No access token in response");
			}

			return data;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	async register(email: string, password: string, name?: string) {
		try {
			const response = await fetch(apiConfig.AUTH.REGISTER, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password, name }),
			});

			const data = await parseResponse(response);

			if (!response.ok) {
				throw new Error(data?.message || "Registration failed");
			}

			// Store the token
			if (data.accessToken) {
				await storeToken(data.accessToken);
			} else {
				throw new Error("No access token in response");
			}

			return data;
		} catch (error) {
			console.error("Registration error:", error);
			throw error;
		}
	}

	async logout() {
		await removeToken();
	}

	// Generic request function with auth
	async request(endpoint: string, options: RequestInit = {}) {
		try {
			const headers = await createAuthHeaders();

			const response = await fetch(endpoint, {
				...options,
				headers: {
					...headers,
					...options.headers,
				},
			});

			const data = await parseResponse(response);

			if (!response.ok) {
				throw new Error(data?.message || `Request failed with status ${response.status}`);
			}

			return data;
		} catch (error: any) {
			console.error(`API request error (${endpoint}):`, error);
			throw error;
		}
	}

	// Helper for GET requests
	async get(endpoint: string) {
		return this.request(endpoint);
	}

	// Helper for POST requests
	async post(endpoint: string, body: any) {
		return this.request(endpoint, {
			method: "POST",
			body: JSON.stringify(body),
		});
	}

	// Helper for PUT requests
	async put(endpoint: string, body: any) {
		return this.request(endpoint, {
			method: "PUT",
			body: JSON.stringify(body),
		});
	}

	// Helper for DELETE requests
	async delete(endpoint: string) {
		return this.request(endpoint, {
			method: "DELETE",
		});
	}
}

export default new ApiClient();
