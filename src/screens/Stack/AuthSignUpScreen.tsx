import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, Button, TouchableOpacity, TextInput} from 'react-native';
import BackButton from '../../components/BackButton';
import EmailIcon from '../../components/icons/EmailIcon';
import PasswordIcon from '../../components/icons/PasswordIcon';
import EyeOnIcon from '../../components/icons/EyeOnIcon';
import EyeOffIcon from '../../components/icons/EyeOffIcon';
import facebookAuth from '../../utils/facebookAuth';
import googleAuth from '../../utils/googleAuth';
import appleAuth from '../../utils/appleAuth';
import checkEmailAvailability from '../../utils/fetch/authCheckEmailAvailability';
import { setEmailAndPasswordUser } from '../../redux/reducers/authReducer';
import { useDispatch } from 'react-redux';

const AuthSignUpScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [textEmail, setTextEmail] = React.useState<string>('');
    const [textPassword, setTextPassword] = React.useState<string>('');
    const [isActiveButton, setActiveButton] = React.useState<boolean>(true);
    const [isVisibledPassword, setVisibledPassword] = React.useState<boolean>(true);
    const [passwordError, setPasswordError] = React.useState<string | null>(null);
    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [isEmailVerify, setEmailVerify] = React.useState<boolean>(false);
    const [isPasswordVerify, setPasswordVerify] = React.useState<boolean>(false);

    useEffect(() => {
        // Валидация пароля
        if (textPassword.length >= 1) {
            if (textPassword.length < 6) {
                setPasswordError('Пароль должен содержать не менее 6 символов');
                setEmailVerify(false);
            } else {
                setPasswordError(null);
                setEmailVerify(true);
            }
        } else {
            setPasswordError(null);
            setEmailVerify(false);
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (textEmail.length >= 3) {
            if (!emailRegex.test(textEmail)) {
                setEmailError('Введите действительный адрес электронной почты');
                setPasswordVerify(false);
            } else {
                setEmailError(null)
                setPasswordVerify(true);
            }            
        } else {
            setEmailError(null)
            setPasswordVerify(false);
        }
    
        if (textEmail.length >= 6 && textPassword.length >= 6) {
            if (isEmailVerify && isPasswordVerify) {
                setActiveButton(false);                
            }
        } else {
            setActiveButton(true);
        }
    }, [textEmail, textPassword]);

    const registration = async () => {
        const checkEmail = await checkEmailAvailability(textEmail);
        if (checkEmail) {
            dispatch(setEmailAndPasswordUser({
                email: textEmail, 
                password: textPassword
            }));
            navigation.navigate('AuthAccountSetupInterest');
        } else {
            setEmailError('Введите действительный адрес электронной почты');
            setActiveButton(true);
        }
    }

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text='' />
            <View style={styles.titleContainer}>
                <Image source={require('../../../assets/logo.png')} style={styles.titleImage} />
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
                        value={textEmail}/>
                </View>
                {emailError && <Text style={styles.emailError}>{emailError}</Text>}
                <View style={styles.passwordSection}>
                    <PasswordIcon 
                        Color={textPassword ? '#fff' : '#9E9E9E'} 
                        Style={styles.icon} />
                    <TextInput
                        style={styles.passwordInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder="Password"
                        secureTextEntry={isVisibledPassword}
                        onChangeText={(newText) => setTextPassword(newText)}
                        value={textPassword}/>
                    <TouchableOpacity onPress={() => isVisibledPassword ? setVisibledPassword(false) : setVisibledPassword(true)}>
                        { 
                        isVisibledPassword ? 
                        <EyeOffIcon Color={textPassword ? '#fff' : '#9E9E9E'} Style={styles.icon}/> 
                        :
                        <EyeOnIcon Color={textPassword ? '#fff' : '#9E9E9E'} Style={styles.icon}/>  
                        }                       
                    </TouchableOpacity>
                </View>
                {passwordError && <Text style={styles.passwordError}>{passwordError}</Text>}
                <TouchableOpacity 
                    onPress={() => registration()}
                    disabled={isActiveButton}
                    style={isActiveButton ? styles.signUpButtonDisabled : styles.signUpButtonEnabled}>
                    <Text style={styles.signUpText}>Sign up</Text>
                </TouchableOpacity>
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
                            source={require('../../../assets/icons/facebook-icon.png')} 
                            style={styles.facebookImage} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => googleAuth()} 
                        style={styles.googleContainer}>
                        <Image 
                            source={require('../../../assets/icons/google-icon.png')} 
                            style={styles.googleImage} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => appleAuth()} 
                        style={styles.appleContainer}>
                        <Image 
                            source={require('../../../assets/icons/apple-icon.png')} 
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
    passwordError: {
        marginTop: 5,
        color: 'red',
        fontSize: 11,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center'
    },
    emailError: {
        marginTop: 5,
        color: 'red',
        fontSize: 11,
        fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center'
    },
    signUpButtonEnabled: {
        marginTop: 30,
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
    signUpButtonDisabled: {
        marginTop: 30,
        backgroundColor: '#0E9E42',
        width: '100%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
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
    passwordSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 64,
        borderRadius: 20,
        backgroundColor: '#1F222A',
    },    
    passwordInput: {
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