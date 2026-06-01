import { StyleSheet, View, Text, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BackButton from '@Components/buttons/Back';
import PasswordSection from '@Components/PasswordSection';
import ConfigModal from '@Components/modals/ConfigModal';
import ApplyButton from '@Components/buttons/Apply';

// Data
import {
    BACKGROUND_FORGOT_PASSWORD_RESET, COLOR_TEXT_PRIMARY,
    USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH
} from '@Data/constants';

// Utils
import { saveTokenToStorage } from '@Utils/functions/storage';

// Rest
import useResetPassword from '@Rest/user/resetPasswordUser';

// Redux
import { RootState } from '@Redux/store';
import { setUser } from '@Redux/reducers/userReducer';
import { clearState } from '@Redux/reducers/forgotPasswordReducer';


const ForgotPasswordResetPasswordScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.forgotPasswordReducer);

    const [textNewPassword, setTextNewPassword] = useState<string>('');
    const [textVerifyPassword, setTextVerifyPassword] = useState<string>('');
    const [isOpenModal, setOpenModal] = useState<boolean>(false);

    const { resetPasswordUser } = useResetPassword();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isPasswordValid = textNewPassword === textVerifyPassword &&
        textNewPassword.length >= USER_PASSWORD_MIN_LENGTH &&
        textNewPassword.length <= USER_PASSWORD_MAX_LENGTH;

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleResetPassword = async () => {
        if (!isPasswordValid) return;

        const response = await resetPasswordUser(state.data, textNewPassword);
        if (response) {
            dispatch(setUser(response.user));
            dispatch(clearState());

            saveTokenToStorage(response.token);

            setOpenModal(true);

            timerRef.current = setTimeout(() => {
                navigation.replace('HomeScreen');
            }, 5000);
        }
    };

    return (
        <View style={styles.container}>
            <BackButton
                onPress={() => navigation.navigate('ForgotPasswordCodeVerifyScreen')}
                text="Create New Password" />
            <ConfigModal visible={isOpenModal} setVisible={setOpenModal} />

            <View style={styles.content}>
                <Image source={BACKGROUND_FORGOT_PASSWORD_RESET} />
                <Text style={styles.contentText}>Create Your New Password</Text>

                <PasswordSection
                    placeholder={"New Password"}
                    textPassword={textNewPassword}
                    setTextPassword={setTextNewPassword} />

                <PasswordSection
                    placeholder={"Verify Password"}
                    textPassword={textVerifyPassword}
                    setTextPassword={setTextVerifyPassword} />
            </View>
            <ApplyButton
                onPress={handleResetPassword}
                isActiveButton={isPasswordValid}
                style={styles.applyButton}
                text={'Verify'} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    content: {
        width: '90%',
        height: '77%',
        alignItems: 'center',
    },
    contentText: {
        marginTop: 35,
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 13,
    },
    applyButton: {
        width: '90%',
        marginTop: 0,
    }
});

export default ForgotPasswordResetPasswordScreen;