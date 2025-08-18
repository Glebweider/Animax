import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

//Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';

//Utils
import { facebookAuth, googleAuth, appleAuth } from '@Utils/functions';


const AuthFGAScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <BackButton navigation={navigation} text='' />
            <View style={styles.titleContainer}>
                <Image source={require('../../../../assets/letsyouin.png')} style={styles.titleImage} />
                <Text style={styles.titleText}>Let's you in</Text>
            </View>
            <View style={styles.authContainer}>
                <TouchableOpacity
                    onPress={() => facebookAuth()}
                    style={styles.socialContainer}>
                    <View style={{ flexDirection: 'row', width: '68%', alignItems: 'center' }}>
                        <Image source={require('../../../../assets/icons/facebook-icon.png')} style={styles.facebookImage} />
                        <Text style={styles.socialText}>Continue with Facebook</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => googleAuth()}
                    style={styles.socialContainer}>
                    <View style={{ flexDirection: 'row', width: '68%', alignItems: 'center' }}>
                        <Image source={require('../../../../assets/icons/google-icon.png')} style={styles.googleImage} />
                        <Text style={styles.socialText}>Continue with Google</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => appleAuth()}
                    style={styles.socialContainer}>
                    <View style={{ flexDirection: 'row', width: '68%', alignItems: 'center' }}>
                        <Image source={require('../../../../assets/icons/apple-icon.png')} style={styles.appleImage} />
                        <Text style={styles.socialText}>Continue with Apple</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.intermediateContainer}>
                <View style={styles.line} />
                <Text style={styles.text}>or</Text>
                <View style={styles.line} />
            </View>

            <ApplyButton
                onPress={() => navigation.navigate('AuthSignIn')}
                isActiveButton={false}
                text={'Sign in with password'}
                style={styles.applyButton} />
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AuthSignUp')}>
                    <Text style={styles.clicableSignUpText}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    applyButton: {
        width: '90%'
    },
    titleContainer: {
        width: '100%',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleImage: {
        width: '60%',
        height: '80%',
    },
    titleText: {
        marginTop: 25,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 35,
        fontWeight: "500"
    },
    authContainer: {
        marginTop: 15,
        width: '100%',
        height: '30%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    socialContainer: {
        width: '90%',
        height: 59,
        backgroundColor: '#1F222A',
        borderRadius: 15,
        borderColor: '#2E3138',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    socialText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12
    },
    facebookImage: {
        width: 26,
        height: 26,
        marginHorizontal: 19
    },
    googleImage: {
        width: 24,
        height: 24,
        marginHorizontal: 20
    },
    appleImage: {
        width: 25,
        height: 31,
        marginHorizontal: 20
    },
    intermediateContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        width: '90%',
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
    },
    signUpContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
    },
    signUpText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Outfit',
        fontWeight: '100',
    },
    clicableSignUpText: {
        color: '#06C049',
        fontSize: 12,
        fontFamily: 'Outfit',
        marginLeft: 10
    },
});

export default AuthFGAScreen;