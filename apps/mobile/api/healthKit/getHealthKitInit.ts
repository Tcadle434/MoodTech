import AppleHealthKit, { HealthKitPermissions } from "react-native-health";
import { Platform } from "react-native";

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
					AppleHealthKit.Constants.Permissions.ActivitySummary,
					AppleHealthKit.Constants.Permissions.AppleExerciseTime,
					AppleHealthKit.Constants.Permissions.AppleStandTime,
					AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
					AppleHealthKit.Constants.Permissions.HeartRate,
					AppleHealthKit.Constants.Permissions.MindfulSession,
					AppleHealthKit.Constants.Permissions.SleepAnalysis,
					AppleHealthKit.Constants.Permissions.Workout,
				],
				write: [],
			},
		}
	: defaultPermissions;

const getHealthKitInit = (): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		AppleHealthKit.initHealthKit(permissions, (error) => {
			if (error) {
				reject(new Error("HealthKit initialization failed"));
			} else {
				resolve(true);
			}
		});
	});
};

export default getHealthKitInit;
