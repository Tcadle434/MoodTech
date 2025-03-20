import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Avatar, Icon } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { getAvatarSourceById } from "@/constants/AvatarConstants";

interface UserInfoProps {
	name: string | null;
	email: string | null;
	avatarId: string | null;
	onAvatarPress?: () => void;
	editable?: boolean;
}

export const UserInfo = ({
	name,
	email,
	avatarId,
	onAvatarPress,
	editable = false,
}: UserInfoProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<View style={styles.profileSection}>
			<TouchableOpacity
				style={styles.avatarContainer}
				onPress={onAvatarPress}
				disabled={!editable}
			>
				<Avatar style={styles.avatar} size="giant" source={getAvatarSourceById(avatarId)} />
				{editable && (
					<View style={[styles.editIconContainer, { backgroundColor: colors.tertiary }]}>
						<Icon name="edit-2-outline" style={styles.editIcon} fill="#FFFFFF" />
					</View>
				)}
			</TouchableOpacity>
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
	avatarContainer: {
		position: "relative",
		marginBottom: 16,
	},
	avatar: {
		width: 100,
		height: 100,
	},
	editIconContainer: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#FFFFFF",
	},
	editIcon: {
		width: 16,
		height: 16,
	},
	userName: {
		marginBottom: 4,
		fontWeight: "600",
	},
	userEmail: {
		opacity: 0.7,
	},
});
