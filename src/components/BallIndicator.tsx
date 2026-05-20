import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';


interface BallIndicatorProps {
    size?: number;
    color?: string;
    count?: number;
    style?: StyleProp<ViewStyle>;
}

export const BallIndicator: React.FC<BallIndicatorProps> = ({
    size = 40,
    color = '#000000',
    count = 8,
    style
}) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 1200, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const balls = Array.from({ length: count });
    const ballSize = size / 5;

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {balls.map((_, index) => {
                const angle = (index * 360) / count;

                const radius = (size - ballSize) / 2;
                const rad = (angle * Math.PI) / 180;
                const left = radius + radius * Math.cos(rad);
                const top = radius + radius * Math.sin(rad);

                const animatedStyle = useAnimatedStyle(() => {
                    const phase = (progress.value - index / count + 1) % 1;
                    const scale = 0.4 + 0.6 * (1 - phase);
                    const opacity = 0.2 + 0.8 * (1 - phase);

                    return {
                        transform: [{ scale }],
                        opacity,
                    };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.ball,
                            {
                                width: ballSize,
                                height: ballSize,
                                borderRadius: ballSize / 2,
                                backgroundColor: color,
                                left,
                                top,
                            },
                            animatedStyle,
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ball: {
        position: 'absolute',
    },
});