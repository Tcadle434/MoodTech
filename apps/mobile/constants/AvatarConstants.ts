import { ImageSourcePropType } from "react-native";

export interface AvatarOption {
	id: string;
	name: string;
	source: ImageSourcePropType;
	category: "male" | "female" | "boy" | "girl";
}

export const AVATAR_OPTIONS: AvatarOption[] = [
	// Male avatars
	{
		id: "man",
		name: "Default Man",
		source: require("@/assets/avatars/man.png"),
		category: "male",
	},
	{
		id: "man1",
		name: "Business Man",
		source: require("@/assets/avatars/man1.png"),
		category: "male",
	},
	{
		id: "man2",
		name: "Modern Man",
		source: require("@/assets/avatars/man2.png"),
		category: "male",
	},
	{
		id: "man3",
		name: "Casual Man",
		source: require("@/assets/avatars/man3.png"),
		category: "male",
	},
	{
		id: "man4",
		name: "Professional Man",
		source: require("@/assets/avatars/man4.png"),
		category: "male",
	},
	{
		id: "man5",
		name: "Stylish Man",
		source: require("@/assets/avatars/man5.png"),
		category: "male",
	},
	{
		id: "man6",
		name: "Creative Man",
		source: require("@/assets/avatars/man6.png"),
		category: "male",
	},
	{
		id: "man7",
		name: "Athletic Man",
		source: require("@/assets/avatars/man7.png"),
		category: "male",
	},
	{
		id: "man8",
		name: "Casual Man 2",
		source: require("@/assets/avatars/man8.png"),
		category: "male",
	},
	{
		id: "man9",
		name: "Relaxed Man",
		source: require("@/assets/avatars/man9.png"),
		category: "male",
	},
	{
		id: "man10",
		name: "Confident Man",
		source: require("@/assets/avatars/man10.png"),
		category: "male",
	},
	{
		id: "man11",
		name: "Trendy Man",
		source: require("@/assets/avatars/man11.png"),
		category: "male",
	},

	// Female avatars
	{
		id: "woman",
		name: "Default Woman",
		source: require("@/assets/avatars/woman.png"),
		category: "female",
	},
	{
		id: "woman1",
		name: "Professional Woman",
		source: require("@/assets/avatars/woman1.png"),
		category: "female",
	},
	{
		id: "woman2",
		name: "Modern Woman",
		source: require("@/assets/avatars/woman2.png"),
		category: "female",
	},
	{
		id: "woman3",
		name: "Casual Woman",
		source: require("@/assets/avatars/woman3.png"),
		category: "female",
	},
	{
		id: "woman4",
		name: "Stylish Woman",
		source: require("@/assets/avatars/woman4.png"),
		category: "female",
	},
	{
		id: "woman5",
		name: "Creative Woman",
		source: require("@/assets/avatars/woman5.png"),
		category: "female",
	},
	{
		id: "woman6",
		name: "Confident Woman",
		source: require("@/assets/avatars/woman6.png"),
		category: "female",
	},
	{
		id: "woman7",
		name: "Athletic Woman",
		source: require("@/assets/avatars/woman7.png"),
		category: "female",
	},
	{
		id: "woman8",
		name: "Elegant Woman",
		source: require("@/assets/avatars/woman8.png"),
		category: "female",
	},
	{
		id: "woman9",
		name: "Smart Woman",
		source: require("@/assets/avatars/woman9.png"),
		category: "female",
	},
	{
		id: "woman10",
		name: "Trendy Woman",
		source: require("@/assets/avatars/woman10.png"),
		category: "female",
	},
	{
		id: "woman11",
		name: "Relaxed Woman",
		source: require("@/assets/avatars/woman11.png"),
		category: "female",
	},
	{
		id: "woman12",
		name: "Friendly Woman",
		source: require("@/assets/avatars/woman12.png"),
		category: "female",
	},
	{
		id: "woman13",
		name: "Cheerful Woman",
		source: require("@/assets/avatars/woman13.png"),
		category: "female",
	},

	// Boy avatars
	{
		id: "boy",
		name: "Default Boy",
		source: require("@/assets/avatars/boy.png"),
		category: "boy",
	},
	{
		id: "boy1",
		name: "Young Boy",
		source: require("@/assets/avatars/boy1.png"),
		category: "boy",
	},
	{
		id: "boy2",
		name: "School Boy",
		source: require("@/assets/avatars/boy2.png"),
		category: "boy",
	},
	{
		id: "boy3",
		name: "Playful Boy",
		source: require("@/assets/avatars/boy3.png"),
		category: "boy",
	},

	// Girl avatars
	{
		id: "girl",
		name: "Default Girl",
		source: require("@/assets/avatars/girl.png"),
		category: "girl",
	},
	{
		id: "girl1",
		name: "Young Girl",
		source: require("@/assets/avatars/girl1.png"),
		category: "girl",
	},
	{
		id: "girl2",
		name: "School Girl",
		source: require("@/assets/avatars/girl2.png"),
		category: "girl",
	},
	{
		id: "girl3",
		name: "Playful Girl",
		source: require("@/assets/avatars/girl3.png"),
		category: "girl",
	},
	{
		id: "girl4",
		name: "Cheerful Girl",
		source: require("@/assets/avatars/girl4.png"),
		category: "girl",
	},
	{
		id: "girl5",
		name: "Friendly Girl",
		source: require("@/assets/avatars/girl5.png"),
		category: "girl",
	},
];

// Helper function to get avatar source by ID
export const getAvatarSourceById = (id: string | null): ImageSourcePropType => {
	if (!id) {
		return require("@/assets/images/icon.png"); // Default avatar if no ID provided
	}

	const avatar = AVATAR_OPTIONS.find((avatar) => avatar.id === id);
	return avatar ? avatar.source : require("@/assets/images/icon.png");
};

// Get avatars by category
export const getAvatarsByCategory = (category: AvatarOption["category"]) => {
	return AVATAR_OPTIONS.filter((avatar) => avatar.category === category);
};
