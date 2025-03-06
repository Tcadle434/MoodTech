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

// Create a store
export const useMoodStore = create<MoodState>()((set, get) => ({
	entries: [],
	isLoading: false,
	error: null,

	fetchAllEntries: async () => {
		set({ isLoading: true, error: null });
		try {
			const entries = await moodService.getAllMoods();
			set({ entries, isLoading: false });
		} catch (error: any) {
			console.error("Error fetching mood entries:", error);
			set({ error: error.message || "Unknown error", isLoading: false });
		}
	},

	fetchMoodForDate: async (date) => {
		set({ isLoading: true, error: null });
		try {
			const entry = await moodService.getMoodByDate(date);
			console.log("API response for fetchMoodForDate:", entry);

			// Handle empty response
			if (!entry || (typeof entry === "string" && entry.trim() === "")) {
				console.log("Empty response from API, returning null");
				set({ isLoading: false });
				return null;
			}

			// Don't update the entire entries list for a single fetch
			set({ isLoading: false });
			return entry;
		} catch (error: any) {
			console.error("Error fetching mood for date:", error);
			set({ error: error.message || "Unknown error", isLoading: false });
			return null;
		}
	},

	fetchEntriesForDateRange: async (startDate, endDate) => {
		set({ isLoading: true, error: null });
		try {
			const entries = await moodService.getMoodsByDateRange(startDate, endDate);
			set({ entries, isLoading: false });
		} catch (error: any) {
			console.error("Error fetching mood entries for range:", error);
			set({ error: error.message || "Unknown error", isLoading: false });
		}
	},

	addMoodEntry: async (date, mood, note) => {
		set({ isLoading: true, error: null });
		try {
			console.log("Adding mood entry to store:", {
				date: format(date, "yyyy-MM-dd"),
				mood,
				note,
			});
			const newEntry = await moodService.saveMood(date, mood, note);
			console.log("Received new entry from API:", newEntry);

			set((state) => {
				console.log("Updating state with new entry");
				return {
					entries: [
						...state.entries.filter((e) => e.date !== format(date, "yyyy-MM-dd")),
						newEntry,
					],
					isLoading: false,
				};
			});
		} catch (error: any) {
			console.error("Error adding mood entry:", error);
			set({ error: error.message || "Unknown error", isLoading: false });
		}
	},

	updateMoodEntry: async (id, mood, note) => {
		set({ isLoading: true, error: null });
		try {
			const updatedEntry = await moodService.updateMood(id, mood, note);
			set((state) => ({
				entries: state.entries.map((entry) => (entry.id === id ? updatedEntry : entry)),
				isLoading: false,
			}));
		} catch (error: any) {
			console.error("Error updating mood entry:", error);
			set({ error: error.message || "Unknown error", isLoading: false });
		}
	},

	deleteMoodEntry: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await moodService.deleteMood(id);
			set((state) => ({
				entries: state.entries.filter((entry) => entry.id !== id),
				isLoading: false,
			}));
		} catch (error: any) {
			console.error("Error deleting mood entry:", error);
			set({ error: error.message || "Unknown error", isLoading: false });
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
