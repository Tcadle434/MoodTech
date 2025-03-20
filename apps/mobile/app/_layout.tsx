import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry, Layout, Spinner, Text } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/hooks/useColorScheme";
import { themes } from "@/theme/theme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Splash } from "@/components/Splash";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

// Root layout content that handles auth routing
function RootLayoutContent() {
	const { isAuthenticated, isLoading, user } = useAuth();

	// Don't render anything while we're checking auth status to avoid flashes of screens
	if (isLoading) {
		return <Splash />;
	}

	// If not authenticated, redirect to auth flow
	if (!isAuthenticated || !user) {
		return <Stack initialRouteName="(auth)/login" screenOptions={{ headerShown: false }} />;
	}

	// Check if the user needs to complete onboarding
	// The user type ensures hasCompletedOnboarding is always available
	if (!user.hasCompletedOnboarding) {
		return (
			<Stack initialRouteName="onboarding/welcome" screenOptions={{ headerShown: false }} />
		);
	}

	// User is authenticated and has completed onboarding, show main app
	return <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider
				{...eva}
				theme={colorScheme === "dark" ? themes.dark : themes.light}
				customMapping={require("../theme/mapping.json")}
			>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
						<AuthProvider>
							<GestureHandlerRootView style={{ flex: 1 }}>
								<RootLayoutContent />
								<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
							</GestureHandlerRootView>
						</AuthProvider>
					</ThemeProvider>
				</QueryClientProvider>
			</ApplicationProvider>
		</>
	);
}
