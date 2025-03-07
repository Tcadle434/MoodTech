import React, { useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Button, Text, Icon, Card } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import useHealthStore from "@/store/healthStore";

interface HealthPermissionRequestProps {
	onComplete?: () => void;
}

export const HealthPermissionRequest: React.FC<HealthPermissionRequestProps> = ({ onComplete }) => {
	const [isRequesting, setIsRequesting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const scheme = useColorScheme();
	const colors = Colors[scheme];

	const initializeHealthKit = useHealthStore((state) => state.initializeHealthKit);
	const hasHealthPermissions = useHealthStore((state) => state.hasHealthPermissions);

	const handleRequestPermissions = async () => {
		if (Platform.OS !== "ios") {
			setError("Health data integration is only available on iOS devices.");
			return;
		}

		console.log("Starting health permissions request...");
		setIsRequesting(true);
		setError(null);

		try {
			console.log("Calling initializeHealthKit...");
			await initializeHealthKit();
			console.log("HealthKit initialized successfully");

			if (onComplete) {
				console.log("Calling onComplete callback");
				onComplete();
			}
		} catch (err) {
			console.error("Health permissions error:", err);
			setError(err instanceof Error ? err.message : "Failed to request health permissions");
		} finally {
			setIsRequesting(false);
		}
	};

	// If already has permissions and onComplete provided, call it
	if (hasHealthPermissions && onComplete) {
		onComplete();
		return null;
	}

	if (Platform.OS !== "ios") {
		return (
			<Card style={[styles.card, { backgroundColor: colors.surface }]}>
				<Text style={[styles.title, { color: colors.text }]}>iOS Only Feature</Text>
				<Text style={[styles.description, { color: colors.textSecondary }]}>
					Health data integration is only available on iOS devices.
				</Text>
			</Card>
		);
	}

	return (
		<Card style={[styles.card, { backgroundColor: colors.surface }]}>
			<View style={styles.iconContainer}>
				<Icon name="heart-outline" style={[styles.icon, { tintColor: colors.tint }]} />
			</View>

			<Text style={[styles.title, { color: colors.text }]}>Connect Health Data</Text>

			<Text style={[styles.description, { color: colors.textSecondary }]}>
				Allow MoodTech to read your health data like steps, distance, and calories to help
				correlate your physical activity with your mood.
			</Text>

			{error && (
				<Text style={styles.errorText} status="danger">
					{error}
				</Text>
			)}

			<Button
				style={styles.button}
				onPress={handleRequestPermissions}
				disabled={isRequesting}
			>
				{isRequesting ? "REQUESTING..." : "CONNECT HEALTH DATA"}
			</Button>

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
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 16,
		padding: 24,
		marginBottom: 16,
		alignItems: "center",
	},
	iconContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "rgba(86, 157, 226, 0.15)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	icon: {
		width: 30,
		height: 30,
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		textAlign: "center",
		marginBottom: 8,
	},
	description: {
		textAlign: "center",
		marginBottom: 24,
		lineHeight: 20,
	},
	button: {
		width: "100%",
		marginBottom: 8,
	},
	skipButton: {
		marginTop: 8,
	},
	errorText: {
		textAlign: "center",
		marginBottom: 16,
	},
});
