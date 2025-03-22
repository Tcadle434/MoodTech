import * as Location from "expo-location";

const getLocationInit = (): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			resolve(status === "granted");
		} catch (error) {
			reject(new Error("Location initialization failed"));
		}
	});
};

export default getLocationInit;
