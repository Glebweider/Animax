import React from 'react';
import globalStyles from '@Styles/index';
import { StyleSheet, View, TouchableOpacity, Text, ViewStyle, StyleProp } from 'react-native';

// Data
import { COLOR_PRIMARY_DARK } from '@Data/constants';


interface AuthRedirectProps {
    text: string;
    clicableText: string;
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
}

const AuthRedirect = ({ text, clicableText, style, onPress }: AuthRedirectProps) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity
                onPress={onPress}>
                <Text style={styles.clicableText}>{clicableText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...globalStyles.AuthTitleContainer,
        flexDirection: 'row'
    },
    text: {
        ...globalStyles.TextPrimary,
        fontSize: 12,
        fontWeight: '100'
    },
    clicableText: {
        color: COLOR_PRIMARY_DARK,
        fontSize: 12,
        fontFamily: 'Outfit',
        marginLeft: 10
    }
});

export default AuthRedirect;