import React, { memo, useMemo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import useHealthData from "@/hooks/useHealthData";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { format } from "date-fns";

interface HealthDataDisplayProps {
	date: Date;
}

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
export const HealthDataDisplay = memo(
	({ date }: HealthDataDisplayProps) => {
		// Log when component renders with which date
		useEffect(() => {
			console.log(`[HealthDataDisplay] Rendering with date: ${date.toLocaleDateString()}, DateKey: ${format(date, "yyyy-MM-dd")}`);
		}, [date]);

		// Use the hook with the provided date
		const { steps, isLoading, hasHealthPermissions, _debug_dateKey } = useHealthData(date);
		
		// Log when we receive step data
		useEffect(() => {
			console.log(`[HealthDataDisplay] Received step data: ${steps} steps for dateKey: ${_debug_dateKey}`);
		}, [steps, _debug_dateKey]);

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
				<Text category="c1" style={{ color: colors.textSecondary, marginTop: 4, opacity: 0.7 }}>
					Date: {format(date, "yyyy-MM-dd")}
				</Text>
			</View>
		);
	},
	// Custom comparison function to only re-render when the date changes
	(prevProps, nextProps) => {
		const result = prevProps.date.toDateString() === nextProps.date.toDateString();
		if (!result) {
			console.log(`[HealthDataDisplay] Re-rendering due to date change from ${prevProps.date.toDateString()} to ${nextProps.date.toDateString()}`);
		}
		return result;
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
