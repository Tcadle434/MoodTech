// Common types used across the application

export enum MoodType {
	HAPPY = "happy",
	NEUTRAL = "neutral",
	SAD = "sad",
}

export interface MoodEntry {
	id: string;
	date: string; // ISO date string
	mood: MoodType;
	note?: string;
	createdAt: string; // ISO datetime string
	updatedAt: string; // ISO datetime string
}

export interface User {
	id: string;
	email: string;
	name?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	accessToken: string;
	user: User;
}
