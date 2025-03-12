import { MoodType } from "shared";
import { StyleProp, ViewStyle, TextStyle } from "react-native";
import { CalendarProps } from "@ui-kitten/components";

export interface MoodEntry {
	id: string;
	date: string; // ISO date string
	mood: MoodType;
	note?: string;
}

export interface DayCellProps {
	date: Date | undefined;
	style?: {
		container?: StyleProp<ViewStyle>;
		text?: StyleProp<TextStyle>;
	};
	moodEntries: MoodEntry[];
	onSelect?: (date: Date) => void;
}

export interface CalendarDayCellProps extends CalendarProps {
	moodEntries: MoodEntry[];
}

export interface MoodModalProps {
	visible: boolean;
	onClose: () => void;
	selectedDate: Date | null;
	viewMode: "add" | "view";
	selectedMood: MoodType | null;
	note: string;
	onSave: () => void;
	onMoodSelect: (mood: MoodType) => void;
	onNoteChange: (text: string) => void;
}
