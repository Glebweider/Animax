import React from 'react';
import globalStyles from '@Styles/index';
import { StyleSheet, View, Image, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

//Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';
import AuthMethods from '@Components/AuthMethods';
import AuthRedirect from '@Components/AuthRedirect';
import AuthDivider from '@Components/AuthDivider';

// Data
import { BACKGROUND_METHODS } from '@Data/constants';


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
        alignItems: 'center'
    },
    titleContainer: {
        ...globalStyles.AuthTitleContainer,
        height: '30%'
    },
    titleImage: {
        width: '60%',
        height: '80%'
    },
    titleText: {
        ...globalStyles.TextPrimary,
        marginTop: 25,
        fontSize: 35,
        fontWeight: "500"
    }
});

export default AuthMethodsScreen;