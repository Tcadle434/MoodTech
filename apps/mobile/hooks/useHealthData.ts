import { useEffect, useState, useCallback } from "react";
import useHealthStore from "@/store/healthStore";

const useHealthData = (date?: Date) => {
	const targetDate = date || new Date();
	const [isLoading, setIsLoading] = useState(false);

	const {
		fetchHealthData,
		getHealthDataForDate,
		hasHealthPermissions,
		isLoading: storeLoading,
	} = useHealthStore();

	const dateKey = targetDate.toISOString().split("T")[0]; // Use just the date part as a dependency
	const cachedData = getHealthDataForDate(targetDate);
	const [healthData, setHealthData] = useState(
		cachedData || {
			steps: 0,
			flights: 0,
			distance: 0,
			activitySummary: null,
			mindfulSession: null,
		}
	);

	// Use useCallback to memoize the fetch function
	const fetchData = useCallback(async () => {
		if (!hasHealthPermissions) return;

		setIsLoading(true);
		try {
			const data = await fetchHealthData(targetDate);
			setHealthData(data);
		} catch (error) {
			console.error("Error fetching health data:", error);
		} finally {
			setIsLoading(false);
		}
	}, [targetDate, hasHealthPermissions, fetchHealthData]);

	useEffect(() => {
		// If we already have cached data, use it
		if (cachedData) {
			setHealthData(cachedData);
			return;
		}

		// If we have permissions, fetch the data
		if (hasHealthPermissions) {
			fetchData();
		}
	}, [dateKey, hasHealthPermissions, cachedData, fetchData]);

	return {
		...healthData,
		isLoading: isLoading || storeLoading,
		hasHealthPermissions,
	};
};

export default useHealthData;
