import React from "react";
import { StyleSheet, View, Text, ViewStyle, TouchableOpacity, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MoodType, SubMoodType } from "shared";
import { MOOD_METADATA, SUB_MOOD_EMOJIS, getSubMoodName } from "@/constants/MoodConstants";
import { HealthDataDisplay } from "@/components/HealthDataDisplay";
import { Feather } from "@expo/vector-icons";

type MoodCardProps = {
	mood: MoodType;
	subMood?: SubMoodType;
	note?: string;
	date: Date;
	shadowColor?: string;
	style?: ViewStyle;
	onEdit?: () => void;
};

export const MoodCard = ({
	mood,
	subMood,
	note,
	date,
	shadowColor = "#000000",
	style,
	onEdit,
}: MoodCardProps) => {
	// Create derived styling based on the mood
	const moodDarkColor = MOOD_METADATA[mood].darkColor;

	// Generate semi-transparent colors for UI elements
	const iconBackground = `${moodDarkColor}40`; // 25% opacity
	const dividerColor = `${MOOD_METADATA[mood].text}30`; // 30% opacity of text color
	const stepsBackground = `${moodDarkColor}80`; // 50% opacity
	const stepsBorderColor = `${MOOD_METADATA[mood].text}20`; // 20% opacity of text color

	return (
		<Pressable
			style={({ pressed }) => [
				styles.cardContainer,
				{ shadowColor },
				pressed && styles.cardPressed,
				style,
			]}
			onPress={onEdit}
		>
			<View style={styles.card}>
				{/* Background */}
				<View style={styles.cardBackground}>
					<LinearGradient
						colors={MOOD_METADATA[mood].gradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.gradient}
					/>
				</View>

				{/* Edit button */}
				<TouchableOpacity
					style={[styles.editButton, { backgroundColor: iconBackground }]}
					onPress={onEdit}
				>
					<Feather name="edit-2" size={16} color={MOOD_METADATA[mood].text} />
				</TouchableOpacity>

				{/* Content container */}
				<View style={styles.contentContainer}>
					{/* Main mood section */}
					<View style={styles.moodSection}>
						<View style={[styles.emojiContainer, { backgroundColor: iconBackground }]}>
							<Text style={styles.emojiText}>{MOOD_METADATA[mood].emoji}</Text>
						</View>
						<View style={styles.moodTextContainer}>
							<Text style={[styles.moodTitle, { color: MOOD_METADATA[mood].text }]}>
								{MOOD_METADATA[mood].name}
							</Text>
						</View>
					</View>

					{/* Divider */}
					<View style={[styles.divider, { backgroundColor: dividerColor }]} />

					{/* Details container */}
					<View style={styles.detailsContainer}>
						{/* Submood section */}
						{subMood && (
							<View style={styles.detailRow}>
								<View style={styles.labelContainer}>
									<Feather
										name="search"
										size={14}
										color={`${MOOD_METADATA[mood].text}80`}
										style={styles.labelIcon}
									/>
									<Text
										style={[
											styles.detailLabel,
											{ color: `${MOOD_METADATA[mood].text}80` },
										]}
									>
										Sub-mood
									</Text>
								</View>

								<View style={styles.valueContainer}>
									<Text style={styles.subMoodEmoji}>
										{SUB_MOOD_EMOJIS[subMood]}
									</Text>
									<Text
										style={[
											styles.subMoodText,
											{ color: MOOD_METADATA[mood].text },
										]}
									>
										{getSubMoodName(subMood)}
									</Text>
								</View>
							</View>
						)}

						{/* Note section */}
						<View style={styles.detailRow}>
							<View style={styles.labelContainer}>
								<Feather
									name="file-text"
									size={14}
									color={`${MOOD_METADATA[mood].text}80`}
									style={styles.labelIcon}
								/>
								<Text
									style={[
										styles.detailLabel,
										{ color: `${MOOD_METADATA[mood].text}80` },
									]}
								>
									Note
								</Text>
							</View>

							<View style={styles.valueContainer}>
								<Text
									style={[styles.noteText, { color: MOOD_METADATA[mood].text }]}
									numberOfLines={2}
								>
									{note || "No note added"}
								</Text>
							</View>
						</View>
					</View>

					{/* Steps section */}
					<View
						style={[
							styles.stepsContainer,
							{
								backgroundColor: stepsBackground,
								borderTopColor: stepsBorderColor,
							},
						]}
					>
						<View style={styles.stepsRow}>
							<View style={styles.stepsLabelContainer}>
								<Feather
									name="activity"
									size={14}
									color={`${MOOD_METADATA[mood].text}80`}
									style={styles.labelIcon}
								/>
								<Text
									style={[
										styles.detailLabel,
										{ color: `${MOOD_METADATA[mood].text}80` },
									]}
								>
									Steps
								</Text>
							</View>

							<HealthDataDisplay
								date={date}
								style={{
									...styles.healthData,
									backgroundColor: "transparent",
								}}
								textColor={`${MOOD_METADATA[mood].text}80`}
							/>
						</View>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	cardContainer: {
		width: "90%",
		alignSelf: "center",
		borderRadius: 12,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
		overflow: "hidden",
	},
	cardPressed: {
		transform: [{ scale: 0.98 }],
	},
	card: {
		position: "relative",
		overflow: "hidden",
	},
	cardBackground: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	gradient: {
		height: "100%",
		width: "100%",
	},
	editButton: {
		position: "absolute",
		top: 12,
		right: 12,
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 10,
	},
	contentContainer: {
		padding: 16,
	},
	moodSection: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	emojiContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	emojiText: {
		fontSize: 28,
	},
	moodTextContainer: {
		flex: 1,
	},
	moodTitle: {
		fontSize: 20,
		fontWeight: "700",
	},
	divider: {
		height: 1,
		width: "100%",
		marginBottom: 16,
	},
	detailsContainer: {
		marginBottom: 16,
	},
	detailRow: {
		flexDirection: "row",
		marginBottom: 16,
		justifyContent: "space-between",
		alignItems: "center",
	},
	labelContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "30%",
	},
	labelIcon: {
		marginRight: 6,
	},
	detailLabel: {
		fontSize: 15,
		fontWeight: "500",
	},
	valueContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "68%",
		justifyContent: "flex-end",
	},
	subMoodEmoji: {
		fontSize: 18,
		marginRight: 8,
	},
	subMoodText: {
		fontSize: 16,
		fontWeight: "500",
	},
	noteText: {
		fontSize: 16,
		textAlign: "right",
		lineHeight: 20,
	},
	stepsContainer: {
		marginHorizontal: -16,
		marginBottom: -16,
		padding: 16,
		borderTopWidth: 1,
	},
	stepsRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	stepsLabelContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	stepsIconContainer: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	healthData: {
		padding: 0,
		margin: 0,
		alignItems: "flex-end",
		flex: 1,
	},
});
