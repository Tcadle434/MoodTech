import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Icon, Divider } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

interface SettingsListProps {
	isHealthKitInitialized: boolean;
	onEditProfilePress: () => void;
	onNotificationsPress: () => void;
	onHealthDataPress: () => void;
	onLogoutPress: () => void;
}

export const SettingsList = ({
	isHealthKitInitialized,
	onEditProfilePress,
	onNotificationsPress,
	onHealthDataPress,
	onLogoutPress,
}: SettingsListProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<View style={styles.settingsSection}>
			<Text category="h6" style={[styles.sectionTitle, { color: colors.text }]}>
				Settings
			</Text>

			<TouchableOpacity
				style={[styles.settingRow, { backgroundColor: colors.surface }]}
				onPress={onEditProfilePress}
			>
				<Icon
					name="person-outline"
					style={[styles.settingIcon, { tintColor: colors.text }]}
				/>
				<Text style={[styles.settingText, { color: colors.text }]}>Edit Profile</Text>
				<Icon
					name="chevron-right-outline"
					style={[styles.chevronIcon, { tintColor: colors.textSecondary }]}
				/>
			</TouchableOpacity>

			<Divider style={[styles.divider, { backgroundColor: colors.subtle }]} />

			<TouchableOpacity
				style={[styles.settingRow, { backgroundColor: colors.surface }]}
				onPress={onNotificationsPress}
			>
				<Icon
					name="bell-outline"
					style={[styles.settingIcon, { tintColor: colors.text }]}
				/>
				<Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
				<Icon
					name="chevron-right-outline"
					style={[styles.chevronIcon, { tintColor: colors.textSecondary }]}
				/>
			</TouchableOpacity>

			<Divider style={[styles.divider, { backgroundColor: colors.subtle }]} />

			<TouchableOpacity
				style={[styles.settingRow, { backgroundColor: colors.surface }]}
				onPress={onHealthDataPress}
			>
				<Icon
					name="heart-outline"
					style={[styles.settingIcon, { tintColor: colors.text }]}
				/>
				<Text style={[styles.settingText, { color: colors.text }]}>Health Data</Text>
				<View style={styles.settingRightContent}>
					{isHealthKitInitialized ? (
						<View style={[styles.connectedBadge, { backgroundColor: colors.tertiary }]}>
							<Text style={styles.connectedText}>Connected</Text>
						</View>
					) : (
						<View style={[styles.connectedBadge, { backgroundColor: colors.subtle }]}>
							<Text style={[styles.connectedText, { color: colors.textSecondary }]}>
								Not Connected
							</Text>
						</View>
					)}
					<Icon
						name="chevron-right-outline"
						style={[styles.chevronIcon, { tintColor: colors.textSecondary }]}
					/>
				</View>
			</TouchableOpacity>

			<Divider style={[styles.divider, { backgroundColor: colors.subtle }]} />

			<TouchableOpacity
				style={[styles.settingRow, { backgroundColor: colors.surface }]}
				onPress={onLogoutPress}
			>
				<Icon
					name="log-out-outline"
					style={[styles.settingIcon, { tintColor: "#F9695E" }]}
				/>
				<Text style={[styles.settingText, { color: "#F9695E" }]}>Logout</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	settingsSection: {
		padding: 24,
		paddingTop: 10,
		paddingBottom: 40,
	},
	sectionTitle: {
		marginBottom: 20,
		fontSize: 20,
		fontWeight: "600",
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderRadius: 16,
		marginBottom: 8,
	},
	settingIcon: {
		width: 22,
		height: 22,
		marginRight: 16,
	},
	settingText: {
		flex: 1,
		fontSize: 16,
	},
	chevronIcon: {
		width: 18,
		height: 18,
	},
	divider: {
		height: 1,
		marginVertical: 4,
	},
	settingRightContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	connectedBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginRight: 8,
	},
	connectedText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
});
