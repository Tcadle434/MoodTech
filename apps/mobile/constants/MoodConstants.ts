import { MoodType } from "shared";

export const MOOD_EMOJIS: Record<MoodType, string> = {
	[MoodType.HAPPY]: "😊",
	[MoodType.NEUTRAL]: "😐",
	[MoodType.SAD]: "😢",
};

// Combined styling information for different contexts
export const MOOD_STYLES: Record<
	MoodType,
	{
		gradient: [string, string];
		text: string;
		lightColor: string;
		darkColor: string;
	}
> = {
	[MoodType.HAPPY]: {
		gradient: ["#84B59F", "#6B9681"],
		text: "#ffffff",
		lightColor: "#84B59F",
		darkColor: "#8FC0A9",
	},
	[MoodType.NEUTRAL]: {
		gradient: ["#5B9AA9", "#4A7F8C"],
		text: "#ffffff",
		lightColor: "#5B9AA9",
		darkColor: "#64A7B5",
	},
	[MoodType.SAD]: {
		gradient: ["#7B98A6", "#6C8490"],
		text: "#ffffff",
		lightColor: "#7B98A6",
		darkColor: "#6E8C9E",
	},
};

export const getMoodColor = (mood: MoodType, colorScheme: "light" | "dark" = "light"): string => {
	const styles = MOOD_STYLES[mood];
	return colorScheme === "light" ? styles.lightColor : styles.darkColor;
};

export const getMoodGradient = (mood: MoodType): [string, string] => {
	return MOOD_STYLES[mood].gradient;
};

export const getMoodTextColor = (mood: MoodType): string => {
	return MOOD_STYLES[mood].text;
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
