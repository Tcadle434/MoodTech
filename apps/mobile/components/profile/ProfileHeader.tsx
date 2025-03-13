import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Icon } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export interface ProfileHeaderProps {
	title: string;
	onSettingsPress: () => void;
}

export const ProfileHeader = ({ title, onSettingsPress }: ProfileHeaderProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<View style={styles.header}>
			<Text category="h1" style={[styles.headerTitle, { color: colors.text }]}>
				{title}
			</Text>
			<TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
				<Icon
					name="settings-outline"
					style={[styles.settingsIcon, { tintColor: colors.text }]}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 24,
		paddingTop: 60,
	},
	headerTitle: {
		fontSize: 34,
		fontWeight: "700",
	},
	settingsButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	settingsIcon: {
		width: 24,
		height: 24,
	},
});
