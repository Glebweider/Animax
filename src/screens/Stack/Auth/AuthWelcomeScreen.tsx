import React from 'react';
import globalStyles from '@Styles/index';
import { StyleSheet, View, Image, Text } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';

// Components
import ApplyButton from '@Components/buttons/Apply';

// Data
import { BACKGROUND_WELCOME } from '@Data/constants';


const AuthWelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <Image source={BACKGROUND_WELCOME} style={styles.backgroundImage} />
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
                        onPress={() => navigation.navigate('AuthMethods')}
                        isActiveButton={false}
                        text={'Get Started'} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    containerData: {
        width: '90%',
        height: '30%',
        alignItems: 'center',
        zIndex: 2,
        marginBottom: 10
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
        ...globalStyles.FullScreen,
        justifyContent: 'space-evenly'
    },
    backgroundImage: {
        ...globalStyles.FullSize,
        flex: 1,
        resizeMode: 'cover',
        position: 'absolute',
        zIndex: 1
    },
    title: {
        ...globalStyles.TextPrimary,
        fontWeight: "500",
        fontSize: 36,
        textAlign: 'center'
    },
    description: {
        ...globalStyles.TextPrimary,
        fontSize: 13,
        textAlign: 'center'
    }
});

export default AuthWelcomeScreen;