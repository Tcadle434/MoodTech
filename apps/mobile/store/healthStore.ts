import { create } from "zustand";
import { Platform } from "react-native";
import AppleHealthKit, {
	HealthInputOptions,
	HealthKitPermissions,
	HealthActivitySummary,
	HealthValue,
} from "react-native-health";
import { startOfDay, endOfDay, format } from "date-fns";

// Only use HealthKit on iOS
const isIOS = Platform.OS === "ios";

// Default empty permissions for non-iOS platforms
const defaultPermissions = {
	permissions: {
		read: [],
		write: [],
	},
};

// Only set up HealthKit permissions on iOS
const permissions: HealthKitPermissions = isIOS
	? {
			permissions: {
				read: [
					AppleHealthKit.Constants.Permissions.Steps,
					AppleHealthKit.Constants.Permissions.StepCount,
					AppleHealthKit.Constants.Permissions.FlightsClimbed,
					AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
					AppleHealthKit.Constants.Permissions.ActivitySummary,
					AppleHealthKit.Constants.Permissions.AppleExerciseTime,
					AppleHealthKit.Constants.Permissions.AppleStandTime,
					AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
					AppleHealthKit.Constants.Permissions.HeartRate,
					AppleHealthKit.Constants.Permissions.MindfulSession,
					AppleHealthKit.Constants.Permissions.RespiratoryRate,
					AppleHealthKit.Constants.Permissions.SleepAnalysis,
					AppleHealthKit.Constants.Permissions.Workout,
				],
				write: [],
			},
		}
	: defaultPermissions;

interface HealthData {
	steps: number;
	flights: number;
	distance: number;
	activitySummary: HealthActivitySummary[] | null;
	mindfulSession: HealthValue[] | null;
}

interface HealthDataCache {
	[dateKey: string]: HealthData;
}

interface HealthState {
	hasHealthPermissions: boolean;
	isLoading: boolean;
	error: string | null;
	healthDataCache: HealthDataCache;

	// Actions
	initializeHealthKit: () => Promise<void>;
	fetchHealthData: (date: Date) => Promise<HealthData>;
	getHealthDataForDate: (date: Date) => HealthData | null;
}

const initialHealthData: HealthData = {
	steps: 0,
	flights: 0,
	distance: 0,
	activitySummary: null,
	mindfulSession: null,
};

const useHealthStore = create<HealthState>((set, get) => ({
	hasHealthPermissions: false,
	isLoading: false,
	error: null,
	healthDataCache: {},

	initializeHealthKit: async () => {
		if (!isIOS) {
			set({ error: "HealthKit is only available on iOS" });
			return Promise.reject(new Error("HealthKit is only available on iOS"));
		}

		set({ isLoading: true, error: null });

		return new Promise<void>((resolve, reject) => {
			try {
				AppleHealthKit.initHealthKit(permissions, (err: any) => {
					if (err) {
						const errorMsg =
							"Error getting permissions: " + (err.message || String(err));
						set({ error: errorMsg, isLoading: false });
						reject(new Error(errorMsg));
						return;
					}

					set({ hasHealthPermissions: true, isLoading: false });
					resolve();
				});
			} catch (error) {
				const errorMsg =
					"Failed to initialize HealthKit: " +
					(error instanceof Error ? error.message : String(error));
				set({ error: errorMsg, isLoading: false });
				reject(new Error(errorMsg));
			}
		});
	},

	fetchHealthData: async (date: Date) => {
		const dateKey = format(date, "yyyy-MM-dd");
		set((state) => ({ isLoading: true, error: null }));

		if (!isIOS) {
			set({ isLoading: false });
			return initialHealthData;
		}

		if (!get().hasHealthPermissions) {
			set({ error: "Health permissions not granted", isLoading: false });
			return initialHealthData;
		}

		const options: HealthInputOptions = {
			startDate: startOfDay(date).toISOString(),
			endDate: endOfDay(date).toISOString(),
		};

		return new Promise<HealthData>((resolve) => {
			const healthData: HealthData = { ...initialHealthData };
			let completedQueries = 0;
			let hasError = false;
			const totalQueries = 5; // Number of health queries we're making

			// Improved checkCompletion function with error handling
			const checkCompletion = () => {
				completedQueries++;
				if (completedQueries === totalQueries || hasError) {
					set((state) => ({
						healthDataCache: {
							...state.healthDataCache,
							[dateKey]: healthData,
						},
						isLoading: false,
						error: hasError ? "Error fetching some health data" : null,
					}));
					resolve(healthData);
				}
			};

			const handleQueryError = (err: any, queryName: string) => {
				console.error(`Error querying ${queryName}:`, err);
				hasError = true;
				checkCompletion();
			};

			try {
				// Get step count
				AppleHealthKit.getStepCount(options, (err: any, results: any) => {
					if (err) {
						handleQueryError(err, "steps");
						return;
					}
					healthData.steps = results.value;
					checkCompletion();
				});

				// Get flights climbed
				AppleHealthKit.getFlightsClimbed(options, (err: any, results: any) => {
					if (err) {
						handleQueryError(err, "flights");
						return;
					}
					healthData.flights = results.value;
					checkCompletion();
				});

				// Get distance
				AppleHealthKit.getDistanceWalkingRunning(options, (err: any, results: any) => {
					if (err) {
						handleQueryError(err, "distance");
						return;
					}
					healthData.distance = results.value;
					checkCompletion();
				});

				// Get activity summary
				AppleHealthKit.getActivitySummary(options, (err: any, results: any) => {
					if (err) {
						handleQueryError(err, "activity summary");
						return;
					}
					healthData.activitySummary = results;
					checkCompletion();
				});

				// Get mindful session
				AppleHealthKit.getMindfulSession(options, (err: any, results: any) => {
					if (err) {
						handleQueryError(err, "mindful session");
						return;
					}
					healthData.mindfulSession = results;
					checkCompletion();
				});
			} catch (error) {
				console.error("Error querying health data:", error);
				set({ error: "Error querying health data", isLoading: false });
				resolve(initialHealthData);
			}
		});
	},

	getHealthDataForDate: (date: Date) => {
		const dateKey = format(date, "yyyy-MM-dd");
		return get().healthDataCache[dateKey] || null;
	},
}));

export default useHealthStore;
