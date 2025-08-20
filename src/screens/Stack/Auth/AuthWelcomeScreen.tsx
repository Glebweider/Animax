import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';

// Components
import ApplyButton from '@Components/buttons/Apply';

const AuthWelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <Image source={require('../../../../assets/background.png')} style={styles.backgroundImage} />
            <LinearGradient
                colors={['rgba(24, 26, 32, 0)', 'rgba(24, 26, 32, 100)']}
                start={{ x: 0, y: 0, }}
                end={{ x: 0, y: 1 }}
                style={styles.backgroundShadow}>
            </LinearGradient>
            <View style={styles.containerData}>
                <View style={styles.data}>
                    <Text style={styles.title}>Welcome to Animax</Text>
                    <Text style={styles.description}>The best streaming anime app of the century to entertain you every day</Text>

                    <ApplyButton
                        onPress={() => navigation.navigate('AuthFGA')}
                        isActiveButton={false}
                        text={'Get Started'}
                        style={styles.applyButton} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    applyButton: {
        width: '100%',
    },
    containerData: {
        width: '90%',
        height: '30%',
        alignItems: 'center',
        zIndex: 2,
        marginBottom: 10,
    },
    backgroundShadow: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '70%',
        zIndex: 2
    },
    data: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1
    },
    title: {
        color: '#fff',
        fontWeight: "500",
        fontSize: 36,
        fontFamily: 'Outfit',
        textAlign: 'center'
    },
    description: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Outfit',
        textAlign: 'center'
    }
});

export default AuthWelcomeScreen;