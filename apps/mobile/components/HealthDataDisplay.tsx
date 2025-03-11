import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import useHealthData from "@/hooks/useHealthData";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface HealthDataDisplayProps {
	date: Date;
}

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
export const HealthDataDisplay = memo(
	({ date }: HealthDataDisplayProps) => {
		// Use the hook with the provided date
		const { steps, isLoading, hasHealthPermissions } = useHealthData(date);
		const scheme = useColorScheme();
		const colors = Colors[scheme ?? "light"];

		// If no permissions, don't render anything
		if (!hasHealthPermissions) {
			return null;
		}

		// Format the steps number with commas
		const formattedSteps = useMemo(() => steps.toLocaleString(), [steps]);

		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Text category="s2" style={{ color: colors.textSecondary }}>
					{isLoading ? (
						"Loading health data..."
					) : (
						<>
							Steps on this day:{" "}
							<Text style={{ fontWeight: "600", color: colors.text }}>
								{formattedSteps}
							</Text>
						</>
					)}
				</Text>
			</View>
		);
	},
	// Custom comparison function to only re-render when the date changes
	(prevProps, nextProps) => {
		return prevProps.date.toDateString() === nextProps.date.toDateString();
	}
);

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 16,
		marginBottom: 24,
		width: "100%",
		alignItems: "center",
	},
});
