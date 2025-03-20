// components/MoodEmoji.tsx
import React, { useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Animated, View } from "react-native";
import { Text } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { MoodType } from "shared";
import { MOOD_METADATA } from "@/constants/MoodConstants";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

// Define playful phrases for each mood type
const MOOD_PHRASES: Record<MoodType, string> = {
	[MoodType.HAPPY]: "Yay!",
	[MoodType.SAD]: "Feeling blue...",
	[MoodType.ANGRY]: "Grrr!",
	[MoodType.FEARFUL]: "Eek!",
	[MoodType.DISGUSTED]: "Yuck!",
	[MoodType.SURPRISED]: "Wow!",
	[MoodType.BAD]: "Meh...",
};

interface MoodEmojiProps {
	type: MoodType;
	onPress: () => void;
	style?: any;
}

export const MoodEmoji = ({ type, onPress, style }: MoodEmojiProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const bubbleAnim = useRef(new Animated.Value(0)).current;
	const bounceAnim = useRef(new Animated.Value(0)).current;

	// Animation for the emoji bounce effect
	useEffect(() => {
		// Start animation after a small delay based on the mood type
		// This creates a staggered animation effect when multiple moods appear
		const delay = Math.random() * 1000;

		// Animated sequence for speech bubble fade in and emoji bounce
		setTimeout(() => {
			Animated.parallel([
				Animated.spring(bubbleAnim, {
					toValue: 1,
					friction: 6,
					tension: 40,
					useNativeDriver: true,
				}),
				Animated.loop(
					Animated.sequence([
						Animated.timing(bounceAnim, {
							toValue: 1,
							duration: 400,
							useNativeDriver: true,
						}),
						Animated.timing(bounceAnim, {
							toValue: 0,
							duration: 400,
							useNativeDriver: true,
						}),
						Animated.delay(2000), // Pause between bounces
					])
				),
			]).start();
		}, delay);
	}, []);

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

	// Interpolate bounce animation
	const bounceTransform = bounceAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -5], // Move up slightly
	});

	return (
		<TouchableOpacity
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			activeOpacity={1}
			style={[styles.moodTouchable, style]}
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
					colors={MOOD_METADATA[type].gradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.moodCard}
				>
					<Animated.Text
						style={[styles.emoji, { transform: [{ translateY: bounceTransform }] }]}
					>
						{MOOD_METADATA[type].emoji}
					</Animated.Text>

					{/* Speech bubble */}
					<Animated.View
						style={[
							styles.speechBubbleContainer,
							{
								opacity: bubbleAnim,
								transform: [{ scale: bubbleAnim }],
							},
						]}
					>
						<View
							style={[
								styles.speechBubble,
								{ backgroundColor: "rgba(255, 255, 255, 0.9)" },
							]}
						>
							<Text
								style={[
									styles.moodPhrase,
									{ color: MOOD_METADATA[type].gradient[1] },
								]}
							>
								{MOOD_PHRASES[type]}
							</Text>
						</View>
						<View
							style={[
								styles.speechBubbleArrow,
								{ borderTopColor: "rgba(255, 255, 255, 0.9)" },
							]}
						/>
					</Animated.View>

					<Text style={[styles.moodLabel, { color: MOOD_METADATA[type].text }]}>
						{MOOD_METADATA[type].name}
					</Text>
				</LinearGradient>
			</Animated.View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	moodTouchable: {
		width: 100,
		aspectRatio: 0.75,
		transform: [{ translateY: 0 }],
	},
	moodCardContainer: {
		width: "100%",
		height: "100%",
		borderRadius: 24,
		overflow: "hidden",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 5,
	},
	moodCard: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
		borderRadius: 24,
	},
	emoji: {
		fontSize: 44,
		marginBottom: 8,
	},
	moodLabel: {
		textAlign: "center",
		fontSize: 14,
		fontWeight: "600",
		color: "#FFFFFF",
		opacity: 0.9,
		marginTop: 4,
	},
	speechBubbleContainer: {
		position: "relative",
		alignItems: "center",
	},
	speechBubble: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
		marginBottom: 4,
	},
	speechBubbleArrow: {
		position: "absolute",
		bottom: -5,
		width: 0,
		height: 0,
		borderLeftWidth: 6,
		borderRightWidth: 6,
		borderTopWidth: 6,
		borderLeftColor: "transparent",
		borderRightColor: "transparent",
	},
	moodPhrase: {
		fontSize: 12,
		fontWeight: "bold",
	},
});
