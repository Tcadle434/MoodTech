import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface UserInfoProps {
	name: string | null;
	email: string | null;
	avatarUrl: string | null;
}

export const UserInfo = ({ name, email, avatarUrl }: UserInfoProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<View style={styles.profileSection}>
			<Avatar
				style={styles.avatar}
				size="giant"
				source={avatarUrl ? { uri: avatarUrl } : require("@/assets/images/icon.png")}
			/>
			<Text category="h5" style={[styles.userName, { color: colors.text }]}>
				{name || "User"}
			</Text>
			<Text category="s1" style={[styles.userEmail, { color: colors.textSecondary }]}>
				{email || "No email available"}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	profileSection: {
		alignItems: "center",
		paddingVertical: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		marginBottom: 16,
	},
	userName: {
		marginBottom: 4,
		fontWeight: "600",
	},
	userEmail: {
		opacity: 0.7,
	},
});
