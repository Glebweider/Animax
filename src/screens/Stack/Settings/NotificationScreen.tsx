import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import BackButton from '@Components/BackButton';
import ToggleSwitch from '@Components/ToggleSwitch';
import { useAlert } from '@Components/AlertContext';

//Utils
import { RootState } from '@Redux/store';
import { IUserNotificationSettings, setAlertSettings } from '@Redux/reducers/userReducer';
import useUpdateNotificationSettings from '@Utils/fetch/updateNotificationSettings';
import { getTokenFromStorage } from '@Utils/token';
import { i18n } from '@Utils/localization';


const NotificationScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.userReducer);
    const [notificationSettings, setNotificationSettings] = useState<IUserNotificationSettings>(userState.notificationSettings);
    const [isActiveButton, setActiveButton] = React.useState(false);
    
    const { updateNotificationSettings } = useUpdateNotificationSettings();
    const { showAlert } = useAlert();

    const isEqual = (obj1: Record<null, boolean>, obj2: Record<null, boolean>): boolean => {
        return Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
    };

    useEffect(() => {
        if (!isEqual(userState.notificationSettings, notificationSettings)) {
            setActiveButton(true);
        } else {
            setActiveButton(false);
        }
    }, [notificationSettings]);

    const update = async () => {
        try {
            const token = await getTokenFromStorage();
            const data = await updateNotificationSettings(token, notificationSettings);
            if (data) {
                setActiveButton(false);
                dispatch(setAlertSettings(notificationSettings));
                navigation.navigate('SettingsScreen')
            }            
        } catch (error) {
            showAlert(`Ошибка: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <BackButton navigation={navigation} text={i18n.t('profile.notification')} />
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
            </View>
            {isActiveButton && 
                <TouchableOpacity 
                    onPress={update} 
                    style={isActiveButton ? styles.continueButtonDisabled : styles.continueButtonEnabled}>
                    <Text style={styles.buttonTitle}>{i18n.t('update')}</Text>
                </TouchableOpacity>
            }
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
        justifyContent: 'space-between'
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
    },
    continueButtonDisabled: {
        backgroundColor: '#0E9E42',
        width: '90%',
        height: 60,
        marginBottom: 20,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonEnabled: {
        backgroundColor: '#06C149',
        width: '90%',
        marginBottom: 20,
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8,
    },
    buttonTitle: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
});
    
export default NotificationScreen;