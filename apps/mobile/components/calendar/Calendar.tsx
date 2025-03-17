import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar as UICalendar } from "@ui-kitten/components";
import { format } from "date-fns";
import { MoodType, SubMoodType } from "shared";
import { MoodEntry } from "@/types/calendar";
import { CalendarDayCell } from "./CalendarDayCell";
import { MoodModal } from "./MoodModal";
import { MoodLegend } from "./MoodLegend";

interface CalendarProps {
	moods: MoodEntry[];
	onSaveMood: (dateString: string, mood: MoodType, note: string) => Promise<void>;
}

export const Calendar = ({ moods, onSaveMood }: CalendarProps) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedDateString, setSelectedDateString] = useState<string | null>(null);

	const [modalVisible, setModalVisible] = useState(false);
	const [modalMode, setModalMode] = useState<"add" | "view">("add");
	const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
	const [selectedSubMood, setSelectedSubMood] = useState<SubMoodType | null>(null);
	const [note, setNote] = useState("");

	const handleDayPress = useCallback(
		(date: Date) => {
			setSelectedDate(date);

			const dateString = format(date, "yyyy-MM-dd");
			setSelectedDateString(dateString);

			const existingEntry = moods.find((entry) => entry.date === dateString);

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
		[moods]
	);

	const handleSave = useCallback(async () => {
		if (selectedDateString && selectedMood) {
			await onSaveMood(selectedDateString, selectedMood, note);
			setModalVisible(false);
			setSelectedMood(null);
			setNote("");
		}
	}, [selectedDateString, selectedMood, note, onSaveMood]);

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
				renderDay={(props) => <CalendarDayCell {...props} moodEntries={moods} />}
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
				selectedSubMood={selectedSubMood}
				note={note}
				onSave={handleSave}
				onMoodSelect={setSelectedMood}
				onSubMoodSelect={setSelectedSubMood}
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
