import React from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { Layout, Icon } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { SettingsList } from "@/components/profile/SettingsList";
import { useHealthKitInit } from "@/hooks/useHealthKitInit";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsScreen() {
	const router = useRouter();
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const isHealthKitInitialized = useHealthKitInit();
	const { logout } = useAuth();

	const handleBack = () => {
		router.back();
	};

	const handleEditProfile = () => {
		router.push("/edit-profile");
	};

	const handleNotifications = () => {
		// TODO: Navigate to notifications settings
		console.log("Navigate to notifications");
	};

	const handlePrivacy = () => {
		// TODO: Navigate to privacy settings
		console.log("Navigate to privacy");
	};

	const handleHealthData = () => {
		Alert.alert(
			isHealthKitInitialized ? "Health Data Connected" : "Health Data Not Connected",
			isHealthKitInitialized
				? "Your Apple Health data is connected to MoodTech. Your steps and other health metrics will be shown alongside your mood entries."
				: "Health data integration is managed automatically. The app will prompt you for permissions when needed.",
			[{ text: "OK", style: "default" }]
		);
	};

	const handleLogout = async () => {
		await logout();
		router.replace("/(auth)/login");
	};

	return (
		<Layout style={[styles.container, { backgroundColor: colors.background }]}>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleBack} style={styles.backButton}>
						<Icon
							name="arrow-back-outline"
							style={[styles.backIcon, { tintColor: colors.text }]}
						/>
					</TouchableOpacity>
				</View>
				<SettingsList
					isHealthKitInitialized={isHealthKitInitialized}
					onEditProfilePress={handleEditProfile}
					onNotificationsPress={handleNotifications}
					onPrivacyPress={handlePrivacy}
					onHealthDataPress={handleHealthData}
					onLogoutPress={handleLogout}
				/>
			</SafeAreaView>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		paddingTop: 0,
	},
	backButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	backIcon: {
		width: 24,
		height: 24,
	},
});
