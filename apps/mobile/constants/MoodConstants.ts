import { MoodType } from "shared";

// Combined styling information for different contexts
export const MOOD_METADATA: Record<
	MoodType,
	{
		name: string;
		emoji: string;
		gradient: [string, string];
		text: string;
		lightColor: string;
		darkColor: string;
	}
> = {
	[MoodType.HAPPY]: {
		name: "Happy",
		emoji: "😊",
		gradient: ["#84B59F", "#6B9681"],
		text: "#ffffff",
		lightColor: "#84B59F",
		darkColor: "#8FC0A9",
	},
	[MoodType.NEUTRAL]: {
		name: "Neutral",
		emoji: "😐",
		gradient: ["#5B9AA9", "#4A7F8C"],
		text: "#ffffff",
		lightColor: "#5B9AA9",
		darkColor: "#64A7B5",
	},
	[MoodType.SAD]: {
		name: "Sad",
		emoji: "😢",
		gradient: ["#7B98A6", "#6C8490"],
		text: "#ffffff",
		lightColor: "#7B98A6",
		darkColor: "#6E8C9E",
	},
};

export const getMoodColor = (mood: MoodType, colorScheme: "light" | "dark" = "light"): string => {
	const styles = MOOD_METADATA[mood];
	return colorScheme === "light" ? styles.lightColor : styles.darkColor;
};
