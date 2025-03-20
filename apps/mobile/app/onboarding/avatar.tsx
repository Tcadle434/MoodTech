import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/api/authService";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { useCompleteOnboarding } from "@/hooks/useCompleteOnboarding";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { getAvatarSourceById } from "@/constants/AvatarConstants";

export default function AvatarScreen() {
	const { user, updateUser } = useAuth();
	const queryClient = useQueryClient();
	const { skipAllOnboarding } = useCompleteOnboarding();

	const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(
		(user as any)?.avatarId || null
	);

	// Update profile mutation for avatar changes
	const updateAvatar = useMutation({
		mutationFn: async (avatarId: string) => {
			if (!user?.id) throw new Error("User ID not found");
			return authService.updateProfile(user.id, { avatarId });
		},
		onSuccess: (_, avatarId) => {
			// Update local user state
			updateUser({ avatarId });
		},
	});

	const handleSelectAvatar = (avatarId: string) => {
		setSelectedAvatarId(avatarId);
		updateAvatar.mutate(avatarId);
	};

	return (
		<OnboardingScreen
			title="Choose Your Avatar"
			description="Select an avatar that represents you best. You can always change this later in settings."
			image={
				selectedAvatarId
					? getAvatarSourceById(selectedAvatarId)
					: require("@/assets/images/profile.png")
			}
			nextScreenPath="/onboarding/health"
			onSkipAll={skipAllOnboarding}
		>
			<View style={styles.avatarSelectorContainer}>
				<AvatarSelector
					selectedAvatarId={selectedAvatarId}
					onSelectAvatar={handleSelectAvatar}
					onClose={() => {}} // Not used in this context
				/>
			</View>
		</OnboardingScreen>
	);
}

const styles = StyleSheet.create({
	avatarSelectorContainer: {
		flex: 1,
		width: "100%",
		maxHeight: 400,
	},
});
