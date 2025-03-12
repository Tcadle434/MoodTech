import AppleHealthKit from "react-native-health";

const get24HourStepCount = async (date: Date): Promise<number> => {
	const options = {
		date: date.toISOString(),
	};

	return new Promise((resolve, reject) => {
		AppleHealthKit.getStepCount(options, (err, results) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(results?.value ?? 0);
		});
	});
};

export default get24HourStepCount;
