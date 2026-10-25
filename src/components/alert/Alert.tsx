import React, { useEffect, useRef } from 'react';
import globalStyles from '@Styles/index';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

// Data
import { COLOR_TEXT_PRIMARY } from '@Data/constants';


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
        zIndex: 2000
    },
    alertBox: {
        ...globalStyles.ModalPanel,
        width: '90%',
        minHeight: 60,
        borderRadius: 50,
        justifyContent: 'center',
        borderColor: COLOR_TEXT_PRIMARY,
        borderWidth: 1
    },
    message: {
        ...globalStyles.TextPrimary,
        fontSize: 16,
        textAlign: 'center'
    }
});

export default Alert;
