import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

//Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';
import AuthMethods from '@Components/AuthMethods';
import AuthRedirect from '@Components/AuthRedirect';
import AuthDivider from '@Components/AuthDivider';

// Data
import { BACKGROUND_METHODS, COLOR_TEXT_PRIMARY } from '@Data/constants';


const AuthMethodsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <BackButton onPress={() => navigation.navigate('AuthWelcome')} />
            <View style={styles.titleContainer}>
                <Image source={BACKGROUND_METHODS} style={styles.titleImage} />
                <Text style={styles.titleText}>Let's you in</Text>
            </View>

            <AuthMethods vertical />

            <View style={{ width: '90%' }}>
                <AuthDivider text='or' />

                <ApplyButton
                    onPress={() => navigation.navigate('AuthSignIn')}
                    isActiveButton={false}
                    text={'Sign in with password'} />

                <AuthRedirect
                    text={"Don't have an account?"}
                    clicableText={'Sign up'}
                    style={{ marginTop: 25 }}
                    onPress={() => navigation.navigate('AuthSignUp')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 35,
        fontWeight: "500"
    }
});

export default AuthMethodsScreen;