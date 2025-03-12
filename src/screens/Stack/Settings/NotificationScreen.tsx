import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import BackButton from '@Components/BackButton';

//Utils
import { i18n } from '@Utils/localization';
import ToggleSwitch from '@Components/ToggleSwitch';
import { getTokenFromStorage } from '@Utils/token';
import { useAlert } from '@Components/AlertContext';
import useGetUserNotifications from '@Utils/fetch/getUserNotifications';
import { BallIndicator } from 'react-native-indicators';

interface IUserNotificationSettings {
    newEpisodes: boolean;
    newReleases: boolean;
    generalNotification: boolean;
    appUpdates: boolean;
    subscription: boolean;
}

const NotificationScreen = ({ navigation }) => {
    const [notificationSettings, setNotificationSettings] = useState<IUserNotificationSettings>({
        newEpisodes: false,
        newReleases: false,
        generalNotification: false,
        appUpdates: false,
        subscription: false
    });
    const [isLoading, setLoading] = useState<boolean>(true);
    const { getUserNotifications } = useGetUserNotifications();
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchData = async () => {
            let userToken = await getTokenFromStorage();
            if (userToken) {
                const notifications = await getUserNotifications(userToken);
                 
                setNotificationSettings(notifications);
                setLoading(false);
            } else {
                showAlert('Ошибка полученния информации об настройке уведомленний');
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('profile.notification')} />
            {!isLoading ?
                <>
                    <View style={styles.containerSetting}>
                        <Text style={styles.textSetting}>{i18n.t('notification.generalNotification')}</Text>
                        <ToggleSwitch
                            isOn={notificationSettings.generalNotification}
                            onToggle={(value: any) => setNotificationSettings((prevState) => ({
                                ...prevState,
                                generalNotification: value
                            }))}/>
                    </View>
                    <View style={styles.containerSetting}>
                        <Text style={styles.textSetting}>{i18n.t('notification.appUpdates')}</Text>
                        <ToggleSwitch
                            isOn={notificationSettings.appUpdates}
                            onToggle={(value: any) => setNotificationSettings((prevState) => ({
                                ...prevState,
                                appUpdates: value
                            }))}/>
                    </View>
                    <View style={styles.containerSetting}>
                        <Text style={styles.textSetting}>{i18n.t('notification.newEpisodes')}</Text>
                        <ToggleSwitch
                            isOn={notificationSettings.newEpisodes}
                            onToggle={(value: any) => setNotificationSettings((prevState) => ({
                                ...prevState,
                                newEpisodes: value
                            }))}/>
                    </View>
                    <View style={styles.containerSetting}>
                        <Text style={styles.textSetting}>{i18n.t('notification.newReleases')}</Text>
                        <ToggleSwitch
                            isOn={notificationSettings.newReleases}
                            onToggle={(value: any) => setNotificationSettings((prevState) => ({
                                ...prevState,
                                newReleases: value
                            }))}/>
                    </View>
                    <View style={styles.containerSetting}>
                        <Text style={styles.textSetting}>{i18n.t('notification.subscription')}</Text>
                        <ToggleSwitch
                            isOn={notificationSettings.subscription}
                            onToggle={(value: any) => setNotificationSettings((prevState) => ({
                                ...prevState,
                                subscription: value
                            }))}/>
                    </View>
                </>
                :
                <BallIndicator color="#13D458" size={70} animationDuration={700} />
            }
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    containerSetting: {
        width: '90%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 10,
        alignContent: 'center',
    },
    textSetting: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 15,
    }
});
    
export default NotificationScreen;