import React, { useState } from "react";
import {
	View,
	StyleSheet,
	SafeAreaView,
	Modal,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { Layout, Icon, Input, Button, Spinner, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { UserInfo } from "@/components/profile/UserInfo";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/api/authService";

export default function EditProfileScreen() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const { user } = useAuth();

	const [name, setName] = useState(user?.name || "");
	const [avatarId, setAvatarId] = useState<string | null>((user as any)?.avatarId || null);
	const [avatarModalVisible, setAvatarModalVisible] = useState(false);

	// Update profile mutation
	const updateProfile = useMutation({
		mutationFn: async (data: { name: string; avatarId?: string }) => {
			if (!user?.id) throw new Error("User ID not found");
			return authService.updateProfile(user.id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			Alert.alert("Success", "Your profile has been updated");
			router.back();
		},
		onError: (error) => {
			console.error("Error updating profile:", error);
			Alert.alert("Error", "Failed to update profile. Please try again.");
		},
	});

	const handleBack = () => {
		router.back();
	};

	const handleSelectAvatar = (id: string) => {
		setAvatarId(id);
	};

	const handleSave = () => {
		updateProfile.mutate({
			name: name.trim(),
			avatarId: avatarId || undefined,
		});
	};

	return (
		<Layout style={[styles.container, { backgroundColor: colors.background }]}>
			<SafeAreaView style={styles.safeArea}>
				<KeyboardAvoidingView
					style={styles.keyboardAvoidingView}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<View style={styles.header}>
						<TouchableOpacity onPress={handleBack} style={styles.backButton}>
							<Icon
								name="arrow-back-outline"
								style={[styles.backIcon, { tintColor: colors.text }]}
							/>
						</TouchableOpacity>
						<View style={styles.headerTitleContainer}>
							<View style={styles.headerTitleContent}>
								<Icon
									name="person-outline"
									style={[styles.headerIcon, { tintColor: colors.tertiary }]}
								/>
								<View>
									<Text style={[styles.headerTitle, { color: colors.text }]}>
										Edit Profile
									</Text>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.content}>
						<UserInfo
							name={name || user?.name || null}
							email={user?.email || null}
							avatarId={avatarId}
							onAvatarPress={() => setAvatarModalVisible(true)}
							editable={true}
						/>

						<View style={styles.form}>
							<Input
								label="Name"
								placeholder="Enter your name"
								value={name}
								onChangeText={setName}
								style={styles.input}
								autoCapitalize="words"
								disabled={updateProfile.isPending}
							/>
						</View>

						<View style={styles.buttonContainer}>
							<Button
								onPress={handleSave}
								disabled={updateProfile.isPending}
								style={styles.saveButton}
								accessoryLeft={
									updateProfile.isPending
										? () => <Spinner size="small" />
										: undefined
								}
							>
								{updateProfile.isPending ? "Saving..." : "Save Changes"}
							</Button>
						</View>
					</View>
				</KeyboardAvoidingView>

				<Modal
					visible={avatarModalVisible}
					animationType="slide"
					onRequestClose={() => setAvatarModalVisible(false)}
				>
					<Layout style={[{ flex: 1, backgroundColor: colors.background }]}>
						<SafeAreaView style={{ flex: 1 }}>
							<AvatarSelector
								selectedAvatarId={avatarId}
								onSelectAvatar={handleSelectAvatar}
								onClose={() => setAvatarModalVisible(false)}
							/>
						</SafeAreaView>
					</Layout>
				</Modal>
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
	keyboardAvoidingView: {
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
	headerTitleContainer: {
		flex: 1,
		alignItems: "center",
	},
	headerTitleContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerIcon: {
		width: 20,
		height: 20,
		marginRight: 8,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingBottom: 24,
	},
	form: {
		marginTop: 24,
	},
	input: {
		marginBottom: 16,
	},
	buttonContainer: {
		marginTop: 32,
	},
	saveButton: {
		borderRadius: 12,
	},
});
