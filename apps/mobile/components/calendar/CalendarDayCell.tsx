import React from "react";
import { StyleProp, ViewStyle, TextStyle } from "react-native";
import { CalendarDayCellProps } from "@/types/calendar";
import { DayCell } from "./DayCell";

export const CalendarDayCell = ({ date, style, moodEntries, ...props }: CalendarDayCellProps) => {
	const transformedStyle:
		| { container?: StyleProp<ViewStyle>; text?: StyleProp<TextStyle> }
		| undefined = style
		? {
				container: style as StyleProp<ViewStyle>,
				text: {} as StyleProp<TextStyle>, // Empty text style as UI Kitten handles text styling
			}
		: undefined;

	return <DayCell date={date} style={transformedStyle} moodEntries={moodEntries} {...props} />;
};
