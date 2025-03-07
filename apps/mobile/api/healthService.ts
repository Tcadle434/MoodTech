import AppleHealthKit, {
	HealthInputOptions,
	HealthKitPermissions,
	HealthActivitySummary,
	HealthValue,
} from "react-native-health";
import { Platform } from "react-native";
import { HealthData } from "../store/healthStore";

// Define the permissions we need
const PERMISSIONS: HealthKitPermissions = {
	permissions: {
		read: [
			AppleHealthKit.Constants.Permissions.StepCount,
			AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
			AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
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
			throw new Error("HealthKit is only available on iOS");
		}

		try {
			console.log("Initializing HealthKit...");

			return new Promise((resolve, reject) => {
				AppleHealthKit.initHealthKit(PERMISSIONS, (error: string) => {
					if (error) {
						console.error("HealthKit initialization error:", error);
						reject(new Error(error));
						return;
					}

					console.log("HealthKit successfully initialized");
					resolve(true);
				});
			});
		} catch (error) {
			console.error("HealthKit error:", error);
			throw error;
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
