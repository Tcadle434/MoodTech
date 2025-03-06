import { create } from "zustand";
import { MoodType } from "shared";
import { format, parseISO } from "date-fns";
import { moodService } from "@/api";

interface MoodEntry {
	id: string;
	date: string; // ISO date string
	mood: MoodType;
	note?: string;
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
	addMoodEntry: (date: Date, mood: MoodType, note?: string) => Promise<void>;
	updateMoodEntry: (id: string, mood: MoodType, note?: string) => Promise<void>;
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

	addMoodEntry: async (date, mood, note) => {
		set({ isLoading: true, error: null });
		try {
			const formattedDate = format(date, "yyyy-MM-dd");
			const newEntry = await moodService.saveMood(date, mood, note);

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

	updateMoodEntry: async (id, mood, note) => {
		set({ isLoading: true, error: null });
		try {
			const updatedEntry = await moodService.updateMood(id, mood, note);
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
