import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MOOD_METADATA } from "@/constants/MoodConstants";
import { MoodType } from "shared";

interface StatsGridProps {
	totalDays: number;
	happyDays: number;
	happyPercentage: number;
}

export const StatsGrid = ({ totalDays, happyDays, happyPercentage }: StatsGridProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<View style={styles.statsSection}>
			<Text category="h6" style={[styles.sectionTitle, { color: colors.text }]}>
				Your Stats
			</Text>
			<View style={styles.statsRow}>
				<View style={[styles.statCardContainer, { shadowColor: colors.text }]}>
					<LinearGradient
						colors={MOOD_METADATA[MoodType.NEUTRAL].gradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.statCard}
					>
						<Text category="h3" style={styles.statNumber}>
							{totalDays}
						</Text>
						<Text category="c1" style={styles.statLabel}>
							Days tracked
						</Text>
					</LinearGradient>
				</View>

				<View style={[styles.statCardContainer, { shadowColor: colors.text }]}>
					<LinearGradient
						colors={MOOD_METADATA[MoodType.HAPPY].gradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.statCard}
					>
						<Text category="h3" style={styles.statNumber}>
							{happyDays}
						</Text>
						<Text category="c1" style={styles.statLabel}>
							Happy days
						</Text>
					</LinearGradient>
				</View>

				<View style={[styles.statCardContainer, { shadowColor: colors.text }]}>
					<LinearGradient
						colors={[colors.secondary, colors.secondaryGradient]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.statCard}
					>
						<Text category="h3" style={styles.statNumber}>
							{happyPercentage}%
						</Text>
						<Text category="c1" style={styles.statLabel}>
							Happy days
						</Text>
					</LinearGradient>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	statsSection: {
		padding: 24,
	},
	sectionTitle: {
		marginBottom: 20,
		fontSize: 20,
		fontWeight: "600",
	},
	statsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	statCardContainer: {
		flex: 1,
		margin: 6,
		borderRadius: 20,
		overflow: "hidden",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 4,
	},
	statCard: {
		alignItems: "center",
		padding: 16,
		borderRadius: 20,
	},
	statNumber: {
		marginBottom: 5,
		fontSize: 30,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	statLabel: {
		fontSize: 14,
		color: "rgba(255, 255, 255, 0.9)",
		fontWeight: "500",
	},
});
