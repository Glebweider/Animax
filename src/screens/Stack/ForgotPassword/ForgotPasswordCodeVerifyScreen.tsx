import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useEffect, useRef, useState } from 'react';

import BackButton from '@Components/buttons/Back';
import useRecoverPassword from '@Utils/api/rest/user/recoverPasswordUser';
import ApplyButton from '@Components/buttons/Apply';

const ForgotPasswordCodeVerifyScreen = ({ navigation, route }) => {
    const { data } = route.params;
    const [expiresAt] = useState(data.expiresAt);
    const [timeLeft, setTimeLeft] = useState(data.expiresAt);
    const { recoverPasswordUser } = useRecoverPassword();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const remainingTime = expiresAt - now;

            if (remainingTime <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(remainingTime);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);


    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const [pins, setPins] = useState(['', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);
    const [focusedIndex, setFocusedIndex] = useState<number>(0);

    const handlePinInputChange = (index: number, pin: string) => {
        const newPins = [...pins];
        newPins[index] = pin;

        if (pin !== '' && index < pins.length - 1) {
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        } else if (newPins.join('').length < pins.join('').length) {
            const prevInput = inputRefs.current[index - 1];
            if (prevInput) {
                prevInput.focus();
            }
        }

        setPins(newPins);
    };

    const handlePinSubmit = async () => {
        const enteredPin = pins.join('');
        const response = await recoverPasswordUser(data.text, enteredPin);
        if (response) {
            navigation.navigate('ForgotPasswordResetPasswordScreen', {
                data: {
                    email: data.text,
                }
            })
        }
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text="Forgot Password" />
            <View style={styles.content}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.contentText}>Code had been send to {data.text}
                </Text>
                <View style={styles.pinContainer}>
                    {pins.map((pin, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={index === focusedIndex ? styles.pinInputDisabled : styles.pinInputEnabled}
                            onChangeText={(text) => handlePinInputChange(index, text)}
                            onFocus={() => setFocusedIndex(index)}
                            value={pin}
                            keyboardType="numeric"
                            maxLength={1} />
                    ))}
                </View>
                <View style={styles.resendCodeContainer}>
                    <Text style={styles.resendCodeText}>Resend code in </Text>
                    <Text style={styles.resendCodeTimer}>{formattedTime}</Text>
                    <Text style={styles.resendCodeTime}> s</Text>
                </View>
            </View>
            <ApplyButton
                onPress={() => handlePinSubmit()}
                isActiveButton={pins.join('').length != 4}
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
        justifyContent: 'center'
    },
    resendCodeContainer: {
        flexDirection: 'row',
    },
    resendCodeText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    resendCodeTimer: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    resendCodeTime: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    pinContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        marginTop: 50,
        marginBottom: 50,
    },
    pinInputEnabled: {
        width: 80,
        height: 60,
        borderWidth: 1,
        borderColor: '#35383F',
        borderRadius: 10,
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
    },
    pinInputDisabled: {
        width: 80,
        height: 60,
        borderWidth: 1,
        borderColor: '#06C149',
        borderRadius: 10,
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
    },
    contentText: {
        marginTop: 0,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
        width: '86%',
    },
});

export default ForgotPasswordCodeVerifyScreen;