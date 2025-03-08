import { Platform, NativeModules } from "react-native";
import { HealthData } from "../store/healthStore";
import { debugHealth } from "./healthDebug";

// Import using the standard import from 'react-native-health' to leverage package.json's module resolution
import * as RNHealth from 'react-native-health';

// Fallback to direct native module access if the import doesn't work
const RNAppleHealthKit = NativeModules.RNAppleHealthKit;

// Log for debugging
console.log("[HEALTH INIT] Using direct module import:", !!RNHealth);
console.log("[HEALTH INIT] RNHealth contains:", Object.keys(RNHealth || {}));
console.log("[HEALTH INIT] Available native modules:", Object.keys(NativeModules || {}));
console.log("[HEALTH INIT] RNAppleHealthKit available via NativeModules:", !!RNAppleHealthKit);
if (RNAppleHealthKit) {
  console.log("[HEALTH INIT] RNAppleHealthKit methods:", Object.keys(RNAppleHealthKit));
}

// Create a mock version for development that won't throw errors
const mockAppleHealthKit = {
  Constants: {
    Permissions: {
      StepCount: 'StepCount',
      DistanceWalkingRunning: 'DistanceWalkingRunning',
      ActiveEnergyBurned: 'ActiveEnergyBurned',
    }
  },
  
  initHealthKit: (permissions: any, callback: (error: string | null) => void) => {
    console.log("[HEALTH-MOCK] Mocking initHealthKit");
    // In development, simulate success
    setTimeout(() => callback(null), 500);
  },
  
  getStepCount: (options: any, callback: any) => {
    console.log("[HEALTH-MOCK] Mocking getStepCount");
    // Return fake data in development
    setTimeout(() => callback(null, { value: Math.floor(Math.random() * 10000) }), 500);
  },
  
  getDistanceWalkingRunning: (options: any, callback: any) => {
    console.log("[HEALTH-MOCK] Mocking getDistanceWalkingRunning");
    // Return fake data in development
    setTimeout(() => callback(null, { value: Math.random() * 10 }), 500);
  },
  
  getActiveEnergyBurned: (options: any, callback: any) => {
    console.log("[HEALTH-MOCK] Mocking getActiveEnergyBurned");
    // Return fake data in development
    setTimeout(() => callback(null, { value: Math.random() * 500 }), 500);
  }
};

// Try to use the best available implementation
const AppleHealthKit = RNHealth.default || RNAppleHealthKit || mockAppleHealthKit;

// Types
import {
	HealthInputOptions,
	HealthKitPermissions,
	HealthActivitySummary,
	HealthValue,
} from "react-native-health";

// Define the permissions we need - use hardcoded values to avoid undefined errors
const PERMISSIONS: HealthKitPermissions = {
	permissions: {
		read: [
			'StepCount',
			'DistanceWalkingRunning',
			'ActiveEnergyBurned',
		],
		write: [],
	},
};

export const healthService = {
	/**
	 * Initialize HealthKit and request permissions
	 */
	initHealthKit: async () => {
		if (Platform.OS !== "ios") {
			console.log("[HEALTH] Not iOS platform, skipping HealthKit initialization");
			throw new Error("HealthKit is only available on iOS");
		}

		try {
			console.log("[HEALTH] Starting HealthKit initialization process...");
			console.log(
				"[HEALTH] Permissions being requested:",
				JSON.stringify(PERMISSIONS, null, 2)
			);
			console.log("[HEALTH] AppleHealthKit module available:", !!AppleHealthKit);
			console.log("[HEALTH] AppleHealthKit constants available:", !!AppleHealthKit.Constants);

			if (AppleHealthKit.Constants) {
				console.log(
					"[HEALTH] Available permission types:",
					Object.keys(AppleHealthKit.Constants.Permissions)
				);
			}

			// First initialize HealthKit
			console.log("[HEALTH] Calling AppleHealthKit.initHealthKit...");
			await new Promise((resolve, reject) => {
				AppleHealthKit.initHealthKit(PERMISSIONS, (error: string) => {
					if (error) {
						console.error("[HEALTH] HealthKit initialization error:", error);
						console.log("[HEALTH] Init response type:", typeof error);
						reject(new Error(error));
						return;
					}

					console.log("[HEALTH] HealthKit successfully initialized without errors");
					resolve(true);
				});
			});

			// After initialization, immediately trigger a data request to force the permission prompt
			console.log("[HEALTH] Init successful, now triggering permission prompt...");
			const today = new Date();
			const yesterday = new Date(today);
			yesterday.setDate(today.getDate() - 1);

			const options = {
				startDate: yesterday.toISOString(),
				endDate: today.toISOString(),
			};

			console.log("[HEALTH] Date range for permission prompt:", options);

			// This will trigger the permission prompt if not already granted
			return new Promise((resolve, reject) => {
				console.log("[HEALTH] Requesting step count data to trigger permission prompt...");
				AppleHealthKit.getStepCount(options, (error: string, results: any) => {
					if (error) {
						console.log("[HEALTH] Permission prompt trigger resulted in error:", error);
						console.log("[HEALTH] Error type:", typeof error);
						// Don't reject here, as this could just mean no data or permissions not yet granted
						// which is expected on first run
					} else {
						console.log("[HEALTH] Permission prompt successfully triggered");
						console.log(
							"[HEALTH] Initial data response:",
							JSON.stringify(results, null, 2)
						);
					}
					// Resolve true regardless, as we just want to trigger the prompt
					resolve(true);
				});
			});
		} catch (error) {
			console.error("[HEALTH] Unexpected error during HealthKit initialization:", error);
			console.log("[HEALTH] Error type:", typeof error);
			console.log(
				"[HEALTH] Error stack:",
				error instanceof Error ? error.stack : "No stack trace"
			);
			throw error;
		}
	},

	/**
	 * Check if we have HealthKit permissions
	 * This will check the actual current permissions from HealthKit
	 */
	checkPermissions: async (): Promise<boolean> => {
		if (Platform.OS !== "ios") {
			console.log("[HEALTH] Not iOS platform, skipping permission check");
			return false;
		}

		try {
			console.log("[HEALTH] Starting permission check...");
			// First make sure HealthKit is initialized
			try {
				// This won't prompt for permission if already initialized
				console.log(
					"[HEALTH] Ensuring HealthKit is initialized before checking permissions"
				);
				await new Promise((resolve) => {
					AppleHealthKit.initHealthKit(PERMISSIONS, (error: string) => {
						if (error) {
							console.log(
								"[HEALTH] HealthKit already initialized or error during check:",
								error
							);
							// Don't reject here, we'll check permissions anyway
						} else {
							console.log(
								"[HEALTH] HealthKit successfully initialized during permission check"
							);
						}
						resolve(true);
					});
				});
			} catch (e) {
				// Ignore initialization errors
				console.log("[HEALTH] HealthKit initialization error in check:", e);
			}

			// Try to access step data to check permissions (date doesn't matter)
			console.log("[HEALTH] Checking permissions by attempting to access step data");
			const today = new Date();
			const startDate = new Date(today);
			startDate.setDate(today.getDate() - 1);

			const options = {
				startDate: startDate.toISOString(),
				endDate: today.toISOString(),
			};

			console.log("[HEALTH] Permission check date range:", options);

			return new Promise((resolve) => {
				AppleHealthKit.getStepCount(options, (error: string, results: any) => {
					if (error) {
						console.log("[HEALTH] No step count permission:", error);
						console.log("[HEALTH] Permission denied or data not available");
						resolve(false);
						return;
					}
					// If we can access step data, we have permissions
					console.log("[HEALTH] Health permissions verified successfully");
					console.log(
						"[HEALTH] Permission check data response:",
						JSON.stringify(results, null, 2)
					);
					resolve(true);
				});
			});
		} catch (error) {
			console.error("[HEALTH] Unexpected error during permission check:", error);
			console.log("[HEALTH] Error type:", typeof error);
			console.log(
				"[HEALTH] Error stack:",
				error instanceof Error ? error.stack : "No stack trace"
			);
			return false;
		}
	},

	/**
	 * Get step count for a specific date
	 */
	getStepCount: async (date: Date): Promise<number> => {
		if (Platform.OS !== "ios") {
			throw new Error("HealthKit is only available on iOS");
		}

		const startDate = new Date(date);
		startDate.setHours(0, 0, 0, 0);
		const endDate = new Date(date);
		endDate.setHours(23, 59, 59, 999);

		try {
			const options = {
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			};

			return new Promise((resolve, reject) => {
				AppleHealthKit.getStepCount(options, (error: string, results: HealthValue) => {
					if (error) {
						console.error("Error getting steps:", error);
						reject(new Error(error));
						return;
					}

					resolve(results.value || 0);
				});
			});
		} catch (error) {
			console.error("Error getting steps:", error);
			throw error;
		}
	},

	/**
	 * Get walking/running distance for a specific date
	 */
	getDistance: async (date: Date): Promise<number> => {
		if (Platform.OS !== "ios") {
			throw new Error("HealthKit is only available on iOS");
		}

		const startDate = new Date(date);
		startDate.setHours(0, 0, 0, 0);
		const endDate = new Date(date);
		endDate.setHours(23, 59, 59, 999);

		try {
			const options = {
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				unit: "km",
			};

			return new Promise((resolve, reject) => {
				AppleHealthKit.getDistanceWalkingRunning(
					options,
					(error: string, results: HealthValue) => {
						if (error) {
							console.error("Error getting distance:", error);
							reject(new Error(error));
							return;
						}

						resolve(results.value || 0);
					}
				);
			});
		} catch (error) {
			console.error("Error getting distance:", error);
			throw error;
		}
	},

	/**
	 * Get calories burned for a specific date
	 */
	getActiveEnergy: async (date: Date): Promise<number> => {
		if (Platform.OS !== "ios") {
			throw new Error("HealthKit is only available on iOS");
		}

		const startDate = new Date(date);
		startDate.setHours(0, 0, 0, 0);
		const endDate = new Date(date);
		endDate.setHours(23, 59, 59, 999);

		try {
			const options = {
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			};

			return new Promise((resolve, reject) => {
				AppleHealthKit.getActiveEnergyBurned(
					options,
					(error: string, results: HealthValue) => {
						if (error) {
							console.error("Error getting calories:", error);
							reject(new Error(error));
							return;
						}

						resolve(results.value || 0);
					}
				);
			});
		} catch (error) {
			console.error("Error getting calories:", error);
			throw error;
		}
	},

	/**
	 * Get health data for a specific date
	 */
	getDailyHealthData: async (date: Date): Promise<Omit<HealthData, "date">> => {
		try {
			if (Platform.OS !== "ios") {
				throw new Error("HealthKit is only available on iOS");
			}

			const steps = await healthService.getStepCount(date);
			const distance = await healthService.getDistance(date);
			const calories = await healthService.getActiveEnergy(date);

			return {
				steps,
				distance,
				calories,
			};
		} catch (error) {
			console.error("Error getting health data:", error);
			throw error;
		}
	},
};
