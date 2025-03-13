import { MoodType, SubMoodType } from "shared";

export const MOOD_EMOJIS: Record<MoodType, string> = {
	[MoodType.HAPPY]: "😊",
	[MoodType.SAD]: "😔",
	[MoodType.SURPRISED]: "😲",
	[MoodType.FEARFUL]: "😨",
	[MoodType.ANGRY]: "😠",
	[MoodType.DISGUSTED]: "🤢",
	[MoodType.BAD]: "🙁",
};

// Colors taken from the feelings wheel
export const MOOD_STYLES: Record<
	MoodType,
	{
		gradient: [string, string];
		text: string;
		lightColor: string;
		darkColor: string;
		subMoods: SubMoodType[];
	}
> = {
	[MoodType.HAPPY]: {
		gradient: ["#F9B572", "#F7A76C"],
		text: "#ffffff",
		lightColor: "#F9B572",
		darkColor: "#F7A76C",
		subMoods: [
			SubMoodType.PLAYFUL,
			SubMoodType.CONTENT,
			SubMoodType.INTERESTED,
			SubMoodType.PROUD,
			SubMoodType.ACCEPTED,
			SubMoodType.POWERFUL,
			SubMoodType.PEACEFUL,
			SubMoodType.TRUSTING,
			SubMoodType.OPTIMISTIC,
		],
	},
	[MoodType.BAD]: {
		gradient: ["#8B7E74", "#7C6F65"],
		text: "#ffffff",
		lightColor: "#8B7E74",
		darkColor: "#7C6F65",
		subMoods: [SubMoodType.BORED, SubMoodType.BUSY, SubMoodType.STRESSED, SubMoodType.TIRED],
	},
	[MoodType.SURPRISED]: {
		gradient: ["#6D9886", "#5E8977"],
		text: "#ffffff",
		lightColor: "#6D9886",
		darkColor: "#5E8977",
		subMoods: [
			SubMoodType.STARTLED,
			SubMoodType.CONFUSED,
			SubMoodType.AMAZED,
			SubMoodType.EXCITED,
		],
	},
	[MoodType.FEARFUL]: {
		gradient: ["#E86A33", "#D95C25"],
		text: "#ffffff",
		lightColor: "#E86A33",
		darkColor: "#D95C25",
		subMoods: [
			SubMoodType.SCARED,
			SubMoodType.ANXIOUS,
			SubMoodType.INSECURE,
			SubMoodType.WEAK,
			SubMoodType.REJECTED,
			SubMoodType.THREATENED,
		],
	},
	[MoodType.ANGRY]: {
		gradient: ["#D21312", "#C30404"],
		text: "#ffffff",
		lightColor: "#D21312",
		darkColor: "#C30404",
		subMoods: [
			SubMoodType.DISTANT,
			SubMoodType.CRITICAL,
			SubMoodType.FRUSTRATED,
			SubMoodType.MAD,
			SubMoodType.AGGRESSIVE,
			SubMoodType.HOSTILE,
			SubMoodType.INFURIATED,
		],
	},
	[MoodType.DISGUSTED]: {
		gradient: ["#7A316F", "#6B2260"],
		text: "#ffffff",
		lightColor: "#7A316F",
		darkColor: "#6B2260",
		subMoods: [
			SubMoodType.DISAPPROVING,
			SubMoodType.DISAPPOINTED,
			SubMoodType.AWFUL,
			SubMoodType.REPELLED,
		],
	},
	[MoodType.SAD]: {
		gradient: ["#537188", "#446177"],
		text: "#ffffff",
		lightColor: "#537188",
		darkColor: "#446177",
		subMoods: [
			SubMoodType.LONELY,
			SubMoodType.VULNERABLE,
			SubMoodType.DESPAIR,
			SubMoodType.GUILTY,
			SubMoodType.DEPRESSED,
			SubMoodType.HURT,
			SubMoodType.INFERIOR,
		],
	},
};

export const SUB_MOOD_EMOJIS: Record<SubMoodType, string> = {
	// Happy
	[SubMoodType.PLAYFUL]: "🎮",
	[SubMoodType.CONTENT]: "☺️",
	[SubMoodType.INTERESTED]: "🤔",
	[SubMoodType.PROUD]: "🦚",
	[SubMoodType.ACCEPTED]: "🤝",
	[SubMoodType.POWERFUL]: "💪",
	[SubMoodType.PEACEFUL]: "🕊️",
	[SubMoodType.TRUSTING]: "🤗",
	[SubMoodType.OPTIMISTIC]: "🌟",

	// Bad
	[SubMoodType.BORED]: "🥱",
	[SubMoodType.BUSY]: "⏰",
	[SubMoodType.STRESSED]: "😫",
	[SubMoodType.TIRED]: "😴",

	// Surprised
	[SubMoodType.STARTLED]: "😱",
	[SubMoodType.CONFUSED]: "😕",
	[SubMoodType.AMAZED]: "🤩",
	[SubMoodType.EXCITED]: "🎉",

	// Fearful
	[SubMoodType.SCARED]: "��",
	[SubMoodType.ANXIOUS]: "😰",
	[SubMoodType.INSECURE]: "🥺",
	[SubMoodType.WEAK]: "🌱",
	[SubMoodType.REJECTED]: "💔",
	[SubMoodType.THREATENED]: "⚠️",

	// Angry
	[SubMoodType.DISTANT]: "🏃",
	[SubMoodType.CRITICAL]: "🔍",
	[SubMoodType.FRUSTRATED]: "😤",
	[SubMoodType.MAD]: "😠",
	[SubMoodType.AGGRESSIVE]: "👊",
	[SubMoodType.HOSTILE]: "⚔️",
	[SubMoodType.INFURIATED]: "🤬",

	// Disgusted
	[SubMoodType.DISAPPROVING]: "👎",
	[SubMoodType.DISAPPOINTED]: "😞",
	[SubMoodType.AWFUL]: "🤮",
	[SubMoodType.REPELLED]: "🙅",

	// Sad
	[SubMoodType.LONELY]: "🕊️",
	[SubMoodType.VULNERABLE]: "🥀",
	[SubMoodType.DESPAIR]: "😭",
	[SubMoodType.GUILTY]: "😣",
	[SubMoodType.DEPRESSED]: "⛈️",
	[SubMoodType.HURT]: "💔",
	[SubMoodType.INFERIOR]: "🐛",
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
	return mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
};

export const getSubMoodName = (subMood: SubMoodType): string => {
	return subMood.charAt(0).toUpperCase() + subMood.slice(1).toLowerCase();
};

export const getSubMoodsForMood = (mood: MoodType): SubMoodType[] => {
	return MOOD_STYLES[mood].subMoods;
};
