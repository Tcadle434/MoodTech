import React from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Text, Icon } from "@ui-kitten/components";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { useCompleteOnboarding } from "@/hooks/useCompleteOnboarding";
import { useHealthKitInit } from "@/hooks/useHealthKitInit";
import { useLocationInit } from "@/hooks/useLocationInit";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function EnableServicesScreen() {
	const { skipAllOnboarding } = useCompleteOnboarding();
	const isHealthKitInitialized = useHealthKitInit();
	const isLocationInitialized = useLocationInit();
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	const handleHealthDataPress = () => {
		Alert.alert(
			isHealthKitInitialized ? "Health Data Connected" : "Health Data Not Connected",
			isHealthKitInitialized
				? "Your Apple Health data is connected to Align. Your steps and other health metrics will be shown alongside your mood entries."
				: "Health data integration is managed automatically. The app will prompt you for permissions when needed.",
			[{ text: "OK", style: "default" }]
		);
	};

	const handleLocationPress = () => {
		Alert.alert(
			isLocationInitialized
				? "Location Services Connected"
				: "Location Services Not Connected",
			isLocationInitialized
				? "Location services are enabled. Align will use your location to provide more relevant insights."
				: "Location services are managed automatically. The app will prompt you for permissions when needed.",
			[{ text: "OK", style: "default" }]
		);
	};

	return (
		<OnboardingScreen
			title="Align"
			subTitle="Requesting Permissions"
			description="Get personalized insights by granting these permissions"
			image={require("@/assets/images/align-logo-transparent.png")}
			nextScreenPath="/onboarding/complete"
			onSkipAll={skipAllOnboarding}
		>
			<View style={styles.featuresContainer}>
				<TouchableOpacity
					style={[styles.settingRow, { backgroundColor: colors.surface }]}
					onPress={handleHealthDataPress}
				>
					<Icon
						name="heart-outline"
						style={[styles.settingIcon, { tintColor: colors.text }]}
					/>
					<Text style={[styles.settingText, { color: colors.text }]}>Health Data</Text>
					<View style={styles.settingRightContent}>
						{isHealthKitInitialized ? (
							<View
								style={[
									styles.connectedBadge,
									{ backgroundColor: colors.tertiary },
								]}
							>
								<Text style={styles.connectedText}>Enabled</Text>
							</View>
						) : (
							<View
								style={[styles.connectedBadge, { backgroundColor: colors.subtle }]}
							>
								<Text
									style={[styles.connectedText, { color: colors.textSecondary }]}
								>
									Not Connected
								</Text>
							</View>
						)}
						<Icon
							name="chevron-right-outline"
							style={[styles.chevronIcon, { tintColor: colors.textSecondary }]}
						/>
					</View>
				</TouchableOpacity>
			</View>
			<View style={styles.featuresContainer}>
				<TouchableOpacity
					style={[styles.settingRow, { backgroundColor: colors.surface }]}
					onPress={handleLocationPress}
				>
					<Icon
						name="navigation-2-outline"
						style={[styles.settingIcon, { tintColor: colors.text }]}
					/>
					<Text style={[styles.settingText, { color: colors.text }]}>
						Location Services
					</Text>
					<View style={styles.settingRightContent}>
						{isLocationInitialized ? (
							<View
								style={[
									styles.connectedBadge,
									{ backgroundColor: colors.tertiary },
								]}
							>
								<Text style={styles.connectedText}>Enabled</Text>
							</View>
						) : (
							<View
								style={[styles.connectedBadge, { backgroundColor: colors.subtle }]}
							>
								<Text
									style={[styles.connectedText, { color: colors.textSecondary }]}
								>
									Not Connected
								</Text>
							</View>
						)}
						<Icon
							name="chevron-right-outline"
							style={[styles.chevronIcon, { tintColor: colors.textSecondary }]}
						/>
					</View>
				</TouchableOpacity>
			</View>
		</OnboardingScreen>
	);
}

const styles = StyleSheet.create({
	featuresContainer: {
		width: "100%",
		paddingHorizontal: 16,
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderRadius: 16,
		marginBottom: 8,
	},
	settingIcon: {
		width: 22,
		height: 22,
		marginRight: 16,
	},
	settingText: {
		flex: 1,
		fontSize: 16,
	},
	chevronIcon: {
		width: 18,
		height: 18,
	},
	settingRightContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	connectedBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 8,
	},
	connectedText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
});
