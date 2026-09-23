import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, Pattern, Line, Rect } from 'react-native-svg';

import { useThemeContext } from '@/context/ThemeProvider';

interface LinedPaperProps {
    /** Distance between rules, in px. */
    spacing?: number;
    /** Paper colour behind the rules. */
    backgroundColor: string;
    style?: ViewStyle;
}

/**
 * Ruled-paper background for note cards.
 *
 * Draws the rules as a single tiled SVG `<Pattern>`. The previous version
 * mapped over `Array.from({ length: 20 })` and rendered 20 separate `<Svg>`
 * elements per card, so a list of 30 notes mounted 600 native SVG views.
 */
const LinedPaper: React.FC<LinedPaperProps> = ({ spacing = 24, backgroundColor, style }) => {
    const { theme } = useThemeContext();
    const stroke = theme === 'light' ? 'rgba(8, 8, 9, 0.1)' : 'rgba(162, 160, 160, 0.5)';

    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor }, style]} pointerEvents="none">
            <Svg width="100%" height="100%">
                <Defs>
                    <Pattern
                        id="rules"
                        width="100%"
                        height={spacing}
                        patternUnits="userSpaceOnUse"
                    >
                        <Line
                            x1="0"
                            y1={spacing - 1}
                            x2="100%"
                            y2={spacing - 1}
                            stroke={stroke}
                            strokeWidth="1"
                        />
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#rules)" />
            </Svg>
        </View>
    );
};

export default LinedPaper;
