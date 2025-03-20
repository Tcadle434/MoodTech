import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import apiClient from "@/api/client";
import apiConfig from "@/api/config";

export function useCompleteOnboarding() {
	const { user, updateUser } = useAuth();
	const queryClient = useQueryClient();

	/**
	 * Complete onboarding mutation
	 */
	const { mutate: completeOnboarding, isPending } = useMutation({
		mutationFn: async () => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}

			// Use the client.put method to update the user's hasCompletedOnboarding status
			return apiClient.put(`${apiConfig.USERS.BASE}/${user.id}`, {
				hasCompletedOnboarding: true,
			});
		},
		onSuccess: () => {
			// Update local user state
			updateUser({ hasCompletedOnboarding: true });

			// Invalidate profile queries to ensure data consistency
			queryClient.invalidateQueries({ queryKey: ["user", user?.id] });

			// Navigate to main app
			router.replace("/(tabs)");
		},
	});

	/**
	 * Skip all onboarding screens
	 */
	const skipAllOnboarding = () => {
		completeOnboarding();
	};

	return {
		completeOnboarding,
		skipAllOnboarding,
		isCompletingOnboarding: isPending,
	};
}
