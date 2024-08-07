import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import * as Font from 'expo-font';
import { BallIndicator } from 'react-native-indicators';
import { useDispatch } from 'react-redux';
import * as Updates from 'expo-updates';

import { getTokenFromStorage } from '@Utils/token';
import { setUser } from '@Redux/reducers/userReducer';
import authUserInToken from '@Utils/fetch/authUserInToken';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PreloaderScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const [textError, setTextError] = useState<string>(null);

    useEffect(() => {
        const bootStart = async () => {
            await Font.loadAsync({ 'Outfit': require('../../../assets/fonts/Outfit.ttf') });

            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Animax new updates!",
                            body: "App updated",
                            data: { someData: 'reloaded app' },
                        },
                        trigger: 1
                    });
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                }
            } catch (e) {
                console.error('Error checking for updates:', e);
            }
            
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Настечка <3",
                    body: "Хочешь скину ножки",
                    data: { someData: 'да!' },
                },
                trigger: 1
            });

            let userToken = await getTokenFromStorage();
            try {
                if (userToken) {
                    setTextError(null)
                    const user = await authUserInToken(userToken);
                    if (user) {
                        dispatch(setUser(user));
                        navigation.navigate('HomeScreen');
                    } else {
                        navigation.navigate('AuthSignIn');
                    }
                } else {
                    navigation.navigate('AuthWelcome');
                }
            } catch (error) {
                setTextError("К сожеленнию сервер на данный момент не доступен")
            }
        };

        bootStart();
    }, [dispatch, navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
            {!textError && (
                <View style={styles.loaderIndicatorContainer}>
                    <BallIndicator color="#13D458" size={70} animationDuration={700} />
                </View>
            )}
            <Text style={styles.textError}>{textError}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    textError: {
        color: '#red',
        fontSize: 14,
		fontFamily: 'Outfit',
        justifyContent: 'center',
        textAlign: 'center',
        width: '80%',
        height: 70,
        marginTop: '60%'
    },
    logo: {
        width: 160,
        height: 160,
        marginTop: '42%'
    },
    loaderIndicatorContainer: {
        height: 70,
        marginTop: '60%'
    },
});

export default PreloaderScreen;
