import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { format } from "date-fns";
import { useStepCount } from "@/hooks/useStepCount";
import { useHealthKitInit } from "@/hooks/useHealthKitInit";

interface HealthDataDisplayProps {
	date: Date;
}

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
export const HealthDataDisplay = memo(
	({ date }: HealthDataDisplayProps) => {
		const scheme = useColorScheme();
		const colors = Colors[scheme ?? "light"];
		const isInitialized = useHealthKitInit();
		const { data: steps = 0, isLoading, error } = useStepCount(date);

		// Format the steps number with commas
		const formattedSteps = useMemo(() => steps.toLocaleString(), [steps]);

		if (error) {
			return (
				<View style={[styles.container, { backgroundColor: colors.background }]}>
					<Text
						category="s2"
						style={{ color: colors.textSecondary, textAlign: "center" }}
					>
						{error instanceof Error
							? error.message
							: "An error occurred while fetching health data"}
					</Text>
				</View>
			);
		}

		// If not initialized, show a prompt
		if (!isInitialized) {
			return (
				<View style={[styles.container, { backgroundColor: colors.background }]}>
					<Text
						category="s2"
						style={{ color: colors.textSecondary, textAlign: "center" }}
					>
						Health data will be shown here once permissions are granted.
					</Text>
					<Text
						category="c1"
						style={{ color: colors.textSecondary, textAlign: "center", marginTop: 4 }}
					>
						The app will automatically request permissions.
					</Text>
				</View>
			);
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
								{formattedSteps}
							</Text>
						</>
					)}
				</Text>
				<Text
					category="c1"
					style={{ color: colors.textSecondary, marginTop: 4, opacity: 0.7 }}
				>
					Date: {format(date, "yyyy-MM-dd")}
				</Text>
			</View>
		);
	},
	// Custom comparison function to only re-render when the date changes
	(prevProps, nextProps) => prevProps.date.toDateString() === nextProps.date.toDateString()
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
