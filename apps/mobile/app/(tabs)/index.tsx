import React, { useState, useRef, useEffect, useMemo } from "react";
import {
	StyleSheet,
	View,
	Modal as RNModal,
	SafeAreaView,
	Alert,
	StatusBar,
	Animated,
} from "react-native";
import { Layout, Text, Button, Input, Spinner } from "@ui-kitten/components";
import { format, parseISO } from "date-fns";
import { MoodType, SubMoodType } from "shared";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HealthDataDisplay } from "@/components/HealthDataDisplay";
import { useHealthKitInit } from "@/hooks/useHealthKitInit";
import { MOOD_METADATA, SUB_MOOD_EMOJIS, getSubMoodName } from "@/constants/MoodConstants";
import { useMoodForDate } from "@/hooks/useMoodForDate";
import { useSaveMood } from "@/hooks/useSaveMood";
import { useQueryClient } from "@tanstack/react-query";
import { MoodEmoji } from "@/components/MoodEmoji";
import { MoodModal } from "@/components/calendar";

export default function HomeScreen() {
	const today = new Date();
	const todayString = useMemo(() => format(today, "yyyy-MM-dd"), []);
	const formattedToday = format(parseISO(todayString), "EEEE, MMMM d");

	const isInitialized = useHealthKitInit();
	const queryClient = useQueryClient();
	const { data: moodForDate, isLoading: isMoodLoading } = useMoodForDate(todayString);
	const { mutate: saveMood, isPending: isSaving } = useSaveMood();

	const [moodModalVisible, setMoodModalVisible] = useState(false);
	const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
	const [selectedSubMood, setSelectedSubMood] = useState<SubMoodType | null>(null);
	const [note, setNote] = useState("");

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.95)).current;

	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	const handleSaveMood = async () => {
		console.log("selectedMood", selectedMood);
		console.log("selectedSubMood", selectedSubMood);
		saveMood(
			{
				dateString: todayString,
				mood: selectedMood || MoodType.HAPPY,
				subMood: selectedSubMood || undefined,
				note,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["mood"] });
					queryClient.invalidateQueries({ queryKey: ["moods"] });
					setMoodModalVisible(false);
					setNote("");
				},
				onError: (error) => {
					console.error("Error saving mood:", error);
					Alert.alert("Error", "Could not save your mood. Please try again.");
				},
			}
		);
	};

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
							{formattedToday}
						</Text>
					</View>

					{isMoodLoading ? (
						<View style={styles.loadingContainer}>
							<Spinner size="large" status="primary" />
							<Text
								category="s1"
								style={[styles.loadingText, { color: colors.textSecondary }]}
							>
								Loading your mood data...
							</Text>
						</View>
					) : moodForDate ? (
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
									colors={MOOD_METADATA[moodForDate.mood].gradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.todayMoodCard}
								>
									<Text style={styles.todayEmoji}>
										{MOOD_METADATA[moodForDate.mood].emoji}
									</Text>
									<Text category="s1" style={styles.todayMoodType}>
										{MOOD_METADATA[moodForDate.mood].name}
									</Text>
									{moodForDate.subMood && (
										<View style={styles.subMoodContainer}>
											<Text style={styles.todaySubMoodType}>
												{getSubMoodName(moodForDate.subMood)}
											</Text>
											<Text style={styles.todaySubMoodEmoji}>
												{SUB_MOOD_EMOJIS[moodForDate.subMood]}
											</Text>
										</View>
									)}
									<View style={styles.noteDivider} />
									<Text category="p1" style={styles.todayMoodNote}>
										{moodForDate.note || "No note added"}
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
	todaySubMoodType: {
		fontSize: 18,
		color: "rgba(255, 255, 255, 0.9)",
		marginBottom: 16,
		textAlign: "center",
	},
	subMoodContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	todaySubMoodEmoji: {
		fontSize: 18,
		color: "rgba(255, 255, 255, 0.9)",
		marginBottom: 16,
		textAlign: "center",
	},
});
