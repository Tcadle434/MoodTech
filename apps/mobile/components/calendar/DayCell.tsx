import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { format, isFuture, isSameDay, subDays } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { DayCellProps } from "@/types/calendar";
import { MOOD_METADATA } from "@/constants/MoodConstants";

export const DayCell = (props: DayCellProps) => {
	const { date, style, moodEntries, ...cellProps } = props;
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	if (!date) return null;

	const currentDate = new Date();

	// Don't allow selecting future dates
	if (isFuture(date) && !isSameDay(date, currentDate)) {
		return (
			<View style={[styles.dayCell, styles.disabledDayCell, style?.container]} {...cellProps}>
				<Text style={[style?.text, styles.disabledDayText, { color: colors.secondary }]}>
					{`${date.getDate()}`}
				</Text>
			</View>
		);
	}

	// Check if there's mood data for this date
	const dateString = format(date, "yyyy-MM-dd");
	const moodEntry = moodEntries.find((entry) => entry.date === dateString);

	const isToday = isSameDay(date, new Date());
	const isThisWeek = date > subDays(new Date(), 7) && !isFuture(date);

	return (
		<View
			style={[
				styles.dayCell,
				style?.container,
				isToday && [styles.todayCell, { borderColor: colors.tint }],
			]}
			{...cellProps}
		>
			{moodEntry ? (
				<View style={[styles.moodIndicator, { shadowColor: colors.text }]}>
					<LinearGradient
						colors={MOOD_METADATA[moodEntry.mood].gradient}
						style={styles.moodGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						<Text style={[style?.text, styles.moodDayText]}>{`${date.getDate()}`}</Text>
					</LinearGradient>
				</View>
			) : (
				<>
					<Text style={[style?.text, { color: colors.text }]}>{`${date.getDate()}`}</Text>
					{isThisWeek && (
						<View style={[styles.addButton, { backgroundColor: colors.secondary }]} />
					)}
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	dayCell: {
		aspectRatio: 1,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		margin: 2,
	},
	todayCell: {
		borderWidth: 2,
		borderStyle: "dashed",
	},
	disabledDayCell: {
		opacity: 0.4,
	},
	disabledDayText: {
		opacity: 0.4,
	},
	moodIndicator: {
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	moodGradient: {
		width: "100%",
		height: "100%",
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	moodDayText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 14,
	},
	addButton: {
		width: 5,
		height: 5,
		borderRadius: 2.5,
		position: "absolute",
		bottom: 4,
	},
});
