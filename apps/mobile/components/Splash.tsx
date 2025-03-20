import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Spinner, Text, useTheme } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export function Splash() {
	const theme = useTheme();
	const colorScheme = useColorScheme();

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: Colors[colorScheme ?? "light"].background },
			]}
		>
			<Image
				source={require("@/assets/images/app-logo.png")}
				style={styles.logo}
				resizeMode="contain"
			/>
			<Spinner size="large" status="primary" style={styles.spinner} />
			<Text category="h6" style={styles.text}>
				Loading your mood data...
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	logo: {
		width: 120,
		height: 120,
		marginBottom: 30,
	},
	spinner: {
		marginVertical: 20,
	},
	text: {
		textAlign: "center",
		marginTop: 10,
	},
});
