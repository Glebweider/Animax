import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import * as Font from 'expo-font';
import { BallIndicator } from 'react-native-indicators';
import { useDispatch } from 'react-redux';
import * as Updates from 'expo-updates';

import { getTokenFromStorage } from '@Utils/token';
import { setUser } from '@Redux/reducers/userReducer';

import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from 'notification-config';
import useAuthUserInToken from '@Utils/fetch/authUserInToken';
import { useAlert } from '@Components/AlertContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PreloaderScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { authUserInToken } = useAuthUserInToken();
    const { showAlert } = useAlert();

    useEffect(() => {
        const bootStart = async () => {
            await Font.loadAsync({ 'Outfit': require('../../../assets/fonts/Outfit.ttf') });
            await registerForPushNotificationsAsync();

            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                }
            } catch (e) {}

            // await Notifications.scheduleNotificationAsync({
            //     content: {
            //         title: "Настечка <3",
            //         body: "Хочешь скину ножки",
            //         data: { someData: 'да!' },
            //     },
            //     trigger: {
            //         seconds: 3,
            //     },
            // });

            let userToken = await getTokenFromStorage();
            try {
                if (userToken) {
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
                showAlert("К сожалению, сервер в данный момент недоступен");
            }
        };
        bootStart();
    }, [dispatch, navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
            <View style={styles.loaderIndicatorContainer}>
                <BallIndicator color="#13D458" size={70} animationDuration={700} />
            </View>
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
