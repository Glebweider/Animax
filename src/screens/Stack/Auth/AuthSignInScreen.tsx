import React, { useMemo } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { registerForPushNotificationsAsync } from 'notification-config';

// Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';
import AuthMethods from '@Components/AuthMethods';
import AuthRedirect from '@Components/AuthRedirect';
import AuthDivider from '@Components/AuthDivider';
import AuthEmailSectionInput from '@Components/AuthEmailSectionInput';
import AuthPasswordSectionInput from '@Components/AuthPasswordSectionInput';

// Data
import {
    COLOR_PRIMARY_DARK, COLOR_TEXT_PRIMARY, ICON_APP,
    USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH
} from '@Data/constants';


// Utils
import { saveTokenToStorage } from '@Utils/functions';
import { isEmail } from '@Utils/validators';
import { useFormValidation } from '@Utils/hooks';

// Redux
import { setUser } from '@Redux/reducers/userReducer';

// Rest
import useAuthUserInToken from '@Rest/auth/authUserInToken';
import useAuthSignIn from '@Rest/auth/authUserSignIn';


const AuthSignInScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [textEmail, setTextEmail] = React.useState<string>('');
    const [textPassword, setTextPassword] = React.useState<string>('');
    const [isActiveButton, setActiveButton] = React.useState<boolean>(true);
    const { authUserInToken } = useAuthUserInToken();
    const { authSignIn } = useAuthSignIn();

    const formConfig = useMemo(() => ({
        email: {
            value: textEmail,
            rules: [
                (v) => (v.length > 0 && !isEmail(v)) ? "Please enter a valid email" : null
            ]
        },
        password: {
            value: textPassword,
            rules: [
                (v) => (v.length > 0 && (v.length < USER_PASSWORD_MIN_LENGTH || v.length > USER_PASSWORD_MAX_LENGTH))
                    ? `Password must be between ${USER_PASSWORD_MIN_LENGTH} and ${USER_PASSWORD_MAX_LENGTH} characters`
                    : null
            ]
        }
    }), [textEmail, textPassword]);

    const { errors, activeButton } = useFormValidation(formConfig);

    const authorization = async () => {
        setActiveButton(true);

        const pushToken = await registerForPushNotificationsAsync();
        const response = await authSignIn({
            email: textEmail,
            password: textPassword,
            pushToken: pushToken
        });

        if (response) {
            saveTokenToStorage(response);

            const user = await authUserInToken();
            if (user) {
                dispatch(setUser(user));
                navigation.replace('HomeScreen');
            }
        }

        setActiveButton(false);
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar style='light' />
            <BackButton onPress={() => navigation.navigate('AuthMethods')} />
            <View style={styles.titleContainer}>
                <Image source={ICON_APP} style={styles.titleImage} />
                <Text style={styles.titleText}>Login Your Account</Text>
            </View>
            <View style={styles.authContainer}>
                <AuthEmailSectionInput
                    error={errors.email}
                    value={textEmail}
                    setValue={(v) => setTextEmail(v)} />

                <AuthPasswordSectionInput
                    error={errors.password}
                    value={textPassword}
                    setValue={(v) => setTextPassword(v)} />

                <ApplyButton
                    onPress={authorization}
                    isActiveButton={isActiveButton && activeButton}
                    style={{ marginTop: 30 }}
                    text={'Sign in'} />

                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPasswordMethodsScreen')}
                    style={styles.clicableForgotPassword}>
                    <Text style={styles.clicableForgotPasswordText}>Forgot the password?</Text>
                </TouchableOpacity>

                <AuthDivider text='or continue with' />

                <AuthMethods />

                <AuthRedirect
                    text={"Don't have an account?"}
                    clicableText={'Sign up'}
                    style={{ marginTop: 40 }}
                    onPress={() => navigation.navigate('AuthSignUp')} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: 25
    },
    titleContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleImage: {
        width: 115,
        height: 115
    },
    titleText: {
        marginTop: 25,
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 26,
        fontWeight: "600"
    },
    authContainer: {
        width: '90%',
        height: '100%',
    },
    clicableForgotPassword: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    clicableForgotPasswordText: {
        color: COLOR_PRIMARY_DARK,
        fontSize: 13,
        fontFamily: 'Outfit',
    },
});

export default AuthSignInScreen;