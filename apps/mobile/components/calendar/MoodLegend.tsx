import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { MoodType } from "shared";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MOOD_METADATA } from "@/constants/MoodConstants";

export const MoodLegend = () => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<View style={[styles.container, { backgroundColor: colors.surface }]}>
			<Text category="s1" style={[styles.title, { color: colors.text }]}>
				Mood Legend
			</Text>
			<View style={styles.legendGrid}>
				{Object.values(MoodType).map((mood) => (
					<View key={mood} style={styles.legendItem}>
						<LinearGradient
							colors={MOOD_METADATA[mood].gradient}
							style={styles.colorIndicator}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
						/>
						<Text style={[styles.legendText, { color: colors.text }]}>
							{MOOD_METADATA[mood].name}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 16,
		marginBottom: 16,
	},
	title: {
		marginBottom: 12,
		fontWeight: "600",
	},
	legendGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	legendItem: {
		width: "48%",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	colorIndicator: {
		width: 24,
		height: 24,
		borderRadius: 12,
		marginRight: 8,
	},
	legendText: {
		fontSize: 14,
	},
});
