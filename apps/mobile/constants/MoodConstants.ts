import { MoodType } from "shared";

export const MOOD_EMOJIS: Record<MoodType, string> = {
	[MoodType.HAPPY]: "😊",
	[MoodType.NEUTRAL]: "😐",
	[MoodType.SAD]: "😢",
};

export const MOOD_GRADIENTS: Record<MoodType, [string, string]> = {
	[MoodType.HAPPY]: ["#84B59F", "#6B9681"], // Success/tertiary colors
	[MoodType.NEUTRAL]: ["#5B9AA9", "#4A7F8C"], // Primary color
	[MoodType.SAD]: ["#7B98A6", "#6C8490"], // Neutral, more subdued
};

export const getMoodColor = (mood: MoodType, colorScheme: "light" | "dark" = "light"): string => {
	switch (mood) {
		case MoodType.HAPPY:
			return colorScheme === "light" ? "#84B59F" : "#8FC0A9";
		case MoodType.NEUTRAL:
			return colorScheme === "light" ? "#5B9AA9" : "#64A7B5";
		case MoodType.SAD:
			return colorScheme === "light" ? "#7B98A6" : "#6E8C9E";
		default:
			return "transparent";
	}
};

export const getMoodName = (mood: MoodType): string => {
	switch (mood) {
		case MoodType.HAPPY:
			return "Happy";
		case MoodType.NEUTRAL:
			return "Neutral";
		case MoodType.SAD:
			return "Sad";
		default:
			return "";
	}
};
