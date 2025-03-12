import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Button, Text, Icon, Layout } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useHealthKitInit } from "@/hooks/useHealthKitInit";
import { LinearGradient } from "expo-linear-gradient";

interface HealthPermissionRequestProps {
	onComplete?: () => void;
}

export const HealthPermissionRequest: React.FC<HealthPermissionRequestProps> = ({ onComplete }) => {
	const scheme = useColorScheme();
	const isInitialized = useHealthKitInit();

	const colors = Colors[scheme ?? "light"];

	if (isInitialized) {
		onComplete?.();
		return null;
	}

	if (Platform.OS !== "ios") {
		return (
			<Layout style={[styles.container, { backgroundColor: colors.surface }]}>
				<Text style={styles.errorText} status="danger">
					Health data integration is only available on iOS devices.
				</Text>
			</Layout>
		);
	}

	return (
		<Layout style={[styles.container, { backgroundColor: colors.surface }]}>
			<LinearGradient
				colors={[colors.tertiary, colors.secondary]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.iconContainer}
			>
				<Icon name="heart-outline" style={[styles.icon, { tintColor: "#FFFFFF" }]} />
			</LinearGradient>

			<Text category="h5" style={[styles.title, { color: colors.text }]}>
				Connect Health Data
			</Text>

			<Text category="p1" style={[styles.description, { color: colors.textSecondary }]}>
				Allow MoodTech to read your health data like steps, distance, and calories to help
				correlate your physical activity with your mood.
			</Text>

			{onComplete && (
				<Button
					appearance="ghost"
					status="basic"
					onPress={onComplete}
					style={styles.skipButton}
				>
					Maybe later
				</Button>
			)}
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 24,
		borderRadius: 24,
		alignItems: "center",
		width: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.15,
		shadowRadius: 16,
		elevation: 8,
	},
	iconContainer: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 24,
	},
	icon: {
		width: 32,
		height: 32,
	},
	title: {
		marginBottom: 12,
		textAlign: "center",
		fontWeight: "600",
	},
	description: {
		textAlign: "center",
		marginBottom: 24,
		lineHeight: 22,
	},
	errorText: {
		marginBottom: 16,
		textAlign: "center",
	},
	skipButton: {
		marginTop: 8,
	},
});
