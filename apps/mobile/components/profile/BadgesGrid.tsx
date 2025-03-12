import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface BadgesGridProps {
	hasFirstMood: boolean;
	has7DayStreak: boolean;
	has30DayStreak: boolean;
	hasHappyMonth: boolean;
}

export const BadgesGrid = ({
	hasFirstMood,
	has7DayStreak,
	has30DayStreak,
	hasHappyMonth,
}: BadgesGridProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<View style={styles.badgesSection}>
			<Text category="h6" style={[styles.sectionTitle, { color: colors.text }]}>
				Badges
			</Text>
			<View style={styles.badgesRow}>
				{/* First mood badge */}
				<View style={[styles.badge, !hasFirstMood && styles.lockedBadge]}>
					<View
						style={[
							styles.badgeIcon,
							{
								backgroundColor: hasFirstMood ? colors.tertiary : colors.subtle,
							},
						]}
					>
						<Icon
							name={hasFirstMood ? "checkmark-outline" : "lock-outline"}
							style={styles.badgeIconInner}
						/>
					</View>
					<Text
						category="c1"
						style={[
							styles.badgeText,
							{
								color: hasFirstMood ? colors.text : colors.textSecondary,
							},
						]}
					>
						First mood
					</Text>
				</View>

				{/* 7-day streak badge */}
				<View style={[styles.badge, !has7DayStreak && styles.lockedBadge]}>
					<View
						style={[
							styles.badgeIcon,
							{
								backgroundColor: has7DayStreak ? colors.tint : colors.subtle,
							},
						]}
					>
						<Icon
							name={has7DayStreak ? "calendar-outline" : "lock-outline"}
							style={styles.badgeIconInner}
						/>
					</View>
					<Text
						category="c1"
						style={[
							styles.badgeText,
							{
								color: has7DayStreak ? colors.text : colors.textSecondary,
							},
						]}
					>
						7 day streak
					</Text>
				</View>

				{/* 30-day streak badge */}
				<View style={[styles.badge, !has30DayStreak && styles.lockedBadge]}>
					<View
						style={[
							styles.badgeIcon,
							{
								backgroundColor: has30DayStreak ? colors.secondary : colors.subtle,
							},
						]}
					>
						<Icon
							name={has30DayStreak ? "award-outline" : "lock-outline"}
							style={styles.badgeIconInner}
						/>
					</View>
					<Text
						category="c1"
						style={[
							styles.badgeText,
							{
								color: has30DayStreak ? colors.text : colors.textSecondary,
							},
						]}
					>
						30 day streak
					</Text>
				</View>

				{/* Happy month badge */}
				<View style={[styles.badge, !hasHappyMonth && styles.lockedBadge]}>
					<View
						style={[
							styles.badgeIcon,
							{
								backgroundColor: hasHappyMonth ? colors.secondary : colors.subtle,
							},
						]}
					>
						<Icon
							name={hasHappyMonth ? "sun-outline" : "lock-outline"}
							style={styles.badgeIconInner}
						/>
					</View>
					<Text
						category="c1"
						style={[
							styles.badgeText,
							{
								color: hasHappyMonth ? colors.text : colors.textSecondary,
							},
						]}
					>
						Happy month
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	badgesSection: {
		padding: 24,
		paddingTop: 10,
	},
	sectionTitle: {
		marginBottom: 20,
		fontSize: 20,
		fontWeight: "600",
	},
	badgesRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginHorizontal: -5,
	},
	badge: {
		width: "25%",
		alignItems: "center",
		padding: 8,
	},
	lockedBadge: {
		opacity: 0.5,
	},
	badgeIcon: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
	},
	badgeIconInner: {
		width: 24,
		height: 24,
		tintColor: "white",
	},
	badgeText: {
		textAlign: "center",
		fontSize: 12,
	},
});
