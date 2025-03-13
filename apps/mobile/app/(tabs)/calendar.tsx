import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Animated, View, SafeAreaView, ScrollView, Alert } from "react-native";
import { Layout, Text, Spinner } from "@ui-kitten/components";
import { startOfMonth, endOfMonth } from "date-fns";
import { MoodType } from "shared";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Calendar } from "@/components/calendar";
import { useMoodsByDateRange } from "@/hooks/useMoodsByDateRange";
import { useSaveMood } from "@/hooks/useSaveMood";
import { useQueryClient } from "@tanstack/react-query";

export default function CalendarScreen() {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const fadeAnim = React.useRef(new Animated.Value(0)).current;
	const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const queryClient = useQueryClient();

	const dateRange = useMemo(() => {
		return {
			start: startOfMonth(currentMonth),
			end: endOfMonth(currentMonth),
		};
	}, [currentMonth]);

	const { data: moods, isLoading: isMoodsLoading } = useMoodsByDateRange(
		dateRange.start.toISOString(),
		dateRange.end.toISOString()
	);

	const { mutate: saveMood, isPending: isSaving } = useSaveMood();

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
			}),
		]).start();
	}, [fadeAnim, scaleAnim]);

	const handleSaveMood = async (dateString: string, mood: MoodType, note: string) => {
		saveMood(
			{
				dateString: dateString,
				mood: mood || MoodType.HAPPY,
				note,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["mood"] });
					queryClient.invalidateQueries({ queryKey: ["moods"] });
				},
				onError: (error) => {
					console.error("Error saving mood:", error);
					Alert.alert("Error", "Could not save your mood. Please try again.");
				},
			}
		);
	};

	return (
		<Layout style={[styles.container, { backgroundColor: colors.background }]}>
			<Animated.View
				style={[
					styles.animatedContainer,
					{
						opacity: fadeAnim,
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.header}>
						<Text category="h1" style={[styles.headerTitle, { color: colors.text }]}>
							History
						</Text>
						<Text
							category="s1"
							style={[styles.headerSubtitle, { color: colors.textSecondary }]}
						>
							Your mood journey
						</Text>
					</View>

					{isMoodsLoading ? (
						<View style={styles.loadingContainer}>
							<Spinner size="large" status="primary" />
							<Text
								category="s1"
								style={[styles.loadingText, { color: colors.textSecondary }]}
							>
								Loading your calendar data...
							</Text>
						</View>
					) : (
						<ScrollView
							style={styles.calendarContainer}
							showsVerticalScrollIndicator={false}
						>
							<View
								style={[
									styles.calendarWrapper,
									{
										backgroundColor: colors.surface,
										shadowColor: colors.text,
									},
								]}
							>
								{moods && (
									<Calendar
										moods={moods}
										onSaveMood={handleSaveMood}
										key={JSON.stringify(moods)}
									/>
								)}
							</View>
						</ScrollView>
					)}
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
		paddingTop: 60,
	},
	headerTitle: {
		fontSize: 34,
		marginBottom: 8,
		fontWeight: "700",
	},
	headerSubtitle: {
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
	calendarContainer: {
		flex: 1,
		padding: 24,
		paddingTop: 10,
	},
	calendarWrapper: {
		borderRadius: 24,
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.12,
		shadowRadius: 12,
		elevation: 6,
		marginBottom: 20,
		overflow: "hidden",
	},
});
