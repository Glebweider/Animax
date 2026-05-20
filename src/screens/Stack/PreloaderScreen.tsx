import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

// Components
import { BallIndicator } from '@Components/BallIndicator';
import { useAlert } from '@Components/alert/AlertContext';

// Utils
import { getTokenFromStorage } from '@Utils/functions/token';
import useAuthUserInToken from '@Utils/api/rest/auth/authUserInToken';

// Redux
import { setUser } from '@Redux/reducers/userReducer';


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
            if (!loaded && !error) return;

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
            <StatusBar style='light' />
            <View style={{ height: '95%' }}>
                <Image source={require('../../../assets/logo.png')} style={styles.logo} />
                <View style={styles.loaderIndicatorContainer}>
                    <BallIndicator color="#13D458" size={90} count={8} />
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
        marginTop: '60%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    updateText: {
        marginTop: 5,
        fontSize: 12,
        color: '#666',
    },
});

export default PreloaderScreen;
