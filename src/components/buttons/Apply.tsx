import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

// Data
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK, COLOR_TEXT_PRIMARY } from '@Data/constants';


interface ApplyButtonProps {
    isActiveButton: boolean;
    text: string;
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
}

const ApplyButton = ({ isActiveButton, text, style, onPress }: ApplyButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isActiveButton}
            style={[
                isActiveButton ?
                    styles.containerButtonDisabled : styles.containerButton,
                style
            ]}>
            <Text style={styles.textButton}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    containerButton: {
        marginTop: 20,
        backgroundColor: COLOR_PRIMARY,
        width: '100%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8,
    },
    containerButtonDisabled: {
        marginTop: 20,
        backgroundColor: COLOR_PRIMARY_DARK,
        width: '100%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 15,
        fontFamily: 'Outfit',
    }
});

export default ApplyButton;