import React, { useMemo } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';
import PasswordSection from '@Components/PasswordSection';
import ApplyButton from '@Components/buttons/Apply';
import { useAlert } from '@Components/alert/AlertContext';

// Icons
import EmailIcon from '@Icons/EmailIcon';

// Utils
import { facebookAuth, googleAuth, appleAuth } from '@Utils/functions';
import { useFormValidation } from '@Utils/hooks';
import { isEmail } from '@Utils/validators';

// Rest
import useCheckFieldAvailability from '@Rest/auth/useCheckFieldAvailability';

// Redux
import { setEmailAndPasswordUser } from '@Redux/reducers/authReducer';


const AuthSignUpScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { showAlert } = useAlert();
    const [textEmail, setTextEmail] = React.useState<string>('');
    const [textPassword, setTextPassword] = React.useState<string>('');
    const [isActiveButton, setActiveButton] = React.useState<boolean>(true);
    const { checkFieldAvailability } = useCheckFieldAvailability();

    const formConfig = useMemo(() => ({
        email: {
            value: textEmail,
            rules: [
                (v) => !isEmail(v) ? "Please enter a valid email" : null
            ]
        },
        password: {
            value: textPassword,
            rules: [
                (v) => v.length < 6 ? "Password must be at least 6 characters" : null
            ]
        }
    }), [textEmail, textPassword]);

    const { errors, activeButton } = useFormValidation(formConfig);


    const registration = async () => {
        const checkEmail = await checkFieldAvailability("email", textEmail);
        if (checkEmail) {
            dispatch(setEmailAndPasswordUser({
                email: textEmail,
                password: textPassword
            }));
            navigation.navigate('AuthAccountSetupInterest');
        } else {
            showAlert('Please enter a valid email address');
            setActiveButton(true);
        }
    }

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text='' />
            <View style={styles.titleContainer}>
                <Image source={require('../../../../assets/logo.png')} style={styles.titleImage} />
                <Text style={styles.titleText}>Create Your Account</Text>
            </View>
            <View style={styles.authContainer}>
                <View style={styles.emailSection}>
                    <EmailIcon
                        Color={textEmail ? '#fff' : '#9E9E9E'}
                        Style={styles.icon} />
                    <TextInput
                        style={styles.emailInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder="Email"
                        keyboardType="email-address"
                        onChangeText={(newText) => setTextEmail(newText)}
                        value={textEmail} />
                </View>
                {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}

                <PasswordSection placeholder='Password' textPassword={textPassword} setTextPassword={setTextPassword} />
                {errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}

                <ApplyButton
                    onPress={registration}
                    isActiveButton={isActiveButton && activeButton}
                    style={styles.applyButton}
                    text={'Sign up'} />

                <View style={styles.intermediateContainer}>
                    <View style={styles.line} />
                    <Text style={styles.text}>or continue with</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.authFGAContainer}>
                    <TouchableOpacity
                        onPress={() => facebookAuth()}
                        style={styles.facebookContainer}>
                        <Image
                            source={require('../../../../assets/icons/facebook-icon.png')}
                            style={styles.facebookImage} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => googleAuth()}
                        style={styles.googleContainer}>
                        <Image
                            source={require('../../../../assets/icons/google-icon.png')}
                            style={styles.googleImage} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => appleAuth()}
                        style={styles.appleContainer}>
                        <Image
                            source={require('../../../../assets/icons/apple-icon.png')}
                            style={styles.appleImage} />
                    </TouchableOpacity>
                </View>
                <View style={styles.signInContainer}>
                    <Text style={styles.signInText}>Already have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AuthSignIn')}>
                        <Text style={styles.clicableSignInText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    errorMessage: {
        marginTop: 5,
        color: 'red',
        fontSize: 11,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center'
    },
    applyButton: {
        marginTop: 30,
        width: '100%'
    },
    emailSection: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: '#1F222A',
    },
    emailInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontFamily: 'Outfit',
    },
    icon: {
        width: 20,
        height: 20,
        margin: 22,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    titleContainer: {
        marginTop: 5,
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
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 26,
        fontWeight: "600"
    },
    authContainer: {
        width: '90%',
        height: '100%',
    },
    intermediateContainer: {
        marginTop: 44,
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
    },
    authFGAContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    facebookContainer: {
        width: 89,
        height: 61,
        backgroundColor: '#1F222A',
        borderRadius: 15,
        borderColor: '#2E3138',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    facebookImage: {
        width: 30,
        height: 30,
    },
    googleContainer: {
        width: 89,
        height: 61,
        backgroundColor: '#1F222A',
        borderRadius: 15,
        borderColor: '#2E3138',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleImage: {
        width: 25,
        height: 25,
    },
    appleContainer: {
        width: 89,
        height: 61,
        backgroundColor: '#1F222A',
        borderRadius: 15,
        borderColor: '#2E3138',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appleImage: {
        width: 25,
        height: 31,
    },
    signInContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 40,
    },
    signInText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Outfit',
    },
    clicableSignInText: {
        color: '#06C049',
        fontSize: 12,
        fontFamily: 'Outfit',
        marginLeft: 10
    },
});

export default AuthSignUpScreen;