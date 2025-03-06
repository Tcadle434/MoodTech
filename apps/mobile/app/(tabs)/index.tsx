import {
	StyleSheet,
	View,
	TouchableOpacity,
	Modal as RNModal,
	SafeAreaView,
	Alert,
} from "react-native";
import { Layout, Text, Card, Button, Icon, Input, Spinner } from "@ui-kitten/components";
import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { MoodType } from "shared";
import { useMoodStore } from "@/store/moodStore";

const MoodEmoji = ({ type, onPress }: { type: MoodType; onPress: () => void }) => {
	const emojis = {
		[MoodType.HAPPY]: "😊",
		[MoodType.NEUTRAL]: "😐",
		[MoodType.SAD]: "😢",
	};

	// Use a direct onPress handler without any wrapper function
	const handlePress = () => {
		console.log("Direct MoodEmoji press for type:", type);
		if (onPress) onPress();
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.6}
			style={styles.moodTouchable}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
		>
			<Card style={styles.moodCard}>
				<Text style={styles.emoji}>{emojis[type]}</Text>
				<Text category="s1" style={styles.moodLabel}>
					{type === MoodType.HAPPY
						? "Happy"
						: type === MoodType.NEUTRAL
							? "Neutral"
							: "Sad"}
				</Text>
			</Card>
		</TouchableOpacity>
	);
};

export default function HomeScreen() {
	const [moodModalVisible, setMoodModalVisible] = useState(false);
	const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
	const [note, setNote] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const addMoodEntry = useMoodStore((state) => state.addMoodEntry);
	const fetchMoodForDate = useMoodStore((state) => state.fetchMoodForDate);
	const getMoodForDate = useMoodStore((state) => state.getMoodForDate);
	const todaysMood = getMoodForDate(new Date());

	// Add debug logs
	console.log("HomeScreen render - todaysMood:", todaysMood);
	console.log("HomeScreen render - isLoading:", isLoading);

	// Fetch today's mood on component mount
	useEffect(() => {
		const loadTodaysMood = async () => {
			setIsLoading(true);
			try {
				// Increased delay to ensure auth is set up
				await new Promise((resolve) => setTimeout(resolve, 1000));

				console.log("Fetching today's mood from HomeScreen...");
				const result = await fetchMoodForDate(new Date());
				console.log("Fetch result:", result);

				if (result === null || result === undefined) {
					console.log("No mood found for today, showing selection UI");
				} else {
					console.log("Successfully fetched mood:", result);
				}
			} catch (error) {
				console.error("Error fetching today's mood:", error);
				// Don't show an error to the user, just let them add their mood
			} finally {
				setIsLoading(false);
			}
		};

		loadTodaysMood();
	}, []);

	const handleSelectMood = (mood: MoodType) => {
		console.log("handleSelectMood called with mood:", mood);

		// Set both states at once
		setSelectedMood(mood);
		setMoodModalVisible(true);

		// Add a direct check to verify the modal should be visible
		console.log("Modal should now be visible");

		// Force a re-render if needed
		setTimeout(() => {
			console.log("After timeout - selectedMood:", selectedMood);
			console.log("After timeout - moodModalVisible:", moodModalVisible);
		}, 100);
	};

	const handleSaveMood = async () => {
		console.log("Save button pressed - handleSaveMood function");
		console.log("selectedMood is:", selectedMood);
		try {
			if (selectedMood === null) {
				console.log("No mood selected, using Happy as default");
				// Use happy as default if somehow no mood is selected
				await addMoodEntry(new Date(), MoodType.HAPPY, note);
			} else {
				console.log("Selected mood:", selectedMood, "note:", note);
				await addMoodEntry(new Date(), selectedMood, note);
			}
			console.log("Successfully saved mood!");
			setMoodModalVisible(false);
			setNote("");

			// Refresh the mood data
			await fetchMoodForDate(new Date());
		} catch (error) {
			console.error("Error saving mood:", error);
			Alert.alert("Error", "Could not save your mood. Please try again.");
		}
	};

	const today = format(new Date(), "EEEE, MMMM d");

	return (
		<Layout style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<Text category="h1">Today</Text>
					<Text category="s1">{today}</Text>
				</View>

				{isLoading ? (
					<View style={styles.loadingContainer}>
						<Spinner size="large" />
						<Text category="s1" style={{ marginTop: 16 }}>
							Loading your mood data...
						</Text>
					</View>
				) : todaysMood ? (
					<View style={styles.todayMoodContainer}>
						<Text category="h5" style={styles.todayMoodTitle}>
							Your mood today
						</Text>
						<Card style={styles.todayMoodCard}>
							<Text style={styles.todayEmoji}>
								{todaysMood.mood === MoodType.HAPPY
									? "😊"
									: todaysMood.mood === MoodType.NEUTRAL
										? "😐"
										: "😢"}
							</Text>
							<Text category="s1" style={styles.todayMoodType}>
								{todaysMood.mood === MoodType.HAPPY
									? "Happy"
									: todaysMood.mood === MoodType.NEUTRAL
										? "Neutral"
										: "Sad"}
							</Text>
							<Text category="p1" style={styles.todayMoodNote}>
								{todaysMood.note || "No note added"}
							</Text>
						</Card>
					</View>
				) : (
					<View style={styles.moodPromptContainer}>
						<Text category="h5" style={styles.promptTitle}>
							How are you feeling today?
						</Text>
						<Text category="p2" style={{ marginBottom: 20, textAlign: "center" }}>
							Tap on an emoji below to record your mood
						</Text>
						<View style={styles.moodRow}>
							<Button
								style={styles.moodButton}
								onPress={() => {
									console.log("Happy button clicked");
									setSelectedMood(MoodType.HAPPY);
									setMoodModalVisible(true);
								}}
							>
								😊 Happy
							</Button>

							<Button
								style={styles.moodButton}
								onPress={() => {
									console.log("Neutral button clicked");
									setSelectedMood(MoodType.NEUTRAL);
									setMoodModalVisible(true);
								}}
							>
								😐 Neutral
							</Button>

							<Button
								style={styles.moodButton}
								onPress={() => {
									console.log("Sad button clicked");
									setSelectedMood(MoodType.SAD);
									setMoodModalVisible(true);
								}}
							>
								😢 Sad
							</Button>
						</View>

						{/* Test button to directly trigger modal */}
						<Button
							style={{ marginTop: 20 }}
							onPress={() => {
								console.log("Test button pressed");
								setSelectedMood(MoodType.HAPPY);
								setMoodModalVisible(true);
							}}
						>
							Test Modal
						</Button>
					</View>
				)}

				<RNModal
					visible={moodModalVisible}
					animationType="slide"
					transparent={true}
					onRequestClose={() => {
						console.log("Modal close requested");
						setMoodModalVisible(false);
					}}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<View style={styles.modalHandle} />
							<Text category="h4" style={styles.modalTitle}>
								Tell us more
							</Text>
							<Text category="p1" style={{ marginBottom: 20 }}>
								Selected mood:{" "}
								{selectedMood === MoodType.HAPPY
									? "Happy"
									: selectedMood === MoodType.NEUTRAL
										? "Neutral"
										: "Sad"}
							</Text>
							<Input
								multiline
								textStyle={{ minHeight: 120 }}
								placeholder="What happened today? (optional)"
								value={note}
								onChangeText={(text) => {
									console.log("Note changed:", text);
									setNote(text);
								}}
								style={styles.noteInput}
							/>
							<Button
								onPress={() => {
									console.log("Save button pressed inside modal");
									handleSaveMood();
								}}
								style={styles.saveButton}
							>
								Save
							</Button>
							<Button
								appearance="ghost"
								status="basic"
								onPress={() => {
									console.log("Cancel button pressed");
									setMoodModalVisible(false);
								}}
							>
								Cancel
							</Button>
						</View>
					</View>
				</RNModal>
			</SafeAreaView>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		padding: 20,
		paddingTop: 48,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	moodPromptContainer: {
		padding: 20,
		alignItems: "center",
	},
	promptTitle: {
		marginBottom: 30,
		textAlign: "center",
	},
	moodRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		maxWidth: 350,
	},
	moodTouchable: {
		width: 100,
		height: 120,
	},
	moodCard: {
		width: 100,
		height: 120,
		alignItems: "center",
		justifyContent: "center",
	},
	emoji: {
		fontSize: 48,
		marginBottom: 10,
	},
	moodLabel: {
		textAlign: "center",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.4)",
		zIndex: 1000,
	},
	modalContent: {
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		paddingTop: 15,
		alignItems: "center",
		zIndex: 1001,
	},
	modalHandle: {
		width: 40,
		height: 5,
		backgroundColor: "#E1E1E1",
		borderRadius: 3,
		marginBottom: 20,
	},
	modalTitle: {
		marginBottom: 20,
	},
	noteInput: {
		width: "100%",
		marginBottom: 20,
	},
	saveButton: {
		width: "100%",
		marginBottom: 10,
	},
	todayMoodContainer: {
		padding: 20,
	},
	todayMoodTitle: {
		marginBottom: 15,
	},
	todayMoodCard: {
		padding: 15,
	},
	todayEmoji: {
		fontSize: 48,
		marginBottom: 10,
		alignSelf: "center",
	},
	todayMoodType: {
		textAlign: "center",
		marginBottom: 15,
		fontWeight: "bold",
	},
	todayMoodNote: {
		fontStyle: "italic",
	},
	moodButton: {
		width: 100,
		height: 120,
		margin: 5,
	},
	moodButtonContent: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
