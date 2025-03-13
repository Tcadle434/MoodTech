import {
	StyleSheet,
	View,
	TouchableOpacity,
	Modal as RNModal,
	SafeAreaView,
	Alert,
	StatusBar,
	Animated,
} from "react-native";
import { Layout, Text, Button, Input, Spinner } from "@ui-kitten/components";
import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { MoodType, SubMoodType } from "shared";
import { useMoodStore } from "@/store/moodStore";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFocusEffect } from "@react-navigation/native";
import { HealthDataDisplay } from "@/components/HealthDataDisplay";
import { useHealthKitInit } from "@/hooks/useHealthKitInit";
import { MOOD_EMOJIS, MOOD_STYLES, getMoodName, getSubMoodName } from "@/constants/MoodConstants";
import { MoodModal } from "@/components/calendar/MoodModal";

// Mood selection component
const MoodEmoji = ({ type, onPress }: { type: MoodType; onPress: () => void }) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handlePressIn = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handlePressOut = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	return (
		<TouchableOpacity
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			activeOpacity={1}
			style={styles.moodTouchable}
		>
			<Animated.View
				style={[
					styles.moodCardContainer,
					{
						shadowColor: colors.text,
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				<LinearGradient
					colors={MOOD_STYLES[type].gradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.moodCard}
				>
					<Text style={styles.emoji}>{MOOD_EMOJIS[type]}</Text>
					<Text style={[styles.moodLabel, { color: MOOD_STYLES[type].text }]}>
						{getMoodName(type)}
					</Text>
				</LinearGradient>
			</Animated.View>
		</TouchableOpacity>
	);
};

export default function HomeScreen() {
	const isInitialized = useHealthKitInit();
	const [moodModalVisible, setMoodModalVisible] = useState(false);
	const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
	const [selectedSubMood, setSelectedSubMood] = useState<SubMoodType | null>(null);
	const [note, setNote] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.95)).current;

	// State to track today's mood from the API
	const [todayMoodEntry, setTodayMoodEntry] = useState<{
		mood: MoodType;
		subMood?: SubMoodType;
		note?: string;
	} | null>(null);

	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

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

	// Fetch mood data function - used by both initial load and focus effect
	const fetchMoodData = async () => {
		setIsLoading(true);
		try {
			console.log("[Debug] Fetching mood data for today...");
			const result = await fetchMoodForDate(new Date());
			console.log("[Debug] API result:", result);
			setTodayMoodEntry(result);
			console.log("[Debug] Today's mood entry after set:", todayMoodEntry);
		} catch (error) {
			console.error("[Debug] Error fetching mood data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Add a useEffect to log todayMoodEntry changes
	useEffect(() => {
		console.log("[Debug] todayMoodEntry changed:", todayMoodEntry);
	}, [todayMoodEntry]);

	// Refresh data when the screen comes into focus
	useFocusEffect(
		React.useCallback(() => {
			fetchMoodData();
		}, [fetchMoodForDate])
	);

	const handleSaveMood = async () => {
		try {
			if (!selectedMood || !selectedSubMood) return;

			await addMoodEntry(new Date(), selectedMood, note, selectedSubMood);

			setMoodModalVisible(false);
			setSelectedMood(null);
			setSelectedSubMood(null);
			setNote("");

			// Refresh the mood data
			const updatedMood = await fetchMoodForDate(new Date());
			setTodayMoodEntry(updatedMood);
		} catch (error) {
			console.error("Error saving mood:", error);
			Alert.alert("Error", "Could not save your mood. Please try again.");
		}
	};

	// Function to determine if we have a valid mood to show
	const hasValidMoodToday = () => {
		return todayMoodEntry !== null;
	};

	const today = format(new Date(), "EEEE, MMMM d");

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
							Today
						</Text>
						<Text
							category="s1"
							style={[styles.headerDate, { color: colors.textSecondary }]}
						>
							{today}
						</Text>
					</View>

					{isLoading ? (
						<View style={styles.loadingContainer}>
							<Spinner size="large" status="primary" />
							<Text
								category="s1"
								style={[styles.loadingText, { color: colors.textSecondary }]}
							>
								Loading your mood data...
							</Text>
						</View>
					) : hasValidMoodToday() && todayMoodEntry ? (
						<Animated.View
							style={[
								styles.todayMoodContainer,
								{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
							]}
						>
							<Text
								category="h5"
								style={[styles.todayMoodTitle, { color: colors.text }]}
							>
								Your mood today
							</Text>
							<View
								style={[
									styles.todayMoodCardContainer,
									{ shadowColor: colors.text },
								]}
							>
								<LinearGradient
									colors={MOOD_STYLES[todayMoodEntry.mood].gradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.todayMoodCard}
								>
									<Text style={styles.todayEmoji}>
										{MOOD_EMOJIS[todayMoodEntry.mood]}
									</Text>
									<Text category="s1" style={styles.todayMoodType}>
										{getMoodName(todayMoodEntry.mood)}
									</Text>
									{todayMoodEntry.subMood && (
										<Text style={styles.todaySubMoodType}>
											{getSubMoodName(todayMoodEntry.subMood)}
										</Text>
									)}
									<View style={styles.noteDivider} />
									<Text category="p1" style={styles.todayMoodNote}>
										{todayMoodEntry.note || "No note added"}
									</Text>
								</LinearGradient>
							</View>
						</Animated.View>
					) : (
						<Animated.View
							style={[
								styles.moodPromptContainer,
								{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
							]}
						>
							<Text
								category="h5"
								style={[styles.promptTitle, { color: colors.text }]}
							>
								How are you feeling today?
							</Text>
							<Text
								category="p2"
								style={[styles.promptSubtitle, { color: colors.textSecondary }]}
							>
								Tap on an option below to record your mood
							</Text>
							<View style={styles.moodRow}>
								{Object.values(MoodType).map((mood) => (
									<MoodEmoji
										key={mood}
										type={mood}
										onPress={() => {
											setSelectedMood(mood);
											setMoodModalVisible(true);
										}}
									/>
								))}
							</View>
						</Animated.View>
					)}

					<MoodModal
						visible={moodModalVisible}
						onClose={() => {
							setMoodModalVisible(false);
							setSelectedMood(null);
							setSelectedSubMood(null);
							setNote("");
						}}
						selectedDate={new Date()}
						viewMode="add"
						selectedMood={selectedMood}
						selectedSubMood={selectedSubMood}
						note={note}
						onSave={handleSaveMood}
						onMoodSelect={setSelectedMood}
						onSubMoodSelect={setSelectedSubMood}
						onNoteChange={setNote}
					/>
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
		paddingTop: 48,
	},
	headerTitle: {
		fontSize: 34,
		marginBottom: 4,
		fontWeight: "700",
	},
	headerDate: {
		fontSize: 16,
		opacity: 0.7,
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
	moodPromptContainer: {
		flex: 1,
		padding: 24,
		paddingTop: 40,
		alignItems: "center",
	},
	promptTitle: {
		fontSize: 28,
		fontWeight: "600",
		marginBottom: 12,
		textAlign: "center",
	},
	promptSubtitle: {
		fontSize: 16,
		opacity: 0.7,
		marginBottom: 48,
		textAlign: "center",
		maxWidth: 280,
	},
	moodRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		gap: 16,
		paddingHorizontal: 16,
	},
	moodTouchable: {
		width: "28%",
		minWidth: 90,
		maxWidth: 110,
		aspectRatio: 0.85,
		marginBottom: 16,
	},
	moodCardContainer: {
		width: "100%",
		height: "100%",
		borderRadius: 20,
		overflow: "hidden",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 5,
	},
	moodCard: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
		borderRadius: 20,
	},
	emoji: {
		fontSize: 36,
		marginBottom: 8,
	},
	moodLabel: {
		textAlign: "center",
		fontSize: 14,
		fontWeight: "600",
		color: "#FFFFFF",
		opacity: 0.9,
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
		zIndex: 1001,
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
	modalTitle: {
		marginBottom: 24,
		fontSize: 24,
		fontWeight: "600",
		textAlign: "center",
	},
	selectedMoodContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
		width: "100%",
		padding: 16,
		borderRadius: 16,
		backgroundColor: "rgba(0, 0, 0, 0.03)",
	},
	selectedMoodEmoji: {
		fontSize: 32,
		marginRight: 16,
	},
	selectedMoodText: {
		fontSize: 16,
	},
	healthDataContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderRadius: 12,
		marginBottom: 16,
		width: "100%",
	},
	healthIcon: {
		width: 20,
		height: 20,
		marginRight: 8,
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
	todayMoodContainer: {
		padding: 24,
	},
	todayMoodTitle: {
		marginBottom: 20,
		fontSize: 24,
		fontWeight: "600",
	},
	todayMoodCardContainer: {
		borderRadius: 24,
		overflow: "hidden",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.15,
		shadowRadius: 16,
		elevation: 8,
	},
	todayMoodCard: {
		padding: 24,
		borderRadius: 24,
	},
	todayEmoji: {
		fontSize: 60,
		marginBottom: 16,
		alignSelf: "center",
		color: "#FFFFFF",
	},
	todayMoodType: {
		textAlign: "center",
		marginBottom: 24,
		fontWeight: "700",
		fontSize: 22,
		color: "#FFFFFF",
	},
	todaySubMoodType: {
		fontSize: 18,
		color: "rgba(255, 255, 255, 0.9)",
		marginBottom: 16,
		textAlign: "center",
	},
	noteDivider: {
		height: 1,
		width: "100%",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		marginBottom: 16,
	},
	todayMoodNote: {
		fontStyle: "italic",
		color: "rgba(255, 255, 255, 0.9)",
		lineHeight: 20,
	},
});
