import React from 'react';
import { StyleSheet, View, Image, Text, Button, TouchableOpacity } from 'react-native';
import BackButton from '../../components/BackButton';
import facebookAuth from '../../utils/facebookAuth';
import googleAuth from '../../utils/googleAuth';
import appleAuth from '../../utils/appleAuth';
import { StatusBar } from 'expo-status-bar';

const AuthFGAScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <BackButton navigation={navigation} text='' />
            <View style={styles.titleContainer}>
                <Image source={require('../../../assets/letsyouin.png')} style={styles.titleImage} />
                <Text style={styles.titleText}>Let's you in</Text>
            </View>
            <View style={styles.authContainer}>
                <TouchableOpacity 
                onPress={() => facebookAuth()} 
                style={styles.facebookContainer}>
                    <Image source={require('../../../assets/icons/facebook-icon.png')} style={styles.facebookImage} />
                    <Text style={styles.facebookText}>Continue with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => googleAuth()} 
                style={styles.googleContainer}>
                    <Image source={require('../../../assets/icons/google-icon.png')} style={styles.googleImage} />
                    <Text style={styles.googleText}>Continue with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => appleAuth()} 
                style={styles.appleContainer}>
                    <Image source={require('../../../assets/icons/apple-icon.png')} style={styles.appleImage} />
                    <Text style={styles.appleText}>Continue with Apple</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.intermediateContainer}>
                <View style={styles.line} />
                <Text style={styles.text}>or</Text>
                <View style={styles.line} />
            </View>
            <TouchableOpacity 
                onPress={() => navigation.navigate('AuthSignIn')}
                style={styles.signInButton}>
                <Text style={styles.signInText}>Sign in with password</Text>
            </TouchableOpacity>
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
    facebookContainer: {
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
    facebookImage: {
        width: 28,
        height: 28,
        marginRight: 14,
    },
    facebookText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12
    },
    googleContainer: {
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
    googleImage: {
        width: 24,
        height: 24,
        marginRight: 14,
    },
    googleText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12
    },
    appleContainer: {
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
    appleImage: {
        width: 25,
        height: 31,
        marginRight: 14,
    },
    appleText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12
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
    signInButton: {
        marginTop: 20,
        backgroundColor: '#06C149',
        width: '90%',
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
    signInText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    signUpContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
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