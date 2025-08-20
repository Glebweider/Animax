import { StyleSheet, View, Text, Image } from 'react-native';
import { useEffect, useState } from 'react';

import BackButton from '@Components/buttons/Back';
import PasswordSection from '@Components/PasswordSection';
import { useDispatch } from 'react-redux';
import { setUser } from '@Redux/reducers/userReducer';
import ConfigModal from '@Components/modals/ConfigModal';
import { saveTokenToStorage } from '@Utils/functions/token';
import useResetPassword from '@Rest/user/resetPasswordUser';
import ApplyButton from '@Components/buttons/Apply';

const ForgotPasswordResetPasswordScreen = ({ navigation, route }) => {
    const { data } = route.params;
    const dispatch = useDispatch();
    const [textNewPassword, setTextNewPassword] = useState<string>(null);
    const [textVerifyPassword, setTextVerifyPassword] = useState<string>(null);
    const [isOpenModal, setOpenModal] = useState<boolean>(false);
    const [isEnabledButton, setEnabledButton] = useState<boolean>(true);
    const { resetPasswordUser } = useResetPassword();

    useEffect(() => {
        if (textNewPassword == textVerifyPassword && textNewPassword.length > 0) {
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
            <ApplyButton
                onPress={() => handleResetPassword()}
                isActiveButton={isEnabledButton}
                style={styles.applyButton}
                text={'Verify'} />
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
        marginTop: 0
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
});

export default ForgotPasswordResetPasswordScreen;