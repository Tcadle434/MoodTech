import { useState, useEffect, useRef } from "react";
import getLocationInit from "@/api/location/getLocationInit";

// Singleton promise to ensure location init runs once
let initPromise: Promise<boolean> | null = null;

export function useLocationInit() {
	const [isInitialized, setIsInitialized] = useState(false);
	const isMounted = useRef(true);

	useEffect(() => {
		// Avoid running if already in progress or done
		if (!initPromise) {
			initPromise = getLocationInit();
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
