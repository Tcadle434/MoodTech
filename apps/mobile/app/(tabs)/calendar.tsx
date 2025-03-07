import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Modal,
	SafeAreaView,
	ScrollView,
	Animated,
	StatusBar,
} from "react-native";
import {
	Layout,
	Text,
	Button,
	Input,
	Calendar,
	CalendarProps,
	Spinner,
} from "@ui-kitten/components";
import {
	format,
	startOfMonth,
	subDays,
	isSameDay,
	isFuture,
	endOfMonth,
} from "date-fns";
import { MoodType } from "shared";
import { useMoodStore } from "@/store/moodStore";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "@react-navigation/native";

// Interface for mood entries
interface MoodEntry {
	id: string;
	date: string; // ISO date string
	mood: MoodType;
	note?: string;
}

// Mood emoji mapping helper
const MOOD_EMOJIS = {
	[MoodType.HAPPY]: "😊",
	[MoodType.NEUTRAL]: "😐",
	[MoodType.SAD]: "😢",
};

// Mood gradients mapping
const MOOD_GRADIENTS = {
	[MoodType.HAPPY]: ["#84B59F", "#6B9681"], // Success/tertiary colors
	[MoodType.NEUTRAL]: ["#5B9AA9", "#4A7F8C"], // Primary color
	[MoodType.SAD]: ["#7B98A6", "#6C8490"], // Neutral, more subdued
};

// Get mood color 
const getMoodColor = (mood: MoodType, colorScheme: "light" | "dark" = "light"): string => {
	switch (mood) {
		case MoodType.HAPPY:
			return colorScheme === "light" ? "#84B59F" : "#8FC0A9";
		case MoodType.NEUTRAL:
			return colorScheme === "light" ? "#5B9AA9" : "#64A7B5";
		case MoodType.SAD:
			return colorScheme === "light" ? "#7B98A6" : "#6E8C9E";
		default:
			return "transparent";
	}
};

// Get mood name helper
const getMoodName = (mood: MoodType): string => {
	switch (mood) {
		case MoodType.HAPPY: return "Happy";
		case MoodType.NEUTRAL: return "Neutral";
		case MoodType.SAD: return "Sad";
		default: return "";
	}
};

// This will highlight dates with mood data in the calendar
type DayCellProps = CalendarProps<Date> & {
	moodEntries: MoodEntry[];
};

const DayCell = (props: DayCellProps) => {
	const { date, style = {}, moodEntries, ...cellProps } = props;
	const scheme = useColorScheme();
	const colors = Colors[scheme];

	if (!date) return null;

	const currentDate = new Date();

	// Don't allow selecting future dates
	if (isFuture(date) && !isSameDay(date, currentDate)) {
		return (
			<View style={[styles.dayCell, styles.disabledDayCell, style?.container]} {...cellProps}>
				<Text
					style={[style?.text, styles.disabledDayText, { color: colors.subtle }]}
				>{`${date.getDate()}`}</Text>
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
						colors={MOOD_GRADIENTS[moodEntry.mood]}
						style={styles.moodGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						<Text
							style={[style?.text, styles.moodDayText]}
						>{`${date.getDate()}`}</Text>
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

export default function CalendarScreen() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [moodModalVisible, setMoodModalVisible] = useState(false);
	const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
	const [note, setNote] = useState("");
	const [viewMode, setViewMode] = useState<"add" | "view">("add");
	const [isLoading, setIsLoading] = useState(true);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const fadeAnim = React.useRef(new Animated.Value(0)).current;
	const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
	const [calendarKey, setCalendarKey] = useState(0);

	const scheme = useColorScheme();
	const colors = Colors[scheme];

	const { entries, refreshTrigger, fetchEntriesForDateRange } = useMoodStore();
	const addMoodEntry = useMoodStore((state) => state.addMoodEntry);
	const fetchMoodForDate = useMoodStore((state) => state.fetchMoodForDate);

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
			// Don't show loading spinner on focus refresh
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
			// Force calendar to re-render by changing its key
			setCalendarKey((prev) => prev + 1);
		};

		fetchAndUpdate();
	}, [refreshTrigger, currentMonth, fetchEntriesForDateRange]);

	const handleDayPress = async (date: Date) => {
		// Only allow selecting today or past dates
		if (isFuture(date) && !isSameDay(date, new Date())) {
			return;
		}

		setSelectedDate(date);

		try {
			// Fetch the latest data for this date
			const moodEntry = await fetchMoodForDate(date);

			if (moodEntry) {
				setSelectedMood(moodEntry.mood);
				setNote(moodEntry.note || "");
				setViewMode("view");
			} else {
				setSelectedMood(null);
				setNote("");
				setViewMode("add");
			}

			setMoodModalVisible(true);
		} catch (error) {
			console.error("Error fetching mood for date:", error);
		}
	};

	const handleSaveMood = async () => {
		if (selectedDate && selectedMood) {
			try {
				await addMoodEntry(selectedDate, selectedMood, note);

				// Refresh entries for the current month after adding a new entry
				const start = startOfMonth(currentMonth);
				const end = endOfMonth(currentMonth);
				await fetchEntriesForDateRange(start, end);

				setMoodModalVisible(false);
			} catch (error) {
				console.error("Error saving mood:", error);
			}
		}
	};

	// Render mood selection buttons in the modal
	const renderMoodButtons = () => {
		return Object.values(MoodType).map((mood) => (
			<TouchableOpacity
				key={mood}
				style={[
					styles.moodButton,
					{
						borderColor: selectedMood === mood 
							? getMoodColor(mood, scheme) 
							: colors.subtle,
					},
					selectedMood === mood && [
						styles.selectedMoodButton,
						{
							backgroundColor: `${getMoodColor(mood, scheme)}20`,
						},
					],
				]}
				activeOpacity={0.7}
				onPress={() => setSelectedMood(mood)}
			>
				<Text style={styles.moodButtonEmoji}>{MOOD_EMOJIS[mood]}</Text>
				<Text style={{ color: colors.text }}>{getMoodName(mood)}</Text>
			</TouchableOpacity>
		));
	};

	// Render legend items
	const renderLegendItems = () => {
		return Object.values(MoodType).map((mood) => (
			<View key={mood} style={styles.legendItem}>
				<LinearGradient
					colors={MOOD_GRADIENTS[mood]}
					style={styles.legendColor}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				/>
				<Text style={{ color: colors.text }}>{getMoodName(mood)}</Text>
			</View>
		));
	};

	return (
		<Layout style={[styles.container, { backgroundColor: colors.background }]}>
			<StatusBar barStyle={scheme === "dark" ? "light-content" : "dark-content"} />
			<Animated.View
				style={[
					styles.animatedContainer,
					{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
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
								<Calendar
									key={calendarKey}
									style={styles.calendar}
									date={currentMonth}
									onSelect={handleDayPress}
									renderDay={(props) => (
										<DayCell {...props} moodEntries={entries} />
									)}
									onVisibleDateChange={setCurrentMonth}
								/>
							</View>

							<View style={[styles.legend, { backgroundColor: colors.surface }]}>
								{renderLegendItems()}
							</View>
						</ScrollView>
					)}

					<Modal
						visible={moodModalVisible}
						animationType="slide"
						transparent={true}
						onRequestClose={() => setMoodModalVisible(false)}
					>
						<BlurView
							intensity={30}
							tint={scheme === "dark" ? "dark" : "light"}
							style={styles.modalOverlay}
						>
							<View
								style={[
									styles.modalContent,
									{
										backgroundColor: colors.surface,
										shadowColor: colors.text,
									},
								]}
							>
								<View
									style={[styles.modalHandle, { backgroundColor: colors.subtle }]}
								/>

								{selectedDate && (
									<Text
										category="h5"
										style={[styles.modalDate, { color: colors.text }]}
									>
										{format(selectedDate, "MMMM d, yyyy")}
									</Text>
								)}

								{viewMode === "view" ? (
									<>
										<View
											style={[
												styles.moodDetails,
												{ backgroundColor: colors.background },
											]}
										>
											<LinearGradient
												colors={MOOD_GRADIENTS[selectedMood || MoodType.HAPPY]}
												style={styles.moodDetailGradient}
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 1 }}
											>
												<Text style={styles.moodEmoji}>
													{selectedMood ? MOOD_EMOJIS[selectedMood] : ""}
												</Text>
												<Text category="h6" style={styles.moodDetailTitle}>
													{selectedMood ? getMoodName(selectedMood) : ""}
												</Text>

												{note ? (
													<>
														<View style={styles.noteDivider} />
														<Text style={styles.moodNote}>{note}</Text>
													</>
												) : null}
											</LinearGradient>
										</View>

										<Button
											style={styles.modalButton}
											status="primary"
											onPress={() => setMoodModalVisible(false)}
										>
											Close
										</Button>
									</>
								) : (
									<>
										<Text
											category="h5"
											style={[styles.modalTitle, { color: colors.text }]}
										>
											How were you feeling?
										</Text>

										<View style={styles.moodButtonRow}>
											{renderMoodButtons()}
										</View>

										<Input
											multiline
											textStyle={{ minHeight: 100, color: colors.text }}
											placeholder="Any notes about your day? (optional)"
											placeholderTextColor={colors.textSecondary}
											value={note}
											onChangeText={setNote}
											style={styles.noteInput}
										/>

										<Button
											onPress={handleSaveMood}
											style={styles.saveButton}
											status="primary"
											disabled={!selectedMood}
										>
											Save
										</Button>

										<Button
											appearance="ghost"
											status="basic"
											onPress={() => setMoodModalVisible(false)}
										>
											Cancel
										</Button>
									</>
								)}
							</View>
						</BlurView>
					</Modal>
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
	calendar: {
		borderRadius: 24,
	},
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
	legend: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 10,
		marginBottom: 20,
		padding: 16,
		borderRadius: 16,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	legendColor: {
		width: 20,
		height: 20,
		borderRadius: 10,
		marginRight: 8,
		overflow: "hidden",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
		zIndex: 1000,
	},
	modalContent: {
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		padding: 24,
		paddingTop: 16,
		alignItems: "center",
		minHeight: 320,
		shadowOffset: { width: 0, height: -8 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 10,
	},
	modalHandle: {
		width: 40,
		height: 5,
		borderRadius: 3,
		marginBottom: 24,
	},
	modalDate: {
		marginBottom: 24,
		fontSize: 22,
		fontWeight: "600",
		textAlign: "center",
	},
	modalTitle: {
		marginBottom: 24,
		fontSize: 24,
		fontWeight: "600",
		textAlign: "center",
	},
	moodButtonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginBottom: 24,
	},
	moodButton: {
		padding: 16,
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 16,
		width: "30%",
	},
	selectedMoodButton: {
		borderWidth: 2,
	},
	moodButtonEmoji: {
		fontSize: 32,
		marginBottom: 8,
	},
	noteInput: {
		width: "100%",
		marginBottom: 24,
		borderRadius: 16,
	},
	saveButton: {
		width: "100%",
		marginBottom: 12,
		borderRadius: 16,
		height: 56,
	},
	moodDetails: {
		alignItems: "center",
		marginBottom: 30,
		width: "100%",
		borderRadius: 20,
		overflow: "hidden",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.15,
		shadowRadius: 10,
		elevation: 6,
	},
	moodDetailGradient: {
		alignItems: "center",
		width: "100%",
		padding: 24,
	},
	moodEmoji: {
		fontSize: 60,
		marginBottom: 16,
		color: "#FFFFFF",
	},
	moodDetailTitle: {
		marginBottom: 16,
		fontSize: 22,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	noteDivider: {
		height: 1,
		width: "80%",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		marginBottom: 16,
	},
	moodNote: {
		fontStyle: "italic",
		textAlign: "center",
		color: "rgba(255, 255, 255, 0.9)",
		lineHeight: 22,
	},
	modalButton: {
		width: "100%",
		borderRadius: 16,
		height: 56,
	},
});
