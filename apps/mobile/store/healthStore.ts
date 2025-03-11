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

		// If we already have permissions, resolve immediately
		if (get().hasHealthPermissions) {
			return Promise.resolve();
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

					// Just set permissions and resolve - don't pre-fetch data
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
		console.log(`[healthStore] Fetching health data for date: ${dateKey}`);

		// Check if we already have cached data for this date
		const cachedData = get().healthDataCache[dateKey];
		if (cachedData) {
			console.log(`[healthStore] Using cached data for date: ${dateKey}`);
			return cachedData;
		}

		set({ isLoading: true, error: null });

		if (!isIOS) {
			set({ isLoading: false });
			return initialHealthData;
		}

		if (!get().hasHealthPermissions) {
			set({ error: "Health permissions not granted", isLoading: false });
			return initialHealthData;
		}

		// Create proper date range for the EXACT day (midnight to midnight)
		const dayStart = startOfDay(date);
		const dayEnd = endOfDay(date);
		
		const options: HealthInputOptions = {
			startDate: dayStart.toISOString(),
			endDate: dayEnd.toISOString(),
		};

		console.log(`[healthStore] Query options: ${options.startDate} to ${options.endDate}`);

		return new Promise<HealthData>((resolve) => {
			const healthData: HealthData = { ...initialHealthData };
			let completedQueries = 0;
			const totalQueries = 5; // Number of health queries we're making

			const checkCompletion = () => {
				completedQueries++;
				if (completedQueries === totalQueries) {
					// Update cache and resolve
					set((state) => ({
						healthDataCache: {
							...state.healthDataCache,
							[dateKey]: healthData,
						},
						isLoading: false,
					}));
					console.log(`[healthStore] Completed all ${totalQueries} queries for ${dateKey}, steps: ${healthData.steps}`);
					resolve(healthData);
				}
			};

			try {
				// Use the correct method to get the step count for a specific day
				console.log(`[healthStore] Querying step count for ${dateKey}`);
				
				// Get step count for the day
				AppleHealthKit.getStepCount(options, (err: any, results: any) => {
					if (!err && results && results.value) {
						// Log the full result object
						console.log(`[healthStore] Step count result:`, JSON.stringify(results));
						
						// The value is directly available in results.value
						const stepCount = Number(results.value);
						
						if (!isNaN(stepCount)) {
							console.log(`[healthStore] Step count for ${dateKey}: ${stepCount}`);
							healthData.steps = stepCount;
						} else {
							console.log(`[healthStore] Invalid step count value:`, results.value);
						}
					} else {
						console.log(`[healthStore] No step data for ${dateKey}:`, err || 'No results');
					}
					checkCompletion();
				});

				// Get flights climbed 
				AppleHealthKit.getFlightsClimbed(options, (err: any, results: any) => {
					if (!err && results && results.value) {
						const flightCount = Number(results.value);
						
						if (!isNaN(flightCount)) {
							console.log(`[healthStore] Flights for ${dateKey}: ${flightCount}`);
							healthData.flights = flightCount;
						}
					}
					checkCompletion();
				});

				// Get distance
				AppleHealthKit.getDistanceWalkingRunning(options, (err: any, results: any) => {
					if (!err && results && results.value) {
						const distance = Number(results.value);
						
						if (!isNaN(distance)) {
							console.log(`[healthStore] Distance for ${dateKey}: ${distance}`);
							healthData.distance = distance;
						}
					}
					checkCompletion();
				});

				// Get activity summary
				AppleHealthKit.getActivitySummary(options, (err: any, results: any) => {
					if (!err) {
						healthData.activitySummary = results;
					}
					checkCompletion();
				});

				// Get mindful session
				AppleHealthKit.getMindfulSession(options, (err: any, results: any) => {
					if (!err) {
						healthData.mindfulSession = results;
					}
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
		const cachedData = get().healthDataCache[dateKey];
		console.log(`[healthStore] Getting cached health data for ${dateKey}: ${cachedData ? `Found - steps: ${cachedData.steps}` : 'None found'}`);
		return cachedData || null;
	},
}));

export default useHealthStore;