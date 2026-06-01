import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';

// Data
import {
    BACKGROUND_FORGOT_PASSWORD, COLOR_BACKGROUND_SECONDARY,
    COLOR_PRIMARY, COLOR_TEXT_PRIMARY
} from '@Data/constants';

// Icons
import EmailIcon from '@Icons/EmailIcon';

// Modals
import ForgotPasswordInputModal from '@Modal/ForgotPasswordInputModal';

// Rest
import useForgotPassword from '@Rest/user/forgotPasswordUser';

// Redux
import { RootState } from '@Redux/store';
import { setExpiresAt, setType } from '@Redux/reducers/forgotPasswordReducer';


const ForgotPasswordMethodsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.forgotPasswordReducer);

    const [isOpenModalForgotPasswordInput, setOpenModalForgotPasswordInput] = useState<boolean>(false);

    const { forgotPasswordUser } = useForgotPassword();

    const fetchData = async () => {
        const response = await forgotPasswordUser(state.data);

        if (response) {
            dispatch(setExpiresAt(Number(response.expiresAt)));
            navigation.navigate('ForgotPasswordCodeVerifyScreen');
        }
    }

    return (
        <View style={styles.container}>
            <BackButton
                onPress={() => navigation.navigate('AuthSignIn')}
                text="Forgot Password" />
            <ForgotPasswordInputModal
                visible={isOpenModalForgotPasswordInput}
                setVisible={setOpenModalForgotPasswordInput} />
            <View style={styles.content}>
                <Image
                    source={BACKGROUND_FORGOT_PASSWORD}
                    style={{}} />
                <Text style={styles.contentText}>Select which contact details should we use to reset your password</Text>
                {/* <TouchableOpacity 
                    style={methodResetPassword == 'SMS' ? 
                        styles.contentMethodContainerEnabled 
                    : 
                        styles.contentMethodContainerDisabled}
                    onPress={() => {
                        dispatch(setType('SMS'));
                        setOpenModalForgotPasswordInput(true);
                    }}>
                    <View style={styles.contentMethodImageContainer}>
                        <EmailIcon 
                            Color={COLOR_PRIMARY} 
                            Style={{}} />
                    </View>
                    <Text style={styles.contentMethodViaText}>SMS</Text>
                </TouchableOpacity>    */}
                <TouchableOpacity
                    style={
                        state.type == 'EMAIL' ?
                            styles.contentMethodContainerEnabled
                            :
                            styles.contentMethodContainerDisabled
                    }
                    onPress={() => {
                        dispatch(setType('EMAIL'));
                        setOpenModalForgotPasswordInput(true);
                    }}>
                    <View style={styles.contentMethodImageContainer}>
                        <EmailIcon
                            Color={COLOR_PRIMARY}
                            Style={{}} />
                    </View>
                    <Text style={styles.contentMethodViaText}>Email</Text>
                </TouchableOpacity>
            </View>
            <ApplyButton
                onPress={fetchData}
                isActiveButton={!state.data}
                style={{ marginTop: 0, width: '90%' }}
                text={'Continue'} />
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
        marginTop: 20,
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 13,
    },
    contentMethodContainerEnabled: {
        height: 129,
        width: '100%',
        borderColor: COLOR_PRIMARY,
        borderWidth: 2,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        borderRadius: 30,
        marginTop: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    contentMethodContainerDisabled: {
        height: 129,
        width: '100%',
        borderColor: '#2E3138',
        borderWidth: 2,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        borderRadius: 30,
        marginTop: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    contentMethodImageContainer: {
        backgroundColor: '#1D2E2D',
        borderRadius: 50,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    contentMethodViaText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 14,
    }
});

export default ForgotPasswordMethodsScreen;