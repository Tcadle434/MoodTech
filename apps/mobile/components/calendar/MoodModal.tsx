import React, { useRef } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Modal,
	ScrollView,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	GestureResponderEvent,
} from "react-native";
import { Text, Button, Input } from "@ui-kitten/components";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import { MoodType, SubMoodType } from "shared";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MoodModalProps } from "@/types/calendar";
import { HealthDataDisplay } from "@/components/HealthDataDisplay";
import {
	MOOD_METADATA,
	getMoodColor,
	getSubMoodName,
	SUB_MOOD_EMOJIS,
} from "@/constants/MoodConstants";

const MoodButton = ({
	mood,
	isSelected,
	onPress,
}: {
	mood: MoodType;
	isSelected: boolean;
	onPress: () => void;
}) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const currentScheme = scheme ?? "light";

	return (
		<TouchableOpacity
			style={[
				styles.moodButton,
				{
					borderColor: isSelected ? getMoodColor(mood, currentScheme) : colors.subtle,
					backgroundColor: isSelected
						? `${getMoodColor(mood, currentScheme)}20`
						: undefined,
				},
				isSelected && styles.selectedMoodButton,
			]}
			activeOpacity={0.7}
			onPress={onPress}
		>
			<Text style={styles.moodButtonEmoji}>{MOOD_METADATA[mood].emoji}</Text>
			<Text style={{ color: colors.text }}>{MOOD_METADATA[mood].name}</Text>
		</TouchableOpacity>
	);
};

const SubMoodButton = ({
	subMood,
	isSelected,
	onPress,
}: {
	subMood: SubMoodType;
	isSelected: boolean;
	onPress: () => void;
}) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];

	return (
		<TouchableOpacity
			style={[
				styles.subMoodButton,
				{
					borderColor: isSelected ? colors.border : colors.subtle,
					backgroundColor: isSelected ? `${colors.border}20` : undefined,
				},
				isSelected && styles.selectedSubMoodButton,
			]}
			activeOpacity={0.7}
			onPress={onPress}
		>
			<Text style={styles.subMoodButtonEmoji}>{SUB_MOOD_EMOJIS[subMood]}</Text>
			<Text style={{ color: colors.text }}>{getSubMoodName(subMood)}</Text>
		</TouchableOpacity>
	);
};

export const MoodModal = ({
	visible,
	onClose,
	selectedDate,
	viewMode,
	selectedMood,
	selectedSubMood,
	note,
	onSave,
	onMoodSelect,
	onSubMoodSelect,
	onNoteChange,
}: MoodModalProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const scrollViewRef = useRef<ScrollView>(null);

	const renderSubMoodButtons = () => {
		if (!selectedMood) return null;

		const subMoods = MOOD_METADATA[selectedMood].subMoods;
		return (
			<View style={styles.subMoodSection}>
				<Text category="h6" style={[styles.subMoodTitle, { color: colors.text }]}>
					More specifically...
				</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.subMoodScrollContent}
				>
					{subMoods.map((subMood) => (
						<SubMoodButton
							key={subMood}
							subMood={subMood}
							isSelected={selectedSubMood === subMood}
							onPress={() => onSubMoodSelect(subMood)}
						/>
					))}
				</ScrollView>
			</View>
		);
	};

	const renderMoodButtons = () => {
		return Object.values(MoodType).map((mood) => (
			<MoodButton
				key={mood}
				mood={mood}
				isSelected={selectedMood === mood}
				onPress={() => onMoodSelect(mood)}
			/>
		));
	};

	const dismissKeyboard = () => {
		Keyboard.dismiss();
	};

	// This function handles touch events and only dismisses keyboard
	// without interfering with scrolling
	const handleContentPress = (event: GestureResponderEvent) => {
		// Only dismiss keyboard, don't prevent event propagation
		dismissKeyboard();
	};

	return (
		<Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
			<BlurView
				intensity={30}
				tint={(scheme ?? "light") === "dark" ? "dark" : "light"}
				style={styles.modalOverlay}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardAvoidingView}
				>
					<View
						style={[
							styles.modalContent,
							{
								backgroundColor: colors.surface,
								shadowColor: colors.text,
							},
						]}
					>
						<View style={[styles.modalHandle, { backgroundColor: colors.subtle }]} />

						{selectedDate && (
							<Text category="h5" style={[styles.modalDate, { color: colors.text }]}>
								{format(selectedDate, "MMMM d, yyyy")}
							</Text>
						)}

						{viewMode === "view" ? (
							<ScrollView
								style={styles.scrollView}
								contentContainerStyle={styles.scrollViewContent}
								showsVerticalScrollIndicator={false}
							>
								<View
									style={[
										styles.moodDetails,
										{ backgroundColor: colors.background },
									]}
								>
									<LinearGradient
										colors={
											MOOD_METADATA[selectedMood || MoodType.HAPPY].gradient
										}
										style={styles.moodDetailGradient}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}
									>
										<Text style={styles.moodEmoji}>
											{selectedMood ? MOOD_METADATA[selectedMood].emoji : ""}
										</Text>
										<Text category="h6" style={styles.moodDetailTitle}>
											{selectedMood ? MOOD_METADATA[selectedMood].name : ""}
										</Text>

										{note ? (
											<>
												<View style={styles.noteDivider} />
												<Text style={styles.moodNote}>{note}</Text>
											</>
										) : null}
									</LinearGradient>
								</View>

								{selectedDate && <HealthDataDisplay date={selectedDate} />}

								<Button
									style={styles.modalButton}
									status="primary"
									onPress={onClose}
								>
									Close
								</Button>
							</ScrollView>
						) : (
							<ScrollView
								ref={scrollViewRef}
								style={styles.scrollView}
								contentContainerStyle={styles.scrollViewContent}
								showsVerticalScrollIndicator={false}
								keyboardShouldPersistTaps="handled"
								onScrollBeginDrag={dismissKeyboard}
							>
								<View
									style={styles.scrollContent}
									onStartShouldSetResponder={() => false}
									onMoveShouldSetResponder={() => false}
									onResponderRelease={handleContentPress}
								>
									<Text
										category="h5"
										style={[styles.modalTitle, { color: colors.text }]}
									>
										How are you feeling?
									</Text>

									<View style={styles.moodButtonRow}>{renderMoodButtons()}</View>

									{selectedMood && renderSubMoodButtons()}

									{selectedDate && <HealthDataDisplay date={selectedDate} />}

									<Input
										multiline
										textStyle={{ minHeight: 100, color: colors.text }}
										placeholder="Any notes about your day? (optional)"
										placeholderTextColor={colors.textSecondary}
										value={note}
										onChangeText={onNoteChange}
										style={styles.noteInput}
										onFocus={() => {
											// Scroll to input when focused
											setTimeout(() => {
												scrollViewRef.current?.scrollToEnd({
													animated: true,
												});
											}, 100);
										}}
									/>

									<Button
										onPress={onSave}
										style={styles.saveButton}
										status="primary"
										disabled={!selectedMood}
									>
										Save
									</Button>

									<Button appearance="ghost" status="basic" onPress={onClose}>
										Cancel
									</Button>
								</View>
							</ScrollView>
						)}
					</View>
				</KeyboardAvoidingView>
			</BlurView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
		zIndex: 1000,
	},
	keyboardAvoidingView: {
		flex: 1,
		justifyContent: "flex-end",
	},
	modalContent: {
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		padding: 24,
		paddingTop: 16,
		alignItems: "center",
		minHeight: 320,
		maxHeight: "90%",
		shadowOffset: { width: 0, height: -8 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 10,
	},
	scrollView: {
		width: "100%",
	},
	scrollViewContent: {
		flexGrow: 1,
		alignItems: "center",
		paddingBottom: 20,
	},
	modalHandle: {
		width: 40,
		height: 5,
		borderRadius: 3,
		marginBottom: 24,
	},
	modalDate: {
		marginBottom: 12,
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
		opacity: 0.7,
	},
	modalTitle: {
		marginBottom: 24,
		fontSize: 24,
		fontWeight: "600",
		textAlign: "center",
	},
	moodButtonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
		width: "100%",
		marginBottom: 24,
		gap: 6,
	},
	moodButton: {
		padding: 4,
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 16,
		width: "30%",
	},
	subMoodSection: {
		width: "100%",
		marginBottom: 24,
	},
	subMoodTitle: {
		marginBottom: 16,
		fontSize: 18,
		fontWeight: "600",
	},
	subMoodScrollContent: {
		paddingHorizontal: 4,
		gap: 12,
	},
	subMoodButton: {
		padding: 12,
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 12,
		minWidth: 100,
	},
	selectedSubMoodButton: {
		borderWidth: 2,
	},
	subMoodButtonEmoji: {
		fontSize: 24,
		marginBottom: 6,
	},
	selectedMoodButton: {
		borderWidth: 2,
	},
	moodButtonEmoji: {
		fontSize: 32,
		marginBottom: 8,
	},
	noteInput: {
		width: "100%",
		marginBottom: 12,
		borderRadius: 16,
	},
	saveButton: {
		width: "100%",
		marginBottom: 12,
		borderRadius: 16,
		height: 56,
	},
	moodDetails: {
		alignItems: "center",
		marginBottom: 30,
		width: "100%",
		borderRadius: 20,
		overflow: "hidden",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.15,
		shadowRadius: 10,
		elevation: 6,
	},
	moodDetailGradient: {
		alignItems: "center",
		width: "100%",
		padding: 24,
	},
	moodEmoji: {
		fontSize: 60,
		marginBottom: 16,
		color: "#FFFFFF",
	},
	moodDetailTitle: {
		marginBottom: 8,
		fontSize: 22,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	noteDivider: {
		height: 1,
		width: "80%",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		marginBottom: 16,
	},
	moodNote: {
		color: "rgba(255, 255, 255, 0.9)",
		fontStyle: "italic",
		lineHeight: 20,
	},
	modalButton: {
		marginTop: 8,
		width: "100%",
	},
	subMoodDetailText: {
		fontSize: 18,
		color: "rgba(255, 255, 255, 0.9)",
		marginBottom: 16,
	},
	scrollContent: {
		width: "100%",
		alignItems: "center",
	},
});
