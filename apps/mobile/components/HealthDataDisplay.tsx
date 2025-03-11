import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import useHealthData from "@/hooks/useHealthData";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface HealthDataDisplayProps {
	date: Date;
}

// Use React.memo to prevent unnecessary re-renders
export const HealthDataDisplay = memo(({ date }: HealthDataDisplayProps) => {
	const { steps, isLoading, hasHealthPermissions } = useHealthData(date);
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	if (!hasHealthPermissions) {
		return null;
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Text category="s2" style={{ color: colors.textSecondary }}>
				{isLoading ? (
					"Loading health data..."
				) : (
					<>
						Steps on this day:{" "}
						<Text style={{ fontWeight: "600", color: colors.text }}>
							{steps.toLocaleString()}
						</Text>
					</>
				)}
			</Text>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 16,
		marginBottom: 24,
		width: "100%",
		alignItems: "center",
	},
});
