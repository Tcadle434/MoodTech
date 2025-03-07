import { create } from "zustand";
import { MoodType, HealthData } from "shared";
import { format, parseISO } from "date-fns";
import { moodService, healthService } from "@/api";
import useHealthStore from "./healthStore";

interface MoodEntry {
	id: string;
	date: string; // ISO date string
	mood: MoodType;
	note?: string;
	healthData?: HealthData;
}

interface MoodState {
	entries: MoodEntry[];
	isLoading: boolean;
	error: string | null;
	refreshTrigger: boolean;

	// Actions
	fetchAllEntries: () => Promise<void>;
	fetchMoodForDate: (date: Date) => Promise<MoodEntry | null>;
	fetchEntriesForDateRange: (startDate: Date, endDate: Date) => Promise<void>;
	addMoodEntry: (date: Date, mood: MoodType, note?: string, includeHealthData?: boolean) => Promise<void>;
	updateMoodEntry: (id: string, mood: MoodType, note?: string, includeHealthData?: boolean) => Promise<void>;
	deleteMoodEntry: (id: string) => Promise<void>;
	getMoodForDate: (date: Date) => MoodEntry | undefined;
	getEntriesForDateRange: (startDate: Date, endDate: Date) => MoodEntry[];
}

// Error handling helper
const handleError = (error: any, errorMsg: string): string => {
	console.error(errorMsg, error);
	return error.message || "Unknown error";
};

// Create a store
export const useMoodStore = create<MoodState>()((set, get) => ({
	entries: [],
	isLoading: false,
	error: null,
	refreshTrigger: false,

	fetchAllEntries: async () => {
		set({ isLoading: true, error: null });
		try {
			const entries = await moodService.getAllMoods();
			set({ entries, isLoading: false });
		} catch (error: any) {
			set({ 
				error: handleError(error, "Error fetching mood entries:"), 
				isLoading: false 
			});
		}
	},

	fetchMoodForDate: async (date) => {
		set({ isLoading: true, error: null });
		try {
			const entry = await moodService.getMoodByDate(date);

			// Handle empty response
			if (!entry || (typeof entry === "string" && entry.trim() === "")) {
				set({ isLoading: false });
				return null;
			}

			// Update the entries list to include this entry
			set((state) => {
				const formattedDate = format(date, "yyyy-MM-dd");
				const existingEntryIndex = state.entries.findIndex((e) => e.date === formattedDate);
				const newEntries = [...state.entries];

				if (existingEntryIndex >= 0) {
					newEntries[existingEntryIndex] = entry;
				} else {
					newEntries.push(entry);
				}

				return {
					entries: newEntries,
					refreshTrigger: !state.refreshTrigger,
					isLoading: false,
				};
			});

			return entry;
		} catch (error: any) {
			set({ 
				error: handleError(error, "Error fetching mood for date:"), 
				isLoading: false 
			});
			return null;
		}
	},

	fetchEntriesForDateRange: async (startDate, endDate) => {
		set({ isLoading: true, error: null });
		try {
			const entries = await moodService.getMoodsByDateRange(startDate, endDate);
			set({ entries, isLoading: false });
		} catch (error: any) {
			set({ 
				error: handleError(error, "Error fetching mood entries for range:"), 
				isLoading: false 
			});
		}
	},

	addMoodEntry: async (date, mood, note, includeHealthData = false) => {
		set({ isLoading: true, error: null });
		try {
			const formattedDate = format(date, "yyyy-MM-dd");
			
			// If health data should be included, try to fetch it
			let healthData = undefined;
			if (includeHealthData) {
				try {
					// Get health data from the store or fetch it if needed
					healthData = await useHealthStore.getState().fetchHealthData(date);
				} catch (healthError) {
					console.error("Failed to fetch health data:", healthError);
					// Continue without health data if there's an error
				}
			}
			
			// Save mood with optional health data
			const newEntry = await moodService.saveMood(
				date, 
				mood, 
				note, 
				healthData ? {
					steps: healthData.steps,
					distance: healthData.distance,
					calories: healthData.calories
				} : undefined
			);

			set((state) => ({
				entries: [
					...state.entries.filter((e) => e.date !== formattedDate),
					newEntry,
				],
				refreshTrigger: !state.refreshTrigger,
				isLoading: false,
			}));
		} catch (error: any) {
			set({ 
				error: handleError(error, "Error adding mood entry:"), 
				isLoading: false 
			});
		}
	},

	updateMoodEntry: async (id, mood, note, includeHealthData = false) => {
		set({ isLoading: true, error: null });
		try {
			// Find the existing entry to get its date
			const existingEntry = get().entries.find(entry => entry.id === id);
			
			// If health data should be included, try to fetch it
			let healthData = undefined;
			if (includeHealthData && existingEntry) {
				try {
					const date = parseISO(existingEntry.date);
					// Get health data from the store or fetch it if needed
					healthData = await useHealthStore.getState().fetchHealthData(date);
				} catch (healthError) {
					console.error("Failed to fetch health data:", healthError);
					// Continue without health data if there's an error
				}
			}
			
			// Update the mood with optional health data
			const updatedEntry = await moodService.updateMood(
				id, 
				mood, 
				note,
				healthData ? {
					steps: healthData.steps,
					distance: healthData.distance,
					calories: healthData.calories
				} : undefined
			);
			
			set((state) => ({
				entries: state.entries.map((entry) => (entry.id === id ? updatedEntry : entry)),
				refreshTrigger: !state.refreshTrigger,
				isLoading: false,
			}));
		} catch (error: any) {
			set({ 
				error: handleError(error, "Error updating mood entry:"), 
				isLoading: false 
			});
		}
	},

	deleteMoodEntry: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await moodService.deleteMood(id);
			set((state) => ({
				entries: state.entries.filter((entry) => entry.id !== id),
				refreshTrigger: !state.refreshTrigger,
				isLoading: false,
			}));
		} catch (error: any) {
			set({ 
				error: handleError(error, "Error deleting mood entry:"), 
				isLoading: false 
			});
		}
	},

	getMoodForDate: (date) => {
		const dateString = format(date, "yyyy-MM-dd");
		return get().entries.find((entry) => entry.date === dateString);
	},

	getEntriesForDateRange: (startDate, endDate) => {
		return get().entries.filter((entry) => {
			const entryDate = parseISO(entry.date);
			return entryDate >= startDate && entryDate <= endDate;
		});
	},
}));
