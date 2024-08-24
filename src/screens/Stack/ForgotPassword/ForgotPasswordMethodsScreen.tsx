import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

import BackButton from '@Components/BackButton';
import EmailIcon from '@Icons/EmailIcon';
import ForgotPasswordInputModal from '@Modal/ForgotPasswordInputModal';
import useForgotPassword from '@Utils/fetch/forgotPasswordUser';
import { useAlert } from '@Components/AlertContext';

const ForgotPasswordMethodsScreen = ({ navigation }) => {
    const [methodResetPassword, setMethodResetPassword] = useState<string>('SMS');
    const [viaData, setViaData] = useState<string>(null);
    const [isOpenModalForgotPasswordInput, setOpenModalForgotPasswordInput] = useState<boolean>(false); 
    const { forgotPasswordUser } = useForgotPassword();
    const { showAlert } = useAlert()

    const fetchData = async () => {
        const response = await forgotPasswordUser(viaData)
        if (response.success) {
            navigation.navigate('ForgotPasswordCodeVerifyScreen', {
                data: {
                    method: methodResetPassword,
                    text: viaData,
                    expiresAt: response.expiresAt
                }
            })
        } else {
            showAlert('Error from request email');
        }
    }
    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text="Forgot Password" />
            <ForgotPasswordInputModal 
                visible={isOpenModalForgotPasswordInput}
                setVisible={setOpenModalForgotPasswordInput}
                setData={setViaData}
                data={methodResetPassword}
                navigation={navigation} />
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
                            Color={'#06C149'} 
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
                            Color={'#06C149'} 
                            Style={{}} />
                    </View>
                    <Text style={styles.contentMethodViaText}>Email</Text>
                </TouchableOpacity>                
            </View>
            <TouchableOpacity 
                onPress={() => fetchData()} 
                disabled={viaData == null}
                style={styles.buttonContinue}>
                    <Text style={styles.buttonContinueText}>Continue</Text>
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
        marginTop: 20,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
    },
    contentMethodContainerEnabled: {
        height: 129,
        width: '100%',
        borderColor: '#06C149',
        borderWidth: 2,
        backgroundColor: '#1F222A',
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
        backgroundColor: '#1F222A',
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
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
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
    
export default ForgotPasswordMethodsScreen;