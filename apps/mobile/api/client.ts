import * as SecureStore from "expo-secure-store";
import apiConfig from "./config";

// Token storage keys
const TOKEN_KEY = "auth_token";

// In-memory token cache for immediate access
let cachedToken: string | null = null;

// Function to get the stored token
export const getToken = async (): Promise<string | null> => {
	// Return from cache if available
	if (cachedToken) {
		console.log("Using cached token");
		return cachedToken;
	}

	try {
		const token = await SecureStore.getItemAsync(TOKEN_KEY);
		console.log("Token retrieved from SecureStore:", token ? "Found" : "Not found");

		// Update cache
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
		console.log("Token cached in memory");

		// Also store persistently
		await SecureStore.setItemAsync(TOKEN_KEY, token);
		console.log("Token stored in SecureStore");
	} catch (error) {
		console.error("Error storing token:", error);
	}
};

// Function to remove the token
export const removeToken = async (): Promise<void> => {
	try {
		// Clear cache immediately
		cachedToken = null;
		console.log("Token cache cleared");

		// Also remove from persistent storage
		await SecureStore.deleteItemAsync(TOKEN_KEY);
		console.log("Token removed from SecureStore");
	} catch (error) {
		console.error("Error removing token:", error);
	}
};

// Function to create headers with auth token
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

export const validateToken = async (): Promise<boolean> => {
	const token = await getToken();
	if (!token) {
		console.log("No token to validate");
		return false;
	}

	console.log("Token exists, validating...");

	try {
		// Simple validation based on expiry time
		const payload = decodeJwtPayload(token);
		console.log("Token payload:", payload);

		if (payload.exp) {
			const expiryTime = payload.exp * 1000; // Convert seconds to milliseconds
			const now = Date.now();

			if (expiryTime < now) {
				console.log("Token is expired");
				return false;
			}
		}

		console.log("Token appears valid");
		return true;
	} catch (error) {
		console.error("Error validating token:", error);
		return false;
	}
};

export const createAuthHeaders = async (): Promise<HeadersInit> => {
	// Force refresh from SecureStore by clearing cache first
	cachedToken = null;

	const token = await getToken();

	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
		console.log("Added auth token to headers:", token.substring(0, 10) + "...");

		// Check if token is valid
		const isValid = await validateToken();
		if (!isValid) {
			console.warn("Using potentially invalid token!");
		}
	} else {
		console.log("No auth token available");
	}

	return headers;
};

// API client with authentication
class ApiClient {
	// Auth endpoints
	async login(email: string, password: string) {
		try {
			console.log("Logging in with:", { email });

			const response = await fetch(apiConfig.AUTH.LOGIN, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const responseText = await response.text();
			let data;

			try {
				data = JSON.parse(responseText);
				console.log("Login response data:", data);
			} catch (e) {
				console.log("Login response is not JSON:", responseText);
				throw new Error("Invalid response from server");
			}

			if (!response.ok) {
				throw new Error(data.message || "Login failed");
			}

			// Store the token
			if (data.accessToken) {
				console.log("Storing access token:", data.accessToken.substring(0, 10) + "...");
				await storeToken(data.accessToken);

				// Verify token was stored
				const storedToken = await getToken();
				console.log("Token stored successfully:", !!storedToken);
			} else {
				console.error("No access token in response");
			}

			return data;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	async register(email: string, password: string, name?: string) {
		try {
			console.log("Registering user:", { email, name });

			const response = await fetch(apiConfig.AUTH.REGISTER, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password, name }),
			});

			const responseText = await response.text();
			let data;

			try {
				data = JSON.parse(responseText);
				console.log("Register response data:", data);
			} catch (e) {
				console.log("Register response is not JSON:", responseText);
				throw new Error("Invalid response from server");
			}

			if (!response.ok) {
				throw new Error(data.message || "Registration failed");
			}

			// Store the token
			if (data.accessToken) {
				console.log(
					"Storing access token from register:",
					data.accessToken.substring(0, 10) + "..."
				);
				await storeToken(data.accessToken);

				// Verify token was stored
				const storedToken = await getToken();
				console.log("Token stored successfully:", !!storedToken);
			} else {
				console.error("No access token in register response");
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
			console.log(`Making request to: ${endpoint}`, {
				method: options.method || "GET",
				headers: JSON.stringify(headers),
			});

			const response = await fetch(endpoint, {
				...options,
				headers: {
					...headers,
					...options.headers,
				},
			});

			console.log(`Response status: ${response.status}`);

			// Handle empty responses
			const responseText = await response.text();
			console.log("Raw response text:", responseText);

			let data;
			if (responseText.trim() === "") {
				console.log("Empty response received");
				data = null;
			} else {
				try {
					data = JSON.parse(responseText);
					console.log("Response data:", data);
				} catch (e) {
					console.log("Response is not JSON:", responseText);
					data = responseText;
				}
			}

			if (!response.ok) {
				console.error(`Request failed with status ${response.status}:`, data);
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
