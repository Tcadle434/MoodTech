import React, { ReactNode } from "react";
import { StyleSheet, View, SafeAreaView, Image, ImageSourcePropType } from "react-native";
import { Text, Button, Layout } from "@ui-kitten/components";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface OnboardingScreenProps {
	title: string;
	subTitle?: string;
	description: string;
	image?: ImageSourcePropType;
	nextScreenPath?: string;
	showSkipButton?: boolean;
	showSkipAllButton?: boolean;
	isLastScreen?: boolean;
	children?: ReactNode;
	onComplete?: () => void;
	onSkip?: () => void;
	onSkipAll?: () => void;
}

export const OnboardingScreen = ({
	title,
	subTitle,
	description,
	image,
	nextScreenPath,
	showSkipButton = true,
	isLastScreen = false,
	children,
	onComplete,
	onSkip,
}: OnboardingScreenProps) => {
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? "light"];
	const router = useRouter();

	const handleNext = () => {
		if (isLastScreen) {
			if (onComplete) {
				onComplete();
			}
		} else if (nextScreenPath) {
			router.push(nextScreenPath as any);
		}
	};

	const handleSkip = () => {
		if (onSkip) {
			onSkip();
		} else if (nextScreenPath) {
			router.push(nextScreenPath as any);
		}
	};

	return (
		<Layout style={[styles.container, { backgroundColor: colors.background }]}>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.content}>
					<View style={styles.header}>
						{image && (
							<Image source={image} style={styles.image} resizeMode="contain" />
						)}
						<Text category="h1" style={[styles.title, { color: colors.text }]}>
							{title}
						</Text>
						{subTitle && (
							<Text category="h4" style={[styles.subTitle, { color: colors.text }]}>
								{subTitle}
							</Text>
						)}
						<Text
							category="p1"
							style={[styles.description, { color: colors.textSecondary }]}
						>
							{description}
						</Text>
					</View>

					<View style={styles.mainContent}>{children}</View>

					<View style={styles.footer}>
						<Button onPress={handleNext} style={styles.nextButton}>
							{isLastScreen ? "Complete" : "Next"}
						</Button>

						{showSkipButton && !isLastScreen && (
							<Button
								appearance="ghost"
								onPress={handleSkip}
								style={styles.skipButton}
							>
								Skip
							</Button>
						)}
					</View>
				</View>
			</SafeAreaView>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: 24,
		justifyContent: "space-between",
	},
	header: {
		alignItems: "center",
		marginTop: 20,
	},
	image: {
		width: 150,
		height: 150,
	},
	title: {
		textAlign: "center",
		marginBottom: 32,
		fontWeight: "bold",
	},
	subTitle: {
		textAlign: "center",
		marginBottom: 24,
	},
	description: {
		textAlign: "center",
		marginBottom: 32,
		paddingHorizontal: 16,
		lineHeight: 22,
	},
	mainContent: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	footer: {
		marginTop: 32,
	},
	nextButton: {
		marginVertical: 8,
		borderRadius: 12,
	},
	skipButton: {
		marginBottom: 8,
	},
	skipAllButton: {
		marginTop: 16,
	},
});
