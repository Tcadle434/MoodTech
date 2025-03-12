import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView, Animated, StatusBar } from "react-native";
import { Layout } from "@ui-kitten/components";
import { useAuth } from "@/contexts/AuthContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useMoodStore } from "@/store/moodStore";
import { MoodType } from "shared";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserInfo } from "@/components/profile/UserInfo";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { BadgesGrid } from "@/components/profile/BadgesGrid";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface MoodEntry {
	date: string;
	mood: MoodType;
}

interface MonthEntries {
	[key: string]: MoodEntry[];
}

export default function ProfileScreen() {
	const { logout, user } = useAuth();
	const router = useRouter();
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const [isLoading, setIsLoading] = useState(true);

	// Stat counts
	const [totalDays, setTotalDays] = useState(0);
	const [happyDays, setHappyDays] = useState(0);
	const [happyPercentage, setHappyPercentage] = useState(0);

	// Badge indicators
	const [hasFirstMood, setHasFirstMood] = useState(false);
	const [has7DayStreak, setHas7DayStreak] = useState(false);
	const [has30DayStreak, setHas30DayStreak] = useState(false);
	const [hasHappyMonth, setHasHappyMonth] = useState(false);

	// Animation refs
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.95)).current;

	// Get mood data from store
	const fetchAllEntries = useMoodStore((state) => state.fetchAllEntries);
	const entries = useMoodStore((state) => state.entries);

	// Check if there's a streak of consecutive days
	const checkForStreak = (entries: MoodEntry[], requiredDays: number): boolean => {
		if (entries.length < requiredDays) return false;

		// Sort entries by date
		const sortedEntries = [...entries].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		let currentStreak = 1;
		let maxStreak = 1;

		// Find the longest streak
		for (let i = 1; i < sortedEntries.length; i++) {
			const currentDate = parseISO(sortedEntries[i - 1].date);
			const prevDate = parseISO(sortedEntries[i].date);

			// Check if dates are consecutive
			const dayDiff =
				Math.abs(currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

			if (dayDiff === 1) {
				currentStreak++;
				maxStreak = Math.max(maxStreak, currentStreak);
			} else {
				currentStreak = 1;
			}
		}

		return maxStreak >= requiredDays;
	};

	// Check if there's a month where at least 80% of entries are happy
	const checkForHappyMonth = (entries: MoodEntry[]): boolean => {
		if (entries.length < 15) return false; // Need at least 15 entries to qualify

		// Group entries by month
		const entriesByMonth: MonthEntries = {};

		entries.forEach((entry) => {
			const date = parseISO(entry.date);
			const monthKey = format(date, "yyyy-MM");

			if (!entriesByMonth[monthKey]) {
				entriesByMonth[monthKey] = [];
			}

			entriesByMonth[monthKey].push(entry);
		});

		// Check each month
		for (const month in entriesByMonth) {
			const monthEntries = entriesByMonth[month];

			if (monthEntries.length >= 15) {
				const happyCount = monthEntries.filter(
					(entry) => entry.mood === MoodType.HAPPY
				).length;
				const happyPercentage = (happyCount / monthEntries.length) * 100;

				if (happyPercentage >= 80) {
					return true;
				}
			}
		}

		return false;
	};

	// Load mood data and calculate stats
	useEffect(() => {
		const loadMoodData = async () => {
			setIsLoading(true);
			try {
				await fetchAllEntries();
			} catch (error) {
				console.error("Error fetching mood data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadMoodData();
	}, []);

	// Calculate stats and badges whenever entries change
	useEffect(() => {
		if (entries.length > 0) {
			// Total days with mood entries
			setTotalDays(entries.length);

			// Count happy days
			const happyCount = entries.filter((entry) => entry.mood === MoodType.HAPPY).length;
			setHappyDays(happyCount);

			// Calculate happy percentage
			const percentage = Math.round((happyCount / entries.length) * 100);
			setHappyPercentage(percentage);

			// Check for first mood badge
			setHasFirstMood(entries.length > 0);

			// Check for 7-day streak
			const has7Day = checkForStreak(entries, 7);
			setHas7DayStreak(has7Day);

			// Check for 30-day streak
			const has30Day = checkForStreak(entries, 30);
			setHas30DayStreak(has30Day);

			// Check for happy month badge (if at least 80% of entries in a month are happy)
			const isHappyMonth = checkForHappyMonth(entries);
			setHasHappyMonth(isHappyMonth);
		}
	}, [entries]);

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

	const handleLogout = async () => {
		await logout();
	};

	const handleSettingsPress = () => {
		router.push("/settings");
	};

	// Gradient colors for stat cards
	const statGradients = {
		days: ["#5B9AA9", "#4A7F8C"] as [string, string],
		happy: ["#84B59F", "#6B9681"] as [string, string],
		positivity: ["#A1D6E2", "#82C5D4"] as [string, string],
	};

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
					<ProfileHeader title="Profile" onSettingsPress={handleSettingsPress} />

					<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
						<UserInfo
							name={user?.name || null}
							email={user?.email || null}
							avatarUrl={null}
						/>

						{isLoading ? (
							<LoadingSpinner message="Loading your stats..." />
						) : (
							<>
								<StatsGrid
									totalDays={totalDays}
									happyDays={happyDays}
									happyPercentage={happyPercentage}
								/>

								<BadgesGrid
									hasFirstMood={hasFirstMood}
									has7DayStreak={has7DayStreak}
									has30DayStreak={has30DayStreak}
									hasHappyMonth={hasHappyMonth}
								/>
							</>
						)}
					</ScrollView>
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
	scrollView: {
		flex: 1,
	},
});
