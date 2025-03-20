import { getConfig } from "@/config";
import { getToken, clearTokens } from "@/utils/tokenStorage";

// Create a base URL for API requests
const BASE_URL = getConfig().apiUrl;

// Generic request function with auth token
async function request(endpoint: string, options: RequestInit = {}) {
	try {
		// Add auth token if available
		const token = await getToken();
		const headers = {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		};

		// Make the request
		const response = await fetch(`${BASE_URL}${endpoint}`, {
			...options,
			headers,
		});

		// Parse the response
		const text = await response.text();
		const data = text ? JSON.parse(text) : {};

		// Handle errors
		if (!response.ok) {
			const error = new Error(
				data.message || `Request failed with status ${response.status}`
			);
			throw error;
		}

		return data;
	} catch (error) {
		console.error(`API request error (${endpoint}):`, error);

		// If it's a 401 error, handle auth failure
		if (error instanceof Response && error.status === 401) {
			await clearTokens();
		}

		throw error;
	}
}

// Export API helper functions
export const api = {
	get: (endpoint: string) => request(endpoint, { method: "GET" }),

	post: (endpoint: string, body: any) =>
		request(endpoint, {
			method: "POST",
			body: JSON.stringify(body),
		}),

	put: (endpoint: string, body: any) =>
		request(endpoint, {
			method: "PUT",
			body: JSON.stringify(body),
		}),

	delete: (endpoint: string) => request(endpoint, { method: "DELETE" }),
};
