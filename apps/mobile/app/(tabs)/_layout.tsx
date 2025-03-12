import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Icon } from "@ui-kitten/components";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

//TODO: remove test tab

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: colors.tint,
					tabBarInactiveTintColor: colors.tabIconDefault,
					headerShown: false,
					tabBarButton: HapticTab,
					tabBarBackground: TabBarBackground,
					tabBarStyle: Platform.select({
						ios: {
							// Use a transparent background on iOS to show the blur effect
							position: "absolute",
							height: 88,
							borderTopWidth: 0,
							shadowColor: colors.text,
							shadowOffset: { width: 0, height: -2 },
							shadowOpacity: 0.05,
							shadowRadius: 8,
						},
						default: {
							height: 60,
							borderTopWidth: 0,
							elevation: 8,
						},
					}),
					tabBarLabelStyle: {
						fontWeight: "500",
						fontSize: 12,
					},
					tabBarIconStyle: {
						marginTop: 4,
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: "Today",
						tabBarIcon: ({ color }) => (
							<Icon
								name="home-outline"
								style={{ width: 24, height: 24, tintColor: color }}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="test"
					options={{
						title: "Test",
						tabBarIcon: ({ color }) => (
							<Icon
								name="flash-outline"
								style={{ width: 24, height: 24, tintColor: color }}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="calendar"
					options={{
						title: "History",
						tabBarIcon: ({ color }) => (
							<Icon
								name="calendar-outline"
								style={{ width: 24, height: 24, tintColor: color }}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						tabBarIcon: ({ color }) => (
							<Icon
								name="person-outline"
								style={{ width: 24, height: 24, tintColor: color }}
							/>
						),
					}}
				/>
			</Tabs>
		</>
	);
}
