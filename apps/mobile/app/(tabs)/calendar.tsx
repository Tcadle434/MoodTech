import React, { useState, useEffect } from "react";
import { StyleSheet, Animated, View, SafeAreaView, ScrollView } from "react-native";
import { Layout, Text, Spinner } from "@ui-kitten/components";
import { startOfMonth, endOfMonth } from "date-fns";
import { MoodType } from "shared";
import { useFocusEffect } from "@react-navigation/native";

import { useMoodStore } from "@/store/moodStore";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Calendar } from "@/components/calendar";

export default function CalendarScreen() {
	const [isLoading, setIsLoading] = useState(true);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const fadeAnim = React.useRef(new Animated.Value(0)).current;
	const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	const { entries, refreshTrigger, fetchEntriesForDateRange } = useMoodStore();
	const addMoodEntry = useMoodStore((state) => state.addMoodEntry);

	// Animation effect when component mounts
	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
			}),
		]).start();
	}, [fadeAnim, scaleAnim]);

	// Load current month's data
	const loadMonthData = async (month: Date) => {
		setIsLoading(true);
		try {
			const start = startOfMonth(month);
			const end = endOfMonth(month);
			await fetchEntriesForDateRange(start, end);
		} catch (error) {
			console.error("Error fetching month data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Initial load on mount
	useEffect(() => {
		// Small delay to ensure auth is set up
		setTimeout(() => loadMonthData(currentMonth), 500);
	}, [currentMonth]);

	// Refresh data when screen comes into focus
	useFocusEffect(
		React.useCallback(() => {
			const refreshData = async () => {
				try {
					const start = startOfMonth(currentMonth);
					const end = endOfMonth(currentMonth);
					await fetchEntriesForDateRange(start, end);
				} catch (error) {
					console.error("Error refreshing calendar data:", error);
				}
			};

			refreshData();
		}, [currentMonth, fetchEntriesForDateRange])
	);

	// Re-fetch when refreshTrigger changes
	useEffect(() => {
		const fetchAndUpdate = async () => {
			await fetchEntriesForDateRange(startOfMonth(currentMonth), endOfMonth(currentMonth));
		};

		fetchAndUpdate();
	}, [refreshTrigger, currentMonth, fetchEntriesForDateRange]);

	const handleSaveMood = async (date: Date, mood: MoodType, note: string) => {
		try {
			await addMoodEntry(date, mood, note);

			// Refresh the current month's data
			await loadMonthData(currentMonth);
		} catch (error) {
			console.error("Error saving mood:", error);
		}
	};

	return (
		<Layout style={[styles.container, { backgroundColor: colors.background }]}>
			<Animated.View
				style={[
					styles.animatedContainer,
					{
						opacity: fadeAnim,
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.header}>
						<Text category="h1" style={[styles.headerTitle, { color: colors.text }]}>
							History
						</Text>
						<Text
							category="s1"
							style={[styles.headerSubtitle, { color: colors.textSecondary }]}
						>
							Your mood journey
						</Text>
					</View>

					{isLoading ? (
						<View style={styles.loadingContainer}>
							<Spinner size="large" status="primary" />
							<Text
								category="s1"
								style={[styles.loadingText, { color: colors.textSecondary }]}
							>
								Loading your calendar data...
							</Text>
						</View>
					) : (
						<ScrollView
							style={styles.calendarContainer}
							showsVerticalScrollIndicator={false}
						>
							<View
								style={[
									styles.calendarWrapper,
									{
										backgroundColor: colors.surface,
										shadowColor: colors.text,
									},
								]}
							>
								<Calendar moodEntries={entries} onSaveMood={handleSaveMood} />
							</View>
						</ScrollView>
					)}
				</SafeAreaView>
			</Animated.View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	animatedContainer: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		padding: 24,
		paddingTop: 60,
	},
	headerTitle: {
		fontSize: 34,
		marginBottom: 8,
		fontWeight: "700",
	},
	headerSubtitle: {
		fontSize: 16,
		opacity: 0.8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	loadingText: {
		marginTop: 20,
		opacity: 0.8,
	},
	calendarContainer: {
		flex: 1,
		padding: 24,
		paddingTop: 10,
	},
	calendarWrapper: {
		borderRadius: 24,
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.12,
		shadowRadius: 12,
		elevation: 6,
		marginBottom: 20,
		overflow: "hidden",
	},
});
