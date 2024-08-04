import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from 'react';

import BackButton from '@Components/BackButton';
import PasswordSection from '@Components/PasswordSection';
import resetPasswordUser from '@Utils/fetch/resetPasswordUser';
import { useDispatch } from 'react-redux';
import { setUser } from '@Redux/reducers/userReducer';
import ConfigModal from '@Components/modals/ConfigModal';
import { saveTokenToStorage } from '@Utils/token';

const ForgotPasswordResetPasswordScreen = ({ navigation, route }) => {
    const { data } = route.params;
    const dispatch = useDispatch();
    const [textNewPassword, setTextNewPassword] = useState<string>(null);
    const [textVerifyPassword, setTextVerifyPassword] = useState<string>(null);
    const [isOpenModal, setOpenModal] = useState<boolean>(false);
    const [isEnabledButton, setEnabledButton] = useState<boolean>(true);
    
    useEffect(() => {
        if (textNewPassword == textVerifyPassword) {
            setEnabledButton(false);
        } else {
            setEnabledButton(true);
        };
    }, [textNewPassword, textVerifyPassword]);

    const handleResetPassword = async () => {
        const fetchData = async () => {
            const response = await resetPasswordUser(data.email, textNewPassword);
            if (response) {
                dispatch(setUser(response.user));
                await saveTokenToStorage(response.token);
                setOpenModal(true);
                setTimeout(() => {
                    navigation.navigate('HomeScreen');
                }, 5000);
            }
        };
        fetchData();
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text="Create New Password" />
            <ConfigModal visible={isOpenModal} setVisible={setOpenModal} />
            <View style={styles.content}>
                <Image
                    source={require('../../../../assets/backgroundForgotPasswordReset.png')}
                    style={{}} />
                <Text style={styles.contentText}>Create Your New Password</Text>
                <PasswordSection placeholder={"New Password"} textPassword={textNewPassword} setTextPassword={setTextNewPassword} />
                <PasswordSection placeholder={"Verify Password"} textPassword={textVerifyPassword} setTextPassword={setTextVerifyPassword} />
            </View>
            <TouchableOpacity 
                onPress={() => handleResetPassword()} 
                disabled={isEnabledButton}
                style={styles.buttonContinue}>
                    <Text style={styles.buttonContinueText}>Verify</Text>
            </TouchableOpacity>  
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    content: {
        width: '90%',
        height: '77%',
        alignItems: 'center',
    },
    contentText: {
        marginTop: 35,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
    },
    buttonContinue: {
        width: '90%',
        height: 58,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#06C149',
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8, 
    },
    buttonContinueText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 15,
    },
});
    
export default ForgotPasswordResetPasswordScreen;