// components/MoodEmoji.tsx
import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Text } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { MoodType } from "shared";
import { MOOD_METADATA } from "@/constants/MoodConstants";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface MoodEmojiProps {
	type: MoodType;
	onPress: () => void;
}

export const MoodEmoji = ({ type, onPress }: MoodEmojiProps) => {
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
					colors={MOOD_METADATA[type].gradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.moodCard}
				>
					<Text style={styles.emoji}>{MOOD_METADATA[type].emoji}</Text>
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
		padding: 16,
		borderRadius: 24,
	},
	emoji: {
		fontSize: 44,
		marginBottom: 12,
	},
	moodLabel: {
		textAlign: "center",
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		opacity: 0.9,
	},
});
