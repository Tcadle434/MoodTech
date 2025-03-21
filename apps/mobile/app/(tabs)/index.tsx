import React, { useState, useRef, useEffect, useMemo } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	Alert,
	StatusBar,
	Animated,
	PanResponder,
} from "react-native";
import { Layout, Text, Spinner } from "@ui-kitten/components";
import { format, parseISO } from "date-fns";
import { MoodType, SubMoodType } from "shared";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useMoodForDate } from "@/hooks/useMoodForDate";
import { useSaveMood } from "@/hooks/useSaveMood";
import { useQueryClient } from "@tanstack/react-query";
import { MoodEmoji } from "@/components/MoodEmoji";
import { MoodModal } from "@/components/calendar";
import { useGetProfile } from "@/hooks/useGetProfile";
import { MoodCard } from "@/components/MoodCard";
import { MOOD_FEEDBACK } from "@/constants/MoodConstants";

export default function HomeScreen() {
	const today = new Date();
	const todayString = useMemo(() => format(today, "yyyy-MM-dd"), []);
	const formattedToday = format(parseISO(todayString), "EEEE, MMMM d");

	const queryClient = useQueryClient();
	const { data: moodForDate, isLoading: isMoodLoading } = useMoodForDate(todayString);
	const { mutate: saveMood, isPending: isSaving } = useSaveMood();
	const { data: profile, isLoading: isProfileLoading } = useGetProfile();

	const [moodModalVisible, setMoodModalVisible] = useState(false);
	const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
	const [selectedSubMood, setSelectedSubMood] = useState<SubMoodType | null>(null);
	const [note, setNote] = useState("");

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.95)).current;
	const wheelRotateAnim = useRef(new Animated.Value(0)).current;
	const spinWheelAnim = useRef(new Animated.Value(0)).current;

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
			Animated.sequence([
				Animated.delay(400),
				Animated.spring(wheelRotateAnim, {
					toValue: 1,
					friction: 8,
					tension: 50,
					useNativeDriver: true,
				}),
			]),
		]).start();
	}, [fadeAnim, scaleAnim, wheelRotateAnim]);

	const wheelRotate = wheelRotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	const spinRotate = spinWheelAnim.interpolate({
		inputRange: [-150, 150],
		outputRange: ["-60deg", "60deg"],
	});

	useEffect(() => {
		const wiggleAnimation = Animated.sequence([
			Animated.timing(spinWheelAnim, {
				toValue: 15,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.timing(spinWheelAnim, {
				toValue: -15,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.timing(spinWheelAnim, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true,
			}),
		]);

		const wiggleTimeout = setTimeout(() => {
			wiggleAnimation.start();
		}, 2000);

		return () => clearTimeout(wiggleTimeout);
	}, []);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (evt, gestureState) => {
				spinWheelAnim.setValue(gestureState.dx);
			},
			onPanResponderRelease: (evt, gestureState) => {
				const velocity = gestureState.vx;
				const endValue = Math.abs(velocity) > 1 ? Math.sign(velocity) * 120 : 0;

				Animated.sequence([
					Animated.decay(spinWheelAnim, {
						velocity: velocity * 0.3,
						deceleration: 0.997,
						useNativeDriver: true,
					}),
					Animated.spring(spinWheelAnim, {
						toValue: 0,
						friction: 6,
						tension: 20,
						useNativeDriver: true,
					}),
				]).start();
			},
		})
	).current;

	const rotationStyle = `${spinRotate}deg`;

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
							{profile?.name ? (
								<>
									Hi{" "}
									<Text style={[styles.profileName, { color: colors.tertiary }]}>
										{profile.name}
									</Text>{" "}
									👋
								</>
							) : (
								"Hello!"
							)}{" "}
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
							<MoodCard
								mood={moodForDate.mood}
								subMood={moodForDate.subMood}
								note={moodForDate.note}
								date={today}
								shadowColor={colors.text}
								onEdit={() => {
									setSelectedMood(moodForDate.mood);
									setSelectedSubMood(moodForDate.subMood || null);
									setNote(moodForDate.note || "");
									setMoodModalVisible(true);
								}}
							/>
							<Text
								style={[styles.motivationalText, { color: colors.textSecondary }]}
							>
								{MOOD_FEEDBACK[moodForDate.mood]}
							</Text>
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
								How are you today?
							</Text>
							<Text
								category="p2"
								style={[styles.promptSubtitle, { color: colors.textSecondary }]}
							>
								Tap on an option below to record your mood
							</Text>

							{/* Wrapper to position both the wheel and fixed center properly */}
							<View style={styles.wheelWrapper} {...panResponder.panHandlers}>
								<Animated.View
									style={[
										styles.moodCircleContainer,
										{
											transform: [
												{ rotate: wheelRotate },
												{ rotate: rotationStyle },
											],
										},
									]}
								>
									{Object.values(MoodType)
										.filter((mood) => mood !== MoodType.HAPPY)
										.map((mood, index) => {
											// Calculate position for outer moods in a hexagon
											// Start at top (-90 degrees) and space 6 items evenly
											const startAngle = -Math.PI / 2;
											const angleOffset = (2 * Math.PI) / 6; // 60 degrees
											const angle = startAngle + index * angleOffset;
											const radius = 170; // Radius for speech bubbles

											return (
												<MoodEmoji
													key={mood}
													type={mood}
													style={{
														position: "absolute",
														zIndex: 5,
														transform: [
															{
																translateX:
																	Math.cos(angle) * radius,
															},
															{
																translateY:
																	Math.sin(angle) * radius,
															},
															{ scale: 0.8 },
														],
													}}
													onPress={() => {
														setSelectedMood(mood);
														setMoodModalVisible(true);
													}}
												/>
											);
										})}
								</Animated.View>

								{/* Fixed center mood positioned relative to wheelWrapper */}
								<View style={styles.fixedCenterContainer}>
									<MoodEmoji
										key={MoodType.HAPPY}
										type={MoodType.HAPPY}
										style={{
											transform: [{ scale: 0.9 }],
										}}
										onPress={() => {
											setSelectedMood(MoodType.HAPPY);
											setMoodModalVisible(true);
										}}
									/>
								</View>
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
		fontSize: 32,
		marginBottom: 4,
		fontWeight: "600",
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
		paddingTop: 24,
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
	moodCircleContainer: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	wheelWrapper: {
		position: "relative",
		width: 400,
		height: 400,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},
	fixedCenterContainer: {
		position: "absolute",
		top: "50%",
		left: "50%",
		width: 100,
		height: 100,
		marginTop: -50,
		marginLeft: -50,
		zIndex: 20,
		justifyContent: "center",
		alignItems: "center",
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
	motivationalText: {
		textAlign: "center",
		fontSize: 16,
		marginTop: 16,
		fontStyle: "italic",
		opacity: 0.8,
	},
	profileName: {
		fontSize: 32,
		fontWeight: "600",
		marginBottom: 12,
		textAlign: "center",
	},
});
