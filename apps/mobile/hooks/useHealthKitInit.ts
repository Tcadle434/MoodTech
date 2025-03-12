import { useState, useEffect, useRef } from "react";
import getHealthKitInit from "@/api/healthKit/getHealthKitInit";

// Singleton promise to ensure initHealthKit runs once
let initPromise: Promise<boolean> | null = null;

export function useHealthKitInit() {
	const [isInitialized, setIsInitialized] = useState(false);
	const isMounted = useRef(true);

	useEffect(() => {
		// Avoid running if already in progress or done
		if (!initPromise) {
			initPromise = getHealthKitInit();
		}

		initPromise
			.then(() => {
				if (isMounted.current) setIsInitialized(true);
			})
			.catch((err) => {
				if (isMounted.current) console.error(err);
			});

		return () => {
			isMounted.current = false;
		};
	}, []);

	return isInitialized;
}
