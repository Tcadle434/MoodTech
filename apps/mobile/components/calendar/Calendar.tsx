import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar as UICalendar } from "@ui-kitten/components";
import { format } from "date-fns";
import { MoodType } from "shared";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MoodEntry } from "@/types/calendar";
import { CalendarDayCell } from "./CalendarDayCell";
import { MoodModal } from "./MoodModal";
import { MoodLegend } from "./MoodLegend";

interface CalendarProps {
	moodEntries: MoodEntry[];
	onSaveMood: (date: Date, mood: MoodType, note: string) => Promise<void>;
}

export const Calendar = ({ moodEntries, onSaveMood }: CalendarProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMode, setModalMode] = useState<"add" | "view">("add");
	const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
	const [note, setNote] = useState("");

	const handleDayPress = useCallback(
		(date: Date) => {
			setSelectedDate(date);
			const dateString = format(date, "yyyy-MM-dd");
			const existingEntry = moodEntries.find((entry) => entry.date === dateString);

			if (existingEntry) {
				setSelectedMood(existingEntry.mood);
				setNote(existingEntry.note || "");
				setModalMode("view");
			} else {
				setSelectedMood(null);
				setNote("");
				setModalMode("add");
			}
			setModalVisible(true);
		},
		[moodEntries]
	);

	const handleSave = useCallback(async () => {
		if (selectedDate && selectedMood) {
			await onSaveMood(selectedDate, selectedMood, note);
			setModalVisible(false);
			setSelectedMood(null);
			setNote("");
		}
	}, [selectedDate, selectedMood, note, onSaveMood]);

	const handleClose = useCallback(() => {
		setModalVisible(false);
		setSelectedMood(null);
		setNote("");
	}, []);

	return (
		<View style={styles.container}>
			<UICalendar
				date={selectedDate || new Date()}
				onSelect={handleDayPress}
				renderDay={(props) => <CalendarDayCell {...props} moodEntries={moodEntries} />}
				style={styles.calendar}
			/>

			<View style={styles.legend}>
				<MoodLegend />
			</View>

			<MoodModal
				visible={modalVisible}
				onClose={handleClose}
				selectedDate={selectedDate}
				viewMode={modalMode}
				selectedMood={selectedMood}
				note={note}
				onSave={handleSave}
				onMoodSelect={setSelectedMood}
				onNoteChange={setNote}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	calendar: {
		borderRadius: 24,
	},
	legend: {
		marginTop: 20,
	},
});
