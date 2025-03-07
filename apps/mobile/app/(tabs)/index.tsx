import {
	StyleSheet,
	View,
	TouchableOpacity,
	Modal as RNModal,
	SafeAreaView,
	Alert,
	StatusBar,
	Animated,
	Platform,
} from "react-native";
import { Layout, Text, Button, Input, Spinner, Icon, CheckBox } from "@ui-kitten/components";
import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { MoodType } from "shared";
import { useMoodStore } from "@/store/moodStore";
import useHealthStore from "@/store/healthStore";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { HealthPermissionRequest } from '@/components/HealthPermissionRequest';
import { HealthDataDisplay } from '../health-component';

// Mood emoji mapping helper
const MOOD_EMOJIS = {
	[MoodType.HAPPY]: "😊",
	[MoodType.NEUTRAL]: "😐",
	[MoodType.SAD]: "😢",
};

// Mood gradient colors helper
const MOOD_COLORS = {
	[MoodType.HAPPY]: {
		gradient: ['#84B59F', '#6B9681'],  // Success/tertiary colors
		text: '#ffffff',
	},
	[MoodType.NEUTRAL]: {
		gradient: ['#5B9AA9', '#4A7F8C'],  // Primary color
		text: '#ffffff',
	},
	[MoodType.SAD]: {
		gradient: ['#7B98A6', '#6C8490'],  // Neutral, more subdued
		text: '#ffffff',
	},
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

// Mood selection component
const MoodEmoji = ({ type, onPress }: { type: MoodType; onPress: () => void }) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme];

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={0.8}
			style={styles.moodTouchable}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
		>
			<Animated.View style={[styles.moodCardContainer, { shadowColor: colors.text }]}>
				<LinearGradient
					colors={MOOD_COLORS[type].gradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.moodCard}
				>
					<Text style={styles.emoji}>{MOOD_EMOJIS[type]}</Text>
					<Text category="s1" style={[styles.moodLabel, { color: MOOD_COLORS[type].text }]}>
						{getMoodName(type)}
					</Text>
				</LinearGradient>
			</Animated.View>
		</TouchableOpacity>
	);
};

export default function HomeScreen() {
	const [moodModalVisible, setMoodModalVisible] = useState(false);
	const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
	const [note, setNote] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [includeHealthData, setIncludeHealthData] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.95)).current;
	
	// State to track today's mood from the API
	const [todayMoodEntry, setTodayMoodEntry] = useState<any>(null);
	
	const scheme = useColorScheme();
	const colors = Colors[scheme];
	const { showHealthPrompt, setShowHealthPrompt } = useAuth();
	
	// Health data integration
	const hasHealthPermissions = useHealthStore(state => state.hasHealthPermissions);
	const isHealthKitInitialized = useHealthStore(state => state.isHealthKitInitialized);

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
			})
		]).start();
	}, [fadeAnim, scaleAnim]);
	
	// Fetch mood data function - used by both initial load and focus effect
	const fetchMoodData = async () => {
		setIsLoading(true);
		try {
			const result = await fetchMoodForDate(new Date());
			setTodayMoodEntry(result);
		} catch (error) {
			console.error("Error fetching mood data:", error);
		} finally {
			setIsLoading(false);
		}
	};
	
	// Refresh data when the screen comes into focus
	useFocusEffect(
		React.useCallback(() => {
			fetchMoodData();
		}, [fetchMoodForDate])
	);
	
	// Initial data fetch on component mount
	useEffect(() => {
		// Slight delay to ensure auth is set up
		setTimeout(fetchMoodData, 500);
	}, []);

	// Close health permission prompt
	const handleCloseHealthPrompt = () => {
		setShowHealthPrompt(false);
	};
	
	const handleSaveMood = async () => {
		try {
			const moodToSave = selectedMood || MoodType.HAPPY;
			await addMoodEntry(new Date(), moodToSave, note, includeHealthData);
			
			setMoodModalVisible(false);
			setNote("");
			setIncludeHealthData(false);

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
		return !!todayMoodEntry && !!todayMoodEntry.mood;
	};
	
	const today = format(new Date(), "EEEE, MMMM d");

	return (
		<Layout style={[styles.container, { backgroundColor: colors.background }]}>
			<StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
			{showHealthPrompt && Platform.OS === 'ios' && (
				<View style={styles.permissionContainer}>
					<HealthPermissionRequest onComplete={handleCloseHealthPrompt} />
				</View>
			)}
			<Animated.View 
				style={[
					styles.animatedContainer, 
					{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
				]}
			>
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.header}>
						<Text 
							category="h1" 
							style={[styles.headerTitle, { color: colors.text }]}
						>
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
					) : hasValidMoodToday() ? (
						<Animated.View 
							style={[
								styles.todayMoodContainer, 
								{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
							]}
						>
							<Text 
								category="h5" 
								style={[styles.todayMoodTitle, { color: colors.text }]}
							>
								Your mood today
							</Text>
							<View style={[styles.todayMoodCardContainer, { shadowColor: colors.text }]}>
								<LinearGradient
									colors={MOOD_COLORS[todayMoodEntry.mood].gradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.todayMoodCard}
								>
									<Text style={styles.todayEmoji}>
										{MOOD_EMOJIS[todayMoodEntry.mood]}
									</Text>
									<Text 
										category="s1" 
										style={styles.todayMoodType}
									>
										{getMoodName(todayMoodEntry.mood)}
									</Text>
									<View style={styles.noteDivider} />
									<Text 
										category="p1" 
										style={styles.todayMoodNote}
									>
										{todayMoodEntry.note || "No note added"}
									</Text>
									
									{todayMoodEntry.healthData && <HealthDataDisplay healthData={todayMoodEntry.healthData} />}
								</LinearGradient>
							</View>
						</Animated.View>
					) : (
						<Animated.View 
							style={[
								styles.moodPromptContainer, 
								{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
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

					<RNModal
						visible={moodModalVisible}
						animationType="slide"
						transparent={true}
						onRequestClose={() => setMoodModalVisible(false)}
					>
						<BlurView 
							intensity={30} 
							tint={scheme === 'dark' ? 'dark' : 'light'}
							style={styles.modalOverlay}
						>
							<View style={[styles.modalContent, {
								backgroundColor: colors.surface,
								shadowColor: colors.text,
							}]}>
								<View style={[styles.modalHandle, { backgroundColor: colors.subtle }]} />
								<Text 
									category="h4" 
									style={[styles.modalTitle, { color: colors.text }]}
								>
									Tell us more
								</Text>
								
								<View style={styles.selectedMoodContainer}>
									<Text style={styles.selectedMoodEmoji}>
										{selectedMood ? MOOD_EMOJIS[selectedMood] : ""}
									</Text>
									<Text 
										category="s1" 
										style={[styles.selectedMoodText, { color: colors.textSecondary }]}
									>
										You're feeling {" "}
										<Text style={{ fontWeight: '600', color: colors.text }}>
											{selectedMood ? getMoodName(selectedMood) : ""}
										</Text>
									</Text>
								</View>
								
								<Input
									multiline
									textStyle={{ minHeight: 120, color: colors.text }}
									placeholder="What happened today? (optional)"
									placeholderTextColor={colors.textSecondary}
									value={note}
									onChangeText={setNote}
									style={styles.noteInput}
								/>
								
								{Platform.OS === 'ios' && hasHealthPermissions && (
									<CheckBox
										style={styles.healthCheckbox}
										checked={includeHealthData}
										onChange={nextChecked => setIncludeHealthData(nextChecked)}
									>
										{evaProps => (
											<Text {...evaProps} style={[evaProps.style, { color: colors.textSecondary }]}>
												Include health data (steps, distance, calories)
											</Text>
										)}
									</CheckBox>
								)}
								
								<Button
									onPress={handleSaveMood}
									style={styles.saveButton}
									status="primary"
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
							</View>
						</BlurView>
					</RNModal>
				</SafeAreaView>
			</Animated.View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	permissionContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 999,
		padding: 24,
		paddingTop: 100,
		backgroundColor: 'rgba(0,0,0,0.6)',
	},
	animatedContainer: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	healthCheckbox: {
		alignSelf: 'flex-start',
		marginBottom: 20,
	},
	header: {
		padding: 24,
		paddingTop: 60,
	},
	headerTitle: {
		fontSize: 34,
		marginBottom: 8,
		fontWeight: '700',
	},
	headerDate: {
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
	moodPromptContainer: {
		padding: 24,
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		marginTop: -40, // Offset to center vertically
	},
	promptTitle: {
		marginBottom: 16,
		textAlign: "center",
		fontSize: 28,
		fontWeight: '600',
	},
	promptSubtitle: {
		marginBottom: 40,
		textAlign: "center",
		fontSize: 16,
		opacity: 0.8,
		maxWidth: 280,
	},
	moodRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		maxWidth: 350,
		marginHorizontal: 'auto',
	},
	moodTouchable: {
		width: 100,
		height: 140,
		margin: 8,
	},
	moodCardContainer: {
		width: 100,
		height: 140,
		borderRadius: 20,
		overflow: 'hidden',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 5,
	},
	moodCard: {
		width: '100%',
		height: '100%',
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		borderRadius: 20,
	},
	emoji: {
		fontSize: 52,
		marginBottom: 16,
	},
	moodLabel: {
		textAlign: "center",
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
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
		fontWeight: '600',
		textAlign: 'center',
	},
	selectedMoodContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 24,
		width: '100%',
		padding: 16,
		borderRadius: 16,
		backgroundColor: 'rgba(0, 0, 0, 0.03)',
	},
	selectedMoodEmoji: {
		fontSize: 32,
		marginRight: 16,
	},
	selectedMoodText: {
		fontSize: 16,
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
		fontWeight: '600',
	},
	todayMoodCardContainer: {
		borderRadius: 24,
		overflow: 'hidden',
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
		color: '#FFFFFF',
	},
	todayMoodType: {
		textAlign: "center",
		marginBottom: 24,
		fontWeight: "700",
		fontSize: 22,
		color: '#FFFFFF',
	},
	noteDivider: {
		height: 1,
		width: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		marginBottom: 16,
	},
	todayMoodNote: {
		fontStyle: "italic",
		color: 'rgba(255, 255, 255, 0.9)',
		lineHeight: 20,
	},
	healthDataContainer: {
		marginTop: 16,
	},
	healthDataDivider: {
		height: 1,
		width: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		marginBottom: 12,
	},
	healthDataTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		marginBottom: 10,
	},
	healthDataRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	healthIcon: {
		width: 18,
		height: 18,
		marginRight: 8,
		tintColor: 'rgba(255, 255, 255, 0.9)',
	},
	healthDataText: {
		color: 'rgba(255, 255, 255, 0.9)',
	},
});