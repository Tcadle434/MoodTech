import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Dimensions, Animated } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { format } from "date-fns";
import Slider from "@react-native-community/slider";
import { useMoodStore } from "@/store/moodStore";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import { MoodType } from "shared";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface MoodConfig {
	emoji: string;
	color: string;
	gradient: [string, string];
	mood: MoodType;
}

const MOOD_CONFIG: Record<number, MoodConfig> = {
	1: { emoji: "😢", color: "#FF6B6B", gradient: ["#FF6B6B", "#FF8585"], mood: MoodType.SAD },
	2: { emoji: "😞", color: "#FFA07A", gradient: ["#FFA07A", "#FFB894"], mood: MoodType.SAD },
	3: { emoji: "😐", color: "#A3BFFA", gradient: ["#A3BFFA", "#BDD4FF"], mood: MoodType.NEUTRAL },
	4: { emoji: "🙂", color: "#90EE90", gradient: ["#90EE90", "#AAF5AA"], mood: MoodType.HAPPY },
	5: { emoji: "😊", color: "#FFD700", gradient: ["#FFD700", "#FFE44D"], mood: MoodType.HAPPY },
} as const;

export default function TestScreen() {
	const [moodValue, setMoodValue] = useState<number>(3);
	const [showConfetti, setShowConfetti] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const addMoodEntry = useMoodStore((state) => state.addMoodEntry);

	const handleValueChange = (value: number) => {
		const roundedValue = Math.round(Math.min(Math.max(value, 1), 5));
		setMoodValue(roundedValue);
		// Animate emoji
		Animated.sequence([
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.spring(scaleAnim, {
					toValue: 1.2,
					useNativeDriver: true,
				}),
			]),
			Animated.spring(scaleAnim, {
				toValue: 1,
				useNativeDriver: true,
			}),
		]).start();
	};

	const handleSlideComplete = async () => {
		setShowConfetti(true);
		try {
			const currentMood = MOOD_CONFIG[moodValue];
			if (currentMood) {
				await addMoodEntry(new Date(), currentMood.mood, "");
			}
		} catch (error) {
			console.error("Error saving mood:", error);
		}
	};

	const currentMood = MOOD_CONFIG[moodValue] ?? MOOD_CONFIG[3]; // Fallback to neutral if invalid

	return (
		<Layout style={styles.container}>
			<LinearGradient
				colors={currentMood.gradient}
				style={StyleSheet.absoluteFill}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.content}>
						<View style={styles.header}>
							<Text category="h1" style={styles.title}>
								Today
							</Text>
							<Text category="s1" style={styles.subtitle}>
								{format(new Date(), "EEEE, MMMM d")}
							</Text>
						</View>

						<Text category="h2" style={styles.heading}>
							How are you feeling today?
						</Text>
						<Text category="s1" style={styles.subheading}>
							Slide to set your mood
						</Text>

						<View style={styles.sliderContainer}>
							<Animated.Text
								style={[
									styles.emojiText,
									{
										opacity: fadeAnim,
										transform: [{ scale: scaleAnim }],
									},
								]}
							>
								{currentMood.emoji}
							</Animated.Text>

							<Slider
								style={styles.slider}
								minimumValue={1}
								maximumValue={5}
								value={moodValue}
								step={1}
								onValueChange={handleValueChange}
								onSlidingComplete={handleSlideComplete}
							/>

							<Text category="h6" style={styles.valueText}>
								{moodValue}/5
							</Text>
						</View>

						<View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
							<Text category="s1" style={[styles.tipText, { color: colors.text }]}>
								{moodValue < 3
									? "Remember, it's okay to have down days. Take care of yourself! 💝"
									: "Keep up the great energy! You're doing amazing! ✨"}
							</Text>
						</View>

						{showConfetti && (
							<ConfettiCannon
								count={100}
								origin={{ x: SCREEN_WIDTH / 2, y: -10 }}
								autoStart={true}
								fadeOut={true}
								onAnimationEnd={() => setShowConfetti(false)}
							/>
						)}
					</View>
				</SafeAreaView>
			</LinearGradient>
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
	content: {
		flex: 1,
		padding: 24,
	},
	header: {
		alignItems: "center",
		marginBottom: 48,
	},
	title: {
		fontSize: 34,
		fontWeight: "700",
		color: "#FFFFFF",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 18,
		color: "rgba(255, 255, 255, 0.8)",
	},
	heading: {
		fontSize: 28,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "center",
		marginBottom: 12,
	},
	subheading: {
		fontSize: 18,
		color: "rgba(255, 255, 255, 0.8)",
		textAlign: "center",
		marginBottom: 48,
	},
	sliderContainer: {
		width: "100%",
		alignItems: "center",
		marginBottom: 48,
	},
	slider: {
		width: "100%",
		height: 40,
	},
	emojiText: {
		fontSize: 72,
		marginBottom: 24,
	},
	valueText: {
		fontSize: 24,
		color: "#FFFFFF",
		marginTop: 16,
	},
	tipCard: {
		padding: 20,
		borderRadius: 16,
		marginTop: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
	},
	tipText: {
		fontSize: 16,
		textAlign: "center",
		lineHeight: 24,
	},
});
