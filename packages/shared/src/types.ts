// Common types used across the application

export enum MoodType {
	HAPPY = "happy",
	SAD = "sad",
	SURPRISED = "surprised",
	FEARFUL = "fearful",
	ANGRY = "angry",
	DISGUSTED = "disgusted",
	BAD = "bad",
}

export enum SubMoodType {
	// Happy
	PLAYFUL = "playful",
	CONTENT = "content",
	INTERESTED = "interested",
	PROUD = "proud",
	ACCEPTED = "accepted",
	POWERFUL = "powerful",
	PEACEFUL = "peaceful",
	TRUSTING = "trusting",
	OPTIMISTIC = "optimistic",

	// Bad
	BORED = "bored",
	BUSY = "busy",
	STRESSED = "stressed",
	TIRED = "tired",

	// Surprised
	STARTLED = "startled",
	CONFUSED = "confused",
	AMAZED = "amazed",
	EXCITED = "excited",

	// Fearful
	SCARED = "scared",
	ANXIOUS = "anxious",
	INSECURE = "insecure",
	WEAK = "weak",
	REJECTED = "rejected",
	THREATENED = "threatened",

	// Angry
	DISTANT = "distant",
	CRITICAL = "critical",
	FRUSTRATED = "frustrated",
	MAD = "mad",
	AGGRESSIVE = "aggressive",
	HOSTILE = "hostile",
	INFURIATED = "infuriated",

	// Disgusted
	DISAPPROVING = "disapproving",
	DISAPPOINTED = "disappointed",
	AWFUL = "awful",
	REPELLED = "repelled",

	// Sad
	LONELY = "lonely",
	VULNERABLE = "vulnerable",
	DESPAIR = "despair",
	GUILTY = "guilty",
	DEPRESSED = "depressed",
	HURT = "hurt",
	INFERIOR = "inferior",
}

export interface MoodEntry {
	id: string;
	date: string; // ISO date string
	mood: MoodType;
	subMood?: SubMoodType;
	note?: string;
	createdAt: string; // ISO datetime string
	updatedAt: string; // ISO datetime string
}

export interface User {
	id: string;
	email: string;
	name?: string;
	avatarId?: string;
	hasCompletedOnboarding?: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	accessToken: string;
	user: User;
}
