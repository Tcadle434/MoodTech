import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { useCompleteOnboarding } from "@/hooks/useCompleteOnboarding";

export default function WelcomeScreen() {
	const { skipAllOnboarding } = useCompleteOnboarding();

	return (
		<OnboardingScreen
			title="Align"
			subTitle="Take control of how you feel"
			description="Track your mood, understand your patterns, and improve your emotional wellbeing."
			image={require("@/assets/images/align-logo-transparent.png")}
			nextScreenPath="/onboarding/enableServices"
			onSkipAll={skipAllOnboarding}
		>
			<View style={styles.featuresContainer}>
				<FeatureItem
					icon="💭"
					title="Mood Tracking"
					description="Record your emotions daily"
				/>
				<FeatureItem
					icon="🏃‍♂️"
					title="Health Integration"
					description="Connect with various health and activity data"
				/>
				<FeatureItem
					icon="🧠"
					title="Pattern Analysis"
					description="Understand your emotional trends"
				/>
			</View>
		</OnboardingScreen>
	);
}

const FeatureItem = ({
	icon,
	title,
	description,
}: {
	icon: string;
	title: string;
	description: string;
}) => {
	return (
		<View style={styles.featureItem}>
			<Text style={styles.featureIcon}>{icon}</Text>
			<View style={styles.featureTextContainer}>
				<Text category="h6" style={styles.featureTitle}>
					{title}
				</Text>
				<Text category="p2" style={styles.featureDescription}>
					{description}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	featuresContainer: {
		width: "100%",
		paddingHorizontal: 16,
		marginTop: 20,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
		backgroundColor: "rgba(0, 0, 0, 0.02)",
	},
	featureIcon: {
		fontSize: 32,
		marginRight: 16,
	},
	featureTextContainer: {
		flex: 1,
	},
	featureTitle: {
		marginBottom: 4,
	},
	featureDescription: {
		opacity: 0.7,
	},
});
