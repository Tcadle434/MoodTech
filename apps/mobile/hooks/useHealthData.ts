import { useEffect, useState, useCallback, useMemo } from "react";
import useHealthStore from "@/store/healthStore";

const useHealthData = (date?: Date) => {
	// Ensure we're working with a clone of the date to avoid any reference issues
	const targetDate = useMemo(() => 
		date ? new Date(date.getTime()) : new Date(),
	[date]);
	
	const [isLoading, setIsLoading] = useState(false);

	const {
		fetchHealthData,
		getHealthDataForDate,
		hasHealthPermissions,
		isLoading: storeLoading,
	} = useHealthStore();

	// Use useMemo for the date key to prevent unnecessary recalculations
	const dateKey = useMemo(() => 
		targetDate.toISOString().split("T")[0], 
	[targetDate]);

	// Define default health data
	const defaultHealthData = {
		steps: 0,
		flights: 0,
		distance: 0,
		activitySummary: null,
		mindfulSession: null,
	};

	// Initialize with defaults, will be updated in effect
	const [healthData, setHealthData] = useState(defaultHealthData);

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

	// Effect to load data when date changes
	useEffect(() => {
		// Get cached data for the specific date
		const currentCachedData = getHealthDataForDate(targetDate);
		
		if (currentCachedData) {
			setHealthData(currentCachedData);
		} else if (hasHealthPermissions) {
			fetchData();
		}
	}, [dateKey, hasHealthPermissions, fetchData, getHealthDataForDate]);

	return {
		...healthData,
		isLoading: isLoading || storeLoading,
		hasHealthPermissions,
	};
};

export default useHealthData;
