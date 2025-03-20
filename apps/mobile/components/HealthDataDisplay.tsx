import React, { memo, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { format } from "date-fns";
import { useStepCount } from "@/hooks/useStepCount";
import { useHealthKitInit } from "@/hooks/useHealthKitInit";

interface HealthDataDisplayProps {
	date: Date;
	style?: ViewStyle;
	textColor?: string;
}

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
export const HealthDataDisplay = memo(
	({ date, style, textColor }: HealthDataDisplayProps) => {
		const scheme = useColorScheme();
		const colors = Colors[scheme ?? "light"];
		const isInitialized = useHealthKitInit();
		const { data: steps = 0, isLoading, error } = useStepCount(date);

		// Format the steps number with commas
		const formattedSteps = useMemo(() => steps.toLocaleString(), [steps]);

		// Use the provided textColor or fall back to the theme color
		const displayTextColor = colors.text;
		const displaySecondaryColor = textColor || colors.textSecondary;

		if (error) {
			return (
				<View style={[styles.container, style]}>
					<Text
						category="s2"
						style={{ color: displaySecondaryColor, textAlign: "right" }}
					>
						{error instanceof Error ? error.message : "Error fetching steps"}
					</Text>
				</View>
			);
		}

		// If not initialized, show a prompt
		if (!isInitialized) {
			return (
				<View style={[styles.container, style]}>
					<Text
						category="s2"
						style={{ color: displaySecondaryColor, textAlign: "right" }}
					>
						Waiting for permissions
					</Text>
				</View>
			);
		}

		return (
			<View style={[styles.container, style]}>
				<Text category="s2" style={{ color: displaySecondaryColor, textAlign: "right" }}>
					{isLoading ? (
						"Loading..."
					) : (
						<>
							<Text style={{ fontWeight: "700", color: displayTextColor }}>
								{formattedSteps}
							</Text>
							{" steps"}
						</>
					)}
				</Text>
			</View>
		);
	},
	// Custom comparison function to only re-render when the date changes
	(prevProps, nextProps) => prevProps.date.toDateString() === nextProps.date.toDateString()
);

const styles = StyleSheet.create({
	container: {
		alignItems: "flex-end",
		justifyContent: "center",
	},
});
