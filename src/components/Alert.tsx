import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

interface AlertProps {
    message: string;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [scaleAnim]);

    const animatedStyle = {
        transform: [
            {
                scaleX: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 1],
                }),
            },
        ],
    };

    setTimeout(() => onClose(), 4500)

    return (
        <View style={styles.overlay}>
            <Animated.View style={[styles.alertBox, animatedStyle]}>
                <Text style={styles.message}>{message}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2000,
    },
    alertBox: {
        width: '90%',
        minHeight: 60,
        backgroundColor: '#1F222A',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: 1,
    },
    message: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Outfit',
    },
});

export default Alert;
