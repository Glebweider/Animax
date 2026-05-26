import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

// Components
import BackButton from '@Components/buttons/Back';
import ApplyButton from '@Components/buttons/Apply';

// Data
import {
    COLOR_BACKGROUND_PRIMARY, COLOR_BACKGROUND_SECONDARY,
    COLOR_PRIMARY, COLOR_TEXT_PRIMARY
} from '@Data/constants';

// Icons
import EmailIcon from '@Icons/EmailIcon';

// Modals
import ForgotPasswordInputModal from '@Modal/ForgotPasswordInputModal';

// Rest
import useForgotPassword from '@Rest/user/forgotPasswordUser';


const ForgotPasswordMethodsScreen = ({ navigation }) => {
    const [methodResetPassword, setMethodResetPassword] = useState<string>('SMS');
    const [viaData, setViaData] = useState<string>(null);
    const [isOpenModalForgotPasswordInput, setOpenModalForgotPasswordInput] = useState<boolean>(false);
    const { forgotPasswordUser } = useForgotPassword();

    const fetchData = async () => {
        const response = await forgotPasswordUser(viaData);

        if (response) {
            navigation.navigate('ForgotPasswordCodeVerifyScreen', {
                data: {
                    method: methodResetPassword,
                    text: viaData,
                    expiresAt: response.expiresAt
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <BackButton
                onPress={() => navigation.navigate('AuthSignIn')}
                text="Forgot Password" />
            <ForgotPasswordInputModal
                visible={isOpenModalForgotPasswordInput}
                setVisible={setOpenModalForgotPasswordInput}
                setData={setViaData}
                data={methodResetPassword} />
            <View style={styles.content}>
                <Image
                    source={require('../../../../assets/backgroundForgotPassword.png')}
                    style={{}} />
                <Text style={styles.contentText}>Select which contact details should we use to reset your password</Text>
                {/* <TouchableOpacity 
                    style={methodResetPassword == 'SMS' ? 
                        styles.contentMethodContainerEnabled 
                    : 
                        styles.contentMethodContainerDisabled}
                    onPress={() => {
                        setMethodResetPassword('SMS');
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
                        methodResetPassword == 'EMAIL' ?
                            styles.contentMethodContainerEnabled
                            :
                            styles.contentMethodContainerDisabled
                    }
                    onPress={() => {
                        setMethodResetPassword('EMAIL');
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
                onPress={() => fetchData()}
                isActiveButton={viaData == null}
                style={styles.applyButton}
                text={'Continue'} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLOR_BACKGROUND_PRIMARY,
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