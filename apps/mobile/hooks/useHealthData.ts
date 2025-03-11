import { useEffect, useState } from "react";
import { Platform } from "react-native";
import AppleHealthKit, {
	HealthInputOptions,
	HealthKitPermissions,
	HealthUnit,
	HealthActivitySummary,
	HealthValue,
} from "react-native-health";

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
					AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
					AppleHealthKit.Constants.Permissions.MindfulSession,
					AppleHealthKit.Constants.Permissions.RespiratoryRate,
					AppleHealthKit.Constants.Permissions.SleepAnalysis,
					AppleHealthKit.Constants.Permissions.Workout,
				],
				write: [],
			},
		}
	: defaultPermissions;

const useHealthData = () => {
	const [hasPermissions, setHasPermission] = useState(false);
	const [steps, setSteps] = useState(0);
	const [flights, setFlights] = useState(0);
	const [distance, setDistance] = useState(0);
	const [activitySummary, setActivitySummary] = useState<HealthActivitySummary[] | null>(null);
	const [mindfulSession, setMindfulSession] = useState<HealthValue[] | null>(null);

	// HealthKit implementation - only run on iOS
	useEffect(() => {
		if (!isIOS) {
			console.log("HealthKit is only available on iOS");
			return;
		}

		console.log("Initializing HealthKit");
		try {
			AppleHealthKit.initHealthKit(permissions, (err) => {
				if (err) {
					console.log("Error getting permissions", err);
					return;
				}
				setHasPermission(true);
			});
		} catch (error) {
			console.error("Failed to initialize HealthKit:", error);
		}
	}, []);

	useEffect(() => {
		if (!isIOS || !hasPermissions) {
			return;
		}

		// Query Health data
		const options: HealthInputOptions = {
			date: new Date().toISOString(),
		};

		try {
			AppleHealthKit.getStepCount(options, (err, results) => {
				if (err) {
					console.log("Error getting the steps");
					return;
				}
				setSteps(results.value);
			});

			AppleHealthKit.getFlightsClimbed(options, (err, results) => {
				if (err) {
					console.log("Error getting the Flights Climbed:", err);
					return;
				}
				setFlights(results.value);
			});

			AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
				if (err) {
					console.log("Error getting the Distance:", err);
					return;
				}
				setDistance(results.value);
			});

			AppleHealthKit.getActivitySummary(options, (err, results) => {
				if (err) {
					console.log("Error getting the Activity Summary:", err);
					return;
				}
				setActivitySummary(results);
			});

			AppleHealthKit.getMindfulSession(options, (err, results) => {
				if (err) {
					console.log("Error getting the Mindful Session:", err);
					return;
				}
				setMindfulSession(results);
			});
		} catch (error) {
			console.error("Error querying health data:", error);
		}
	}, [hasPermissions]);

	return { steps, flights, distance, activitySummary, mindfulSession };
};

export default useHealthData;
