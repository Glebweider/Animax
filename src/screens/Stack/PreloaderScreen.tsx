import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import * as Font from 'expo-font';
import { BallIndicator } from 'react-native-indicators';
import { useDispatch } from 'react-redux';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

import { getTokenFromStorage } from '@Utils/token';
import { setUser } from '@Redux/reducers/userReducer';

import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from 'notification-config';
import useAuthUserInToken from '@Utils/fetch/authUserInToken';
import { useAlert } from '@Components/AlertContext';
import { useFonts } from 'expo-font';

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
    const [loaded, error] = useFonts({
        'Outfit': require('../../../assets/fonts/Outfit.ttf'),
    });
    
    const bootStart = useCallback(async () => {
        try {
            if (!loaded && !error) {
                return;
            }
    
            if (error) {
                showAlert(`Ошибка при загрузке шрифта: ${error.message}`);
                return;
            }
    
            if (!__DEV__ && Constants.executionEnvironment === 'standalone') {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                    return;
                }
            }
    
            let userToken = await getTokenFromStorage();
            if (userToken) {
                const user = await authUserInToken(userToken);
        
                if (user) {
                    dispatch(setUser(user));
                    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
                } else {
                    navigation.reset({ index: 0, routes: [{ name: 'AuthSignIn' }] });
                }
            } else {
                navigation.reset({ index: 0, routes: [{ name: 'AuthWelcome' }] });
            }
        } catch (error) {
            showAlert(`Ошибка: ${error.message}`);
        }
    }, [dispatch, navigation, loaded, error]);
    
    useEffect(() => {
        bootStart();
    }, [bootStart]);
    
    if (!loaded && !error) {
        return null;
    }


    return (
        <View style={styles.container}>
            <View style={{ height: '95%' }}>
                <Image source={require('../../../assets/logo.png')} style={styles.logo} />
                <View style={styles.loaderIndicatorContainer}>
                    <BallIndicator color="#13D458" size={70} animationDuration={700} />
                </View>                
            </View>
            <Text style={styles.updateText}>
                {Updates.updateId}
            </Text>
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
    updateText: {
        marginTop: 5,
        fontSize: 12,
        color: '#666',
    },
});

export default PreloaderScreen;
