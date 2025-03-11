import { useEffect, useState, useCallback, useMemo } from "react";
import useHealthStore from "@/store/healthStore";
import { format } from "date-fns";

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
		healthDataCache,
	} = useHealthStore();

	// Use the exact same format as in healthStore.ts to ensure consistency
	const dateKey = useMemo(() => 
		format(targetDate, "yyyy-MM-dd"), 
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

		console.log(`[useHealthData] Fetching new data for date: ${targetDate.toLocaleDateString()}, key: ${dateKey}`);
		
		setIsLoading(true);
		try {
			const data = await fetchHealthData(targetDate);
			console.log(`[useHealthData] Fetch complete for ${dateKey}:`, data);
			setHealthData(data);
		} catch (error) {
			console.error(`[useHealthData] Error fetching health data for ${dateKey}:`, error);
		} finally {
			setIsLoading(false);
		}
	}, [targetDate, dateKey, hasHealthPermissions, fetchHealthData]);

	// Effect to load data when date changes
	useEffect(() => {
		// Get cached data for the specific date
		const currentCachedData = getHealthDataForDate(targetDate);
		
		console.log(`[useHealthData] Loading data for ${dateKey}, cached data:`, 
			currentCachedData ? `Found - steps: ${currentCachedData.steps}` : 'None found');
		
		if (currentCachedData) {
			console.log(`[useHealthData] Using cached data for ${dateKey}:`, currentCachedData);
			setHealthData(currentCachedData);
		} else if (hasHealthPermissions) {
			console.log(`[useHealthData] No cached data for ${dateKey}, fetching fresh data`);
			fetchData();
		}
	}, [dateKey, hasHealthPermissions, fetchData, getHealthDataForDate, targetDate]);

	// Log the full cache state whenever it changes
	useEffect(() => {
		console.log('[useHealthData] Current cache state:', 
			Object.keys(healthDataCache).map(key => `${key}: ${healthDataCache[key].steps} steps`));
	}, [healthDataCache]);

	return {
		...healthData,
		isLoading: isLoading || storeLoading,
		hasHealthPermissions,
		// Include dateKey for debugging
		_debug_dateKey: dateKey,
	};
};

export default useHealthData;
