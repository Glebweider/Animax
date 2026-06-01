import React from 'react';
import { StyleSheet, View, Text } from 'react-native';


interface AuthDividerProps {
    text: string;
}

const AuthDivider = ({ text }: AuthDividerProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.text}>{text}</Text>
            <View style={styles.line} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#2D3037',
    },
    text: {
        marginHorizontal: 15,
        color: 'white',
        fontFamily: 'Outfit',
        fontSize: 16,
    }
});

export default AuthDivider;