/**
 * Application configuration
 */

interface AppConfig {
	apiUrl: string;
	enableAnalytics: boolean;
	appVersion: string;
}

/**
 * Environment-specific configuration
 */
const config: Record<string, AppConfig> = {
	development: {
		apiUrl: "http://localhost:3000/api",
		enableAnalytics: false,
		appVersion: "1.0.0-dev",
	},
	staging: {
		apiUrl: "https://staging-api.moodtech.com/api",
		enableAnalytics: true,
		appVersion: "1.0.0-beta",
	},
	production: {
		apiUrl: "https://api.moodtech.com/api",
		enableAnalytics: true,
		appVersion: "1.0.0",
	},
};

/**
 * Get the configuration for the current environment
 */
export function getConfig(): AppConfig {
	// Default to development environment
	const environment = process.env.NODE_ENV || "development";

	return config[environment] || config.development;
}
