import React from 'react';
import globalStyles from '@Styles/index';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

// Data
import { COLOR_PRIMARY, COLOR_PRIMARY_DARK } from '@Data/constants';


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
        ...globalStyles.AuthTitleContainer,
        marginTop: 20,
        backgroundColor: COLOR_PRIMARY,
        height: 60,
        borderRadius: 50,
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8
    },
    containerButtonDisabled: {
        ...globalStyles.AuthTitleContainer,
        marginTop: 20,
        backgroundColor: COLOR_PRIMARY_DARK,
        height: 60,
        borderRadius: 50
    },
    textButton: {
        ...globalStyles.TextPrimary,
        fontSize: 15
    }
});

export default ApplyButton;