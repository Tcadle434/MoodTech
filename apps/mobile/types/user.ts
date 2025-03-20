import { User as SharedUser } from "shared";

// Extend the shared User type to ensure hasCompletedOnboarding is available
export interface User extends SharedUser {
	hasCompletedOnboarding: boolean;
}

// Helper function to ensure a user has the hasCompletedOnboarding property
export function ensureUserWithOnboardingStatus(user: SharedUser): User {
	return {
		...user,
		hasCompletedOnboarding: user.hasCompletedOnboarding ?? false,
	};
}
