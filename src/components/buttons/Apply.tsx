import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


const ApplyButton = ({ onPress, isActiveButton, text, style }) => {
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
        backgroundColor: '#06C149',
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
        backgroundColor: '#0E9E42',
        width: '90%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    }
});

export default ApplyButton;