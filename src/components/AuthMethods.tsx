import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';

// Data
import { COLOR_BACKGROUND_SECONDARY, COLOR_TEXT_PRIMARY } from '@Data/constants';
import { authMethods } from '@Data/authMethods';


interface AuthMethodsProps {
    vertical?: boolean;
}

const AuthMethods = ({ vertical }: AuthMethodsProps) => {
    return (
        <View style={[styles.container, vertical ? { height: '30%' } : { flexDirection: 'row' }]}>
            {authMethods.map((method) =>
                <TouchableOpacity
                    key={method.id}
                    onPress={method.onPress}
                    style={[styles.methodContainer, { width: vertical ? '90%' : 89 }]}>
                    <View style={vertical && styles.methodContent}>
                        <View style={vertical && { width: '20%' }}>
                            <Image
                                source={method.icon.image}
                                style={{
                                    width: method.icon.width,
                                    height: method.icon.height,
                                }} />
                        </View>
                        {vertical && <Text style={styles.methodText}>{method.text}</Text>}
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    methodContainer: {
        height: 60,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        borderRadius: 15,
        borderColor: '#2E3138',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    methodContent: {
        flexDirection: 'row',
        width: '62%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    methodText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 12
    },
});

export default AuthMethods;