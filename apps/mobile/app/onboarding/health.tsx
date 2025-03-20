import React, { useState } from "react";
import { StyleSheet, View, Switch, Image } from "react-native";
import { Text } from "@ui-kitten/components";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { useCompleteOnboarding } from "@/hooks/useCompleteOnboarding";
import { userService } from "@/api/userService";

export default function HealthScreen() {
	const { user, updateUser } = useAuth();
	const queryClient = useQueryClient();
	const { skipAllOnboarding } = useCompleteOnboarding();

	const [healthSettings, setHealthSettings] = useState({
		sleep: false,
		steps: false,
		heartRate: false,
	});

	// Update health settings mutation
	const updateHealthSettings = useMutation({
		mutationFn: async (settings: any) => {
			if (!user?.id) throw new Error("User ID not found");
			return userService.updateHealthSettings(user.id, settings);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

	const handleToggle = (setting: keyof typeof healthSettings) => {
		const newSettings = {
			...healthSettings,
			[setting]: !healthSettings[setting],
		};

		setHealthSettings(newSettings);
		updateHealthSettings.mutate(newSettings);
	};

	return (
		<OnboardingScreen
			title="Health Integration"
			description="Connect your health data to gain deeper insights about how your daily activity affects your mood."
			nextScreenPath="/onboarding/complete"
			onSkipAll={skipAllOnboarding}
		>
			<View style={styles.container}>
				<Image
					source={require("@/assets/images/health-integration.png")}
					style={styles.image}
					resizeMode="contain"
				/>

				<View style={styles.optionsContainer}>
					<SettingItem
						title="Sleep Data"
						description="Track how your sleep affects your mood"
						value={healthSettings.sleep}
						onToggle={() => handleToggle("sleep")}
					/>

					<SettingItem
						title="Step Count"
						description="See how physical activity impacts how you feel"
						value={healthSettings.steps}
						onToggle={() => handleToggle("steps")}
					/>

					<SettingItem
						title="Heart Rate"
						description="Monitor how your heart rate correlates with mood changes"
						value={healthSettings.heartRate}
						onToggle={() => handleToggle("heartRate")}
					/>
				</View>
			</View>
		</OnboardingScreen>
	);
}

interface SettingItemProps {
	title: string;
	description: string;
	value: boolean;
	onToggle: () => void;
}

function SettingItem({ title, description, value, onToggle }: SettingItemProps) {
	return (
		<View style={styles.settingItem}>
			<View style={styles.settingTextContainer}>
				<Text category="h6">{title}</Text>
				<Text category="p2" appearance="hint">
					{description}
				</Text>
			</View>
			<Switch
				value={value}
				onValueChange={onToggle}
				trackColor={{ false: "#767577", true: "#81b0ff" }}
				thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		alignItems: "center",
	},
	image: {
		width: "80%",
		height: 150,
		marginVertical: 20,
	},
	optionsContainer: {
		width: "100%",
		marginTop: 20,
	},
	settingItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#e1e1e1",
	},
	settingTextContainer: {
		flex: 1,
		marginRight: 10,
	},
});
