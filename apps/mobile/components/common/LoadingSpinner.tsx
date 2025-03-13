import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Spinner } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface LoadingSpinnerProps {
	message?: string;
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<Spinner size="large" status="primary" />
			{message && (
				<Text category="s1" style={[styles.message, { color: colors.textSecondary }]}>
					{message}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	message: {
		marginTop: 16,
		textAlign: "center",
	},
});
