import React from "react";
import { StyleSheet, View, Image, GestureResponderEvent } from "react-native";
import { Button, Text } from "@ui-kitten/components";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useCompleteOnboarding } from "@/hooks/useCompleteOnboarding";

export default function CompleteScreen() {
	const colorScheme = useColorScheme();
	const { completeOnboarding } = useCompleteOnboarding();

	const handleComplete = (_: GestureResponderEvent) => {
		completeOnboarding();
	};

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: Colors[colorScheme ?? "light"].background },
			]}
		>
			<View style={styles.content}>
				<Image
					source={require("@/assets/images/welcome-splash.png")}
					style={styles.image}
					resizeMode="contain"
				/>

				<Text category="h1" style={styles.title}>
					You're All Set!
				</Text>

				<Text style={styles.description}>
					Welcome to Align. You've just taken the first step to understanding yourself
					better.
				</Text>

				<Button style={styles.button} size="large" onPress={handleComplete}>
					Get Started
				</Button>
			</View>
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
	content: {
		width: "100%",
		maxWidth: 500,
		alignItems: "center",
	},
	image: {
		width: "80%",
		height: 400,
		marginBottom: 30,
	},
	title: {
		marginBottom: 20,
		textAlign: "center",
	},
	description: {
		textAlign: "center",
		marginBottom: 40,
		paddingHorizontal: 20,
		fontSize: 16,
		lineHeight: 24,
	},
	button: {
		width: "80%",
		borderRadius: 30,
	},
});
