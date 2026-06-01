import { StyleSheet, View, Text, TextInput, TextInputKeyPressEvent, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import ApplyButton from '@Components/buttons/Apply';
import BackButton from '@Components/buttons/Back';

// Data
import { COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';

// Rest
import useRecoverPassword from '@Rest/user/recoverPasswordUser';
import useForgotPasswordUser from '@Rest/user/forgotPasswordUser';

// Redux
import { RootState } from '@Redux/store';
import { setExpiresAt } from '@Redux/reducers/forgotPasswordReducer';


const ForgotPasswordCodeVerifyScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.forgotPasswordReducer);

    const { recoverPasswordUser } = useRecoverPassword();
    const { forgotPasswordUser } = useForgotPasswordUser();

    const calculateTimeLeft = () => {
        const remaining = state.expiresAt - Date.now();
        return remaining > 0 ? remaining : 0;
    };

    const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft);
    const [pins, setPins] = useState<string[]>(['', '', '', '']);
    const [focusedIndex, setFocusedIndex] = useState<number>(0);

    const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            const remaining = state.expiresAt - Date.now();
            if (remaining <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [state.expiresAt]);

    const formattedTime = useMemo(() => {
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, [timeLeft]);

    const isCodeComplete = pins.join('').length === 4;
    const handlePinInputChange = (index: number, text: string) => {
        const cleanText = text.replace(/[^0-9]/g, '').slice(-1);

        const newPins = [...pins];
        newPins[index] = cleanText;
        setPins(newPins);

        if (cleanText !== '' && index < pins.length - 1)
            inputRefs.current[index + 1]?.focus();
    };

    const handleKeyPress = (index: number, e: TextInputKeyPressEvent) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (pins[index] === '' && index > 0) {
                const newPins = [...pins];
                newPins[index - 1] = '';
                setPins(newPins);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePinSubmit = async () => {
        if (!isCodeComplete) return;

        const enteredPin = pins.join('');
        if (await recoverPasswordUser(state.data, enteredPin))
            navigation.navigate('ForgotPasswordResetPasswordScreen');
    };

    const handleResendCode = async () => {
        setPins(['', '', '', '']);
        inputRefs.current[0]?.focus();

        const response = await forgotPasswordUser(state.data);
        if (response)
            dispatch(setExpiresAt(Number(response.expiresAt)));
    };

    return (
        <View style={styles.container}>
            <BackButton
                onPress={() => navigation.navigate('ForgotPasswordMethodsScreen')}
                text="Forgot Password" />

            <View style={styles.content}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.contentText}>
                    Code has been sent to {state.data}
                </Text>

                <View style={styles.pinContainer}>
                    {pins.map((pin, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputRefs.current[index] = ref; }}
                            style={index === focusedIndex ? styles.pinInputActive : styles.pinInputInactive}
                            onChangeText={(text) => handlePinInputChange(index, text)}
                            onKeyPress={(e) => handleKeyPress(index, e)}
                            onFocus={() => setFocusedIndex(index)}
                            value={pin}
                            keyboardType="numeric"
                            maxLength={1} />
                    ))}
                </View>

                <View style={styles.resendCodeContainer}>
                    {timeLeft > 0 ? (
                        <>
                            <Text style={styles.resendCodeText}>Resend code in </Text>
                            <Text style={styles.resendCodeTimer}>{formattedTime}</Text>
                        </>
                    ) : (
                        <TouchableOpacity onPress={handleResendCode}>
                            <Text style={[styles.resendCodeTimer, { textDecorationLine: 'underline' }]}>
                                Resend Code
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ApplyButton
                onPress={handlePinSubmit}
                isActiveButton={!isCodeComplete && timeLeft >= 0}
                style={styles.applyButton}
                text="Verify" />
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
        height: '74%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resendCodeContainer: {
        flexDirection: 'row',
    },
    resendCodeText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 14,
    },
    resendCodeTimer: {
        color: COLOR_PRIMARY,
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
    // Переименовал для понятности
    pinInputInactive: {
        width: 80,
        height: 60,
        borderWidth: 1,
        borderColor: '#35383F',
        borderRadius: 10,
        textAlign: 'center',
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 18,
    },
    pinInputActive: {
        width: 80,
        height: 60,
        borderWidth: 1,
        borderColor: COLOR_PRIMARY,
        borderRadius: 10,
        textAlign: 'center',
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 18,
    },
    contentText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 13,
        width: '86%',
        textAlign: 'center',
    },
    applyButton: {
        width: '90%',
    }
});

export default ForgotPasswordCodeVerifyScreen;