import React, { useState, useMemo } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Image,
	ScrollView,
	Dimensions,
} from "react-native";
import { Text, Button, Tab, TabBar } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { AvatarOption, AVATAR_OPTIONS, getAvatarsByCategory } from "@/constants/AvatarConstants";

interface AvatarSelectorProps {
	selectedAvatarId: string | null;
	onSelectAvatar: (avatarId: string) => void;
	onClose: () => void;
}

export const AvatarSelector = ({
	selectedAvatarId,
	onSelectAvatar,
	onClose,
}: AvatarSelectorProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const [selectedCategory, setSelectedCategory] = useState<number>(0);
	const [selectedId, setSelectedId] = useState<string | null>(selectedAvatarId);

	const categories = [
		{ title: "Male", value: ["male", "boy"] },
		{ title: "Female", value: ["female", "girl"] },
	];

	const displayAvatars = useMemo(() => {
		// Guard against undefined category
		if (selectedCategory === undefined || !categories[selectedCategory]) {
			return AVATAR_OPTIONS;
		}

		const categoryValues = categories[selectedCategory].value;
		if (Array.isArray(categoryValues)) {
			// Combine multiple categories
			return AVATAR_OPTIONS.filter((avatar) =>
				categoryValues.includes(avatar.category as string)
			);
		}
		// Single category (shouldn't reach here with current setup)
		return getAvatarsByCategory(categoryValues as AvatarOption["category"]);
	}, [selectedCategory]);

	const handleSelectAvatar = (id: string) => {
		setSelectedId(id);
	};

	const handleConfirmSelection = () => {
		if (selectedId) {
			onSelectAvatar(selectedId);
			onClose();
		}
	};

	const windowWidth = Dimensions.get("window").width;
	const itemWidth = (windowWidth - 48 - 20) / 3; // 3 items per row with 48px padding and 20px margin

	return (
		<View style={styles.container}>
			<Text category="h5" style={[styles.title, { color: colors.text }]}>
				Choose an Avatar
			</Text>

			<TabBar
				selectedIndex={selectedCategory}
				onSelect={setSelectedCategory}
				style={[styles.tabBar, { backgroundColor: colors.surface }]}
			>
				{categories.map((category) => (
					<Tab
						key={
							typeof category.value === "string"
								? category.value
								: category.value.join("-")
						}
						title={(props) => (
							<Text
								{...props}
								style={[
									props?.style,
									{
										color:
											selectedCategory ===
											categories.findIndex((c) => c.title === category.title)
												? colors.tertiary
												: colors.textSecondary,
									},
								]}
							>
								{category.title}
							</Text>
						)}
					/>
				))}
			</TabBar>

			<FlatList
				data={displayAvatars}
				keyExtractor={(item) => item.id}
				numColumns={3}
				contentContainerStyle={styles.gridContainer}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={[
							styles.avatarItem,
							{
								width: itemWidth,
								backgroundColor:
									selectedId === item.id
										? `${colors.tertiary}30`
										: colors.surface,
								borderColor:
									selectedId === item.id ? colors.tertiary : colors.border,
							},
						]}
						onPress={() => handleSelectAvatar(item.id)}
					>
						<Image source={item.source} style={styles.avatarImage} />
					</TouchableOpacity>
				)}
			/>

			<View style={styles.buttonsContainer}>
				<Button
					style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
					appearance="outline"
					status="basic"
					onPress={onClose}
				>
					Cancel
				</Button>
				<Button
					style={styles.button}
					onPress={handleConfirmSelection}
					disabled={!selectedId}
				>
					Confirm
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 24,
		flex: 1,
	},
	title: {
		marginBottom: 24,
		textAlign: "center",
	},
	tabBar: {
		marginBottom: 20,
		borderRadius: 8,
	},
	gridContainer: {
		paddingBottom: 20,
	},
	avatarItem: {
		margin: 6,
		height: 100,
		borderRadius: 12,
		padding: 8,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
	},
	avatarImage: {
		width: 60,
		height: 60,
		borderRadius: 30,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
	},
	button: {
		flex: 1,
		marginHorizontal: 8,
	},
	cancelButton: {
		backgroundColor: "transparent",
	},
});
