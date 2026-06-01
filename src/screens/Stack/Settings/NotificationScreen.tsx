import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';
import ToggleSwitch from '@Components/ToggleSwitch';
import ApplyButton from '@Components/buttons/Apply';

// Data
import { COLOR_TEXT_PRIMARY } from '@Data/constants';

// Redux
import { RootState } from '@Redux/store';
import { IUserNotificationSettings, setAlertSettings } from '@Redux/reducers/userReducer';

//Utils
import { i18n } from '@Utils/localization';

// Rest
import useUpdateNotificationSettings from '@Rest/settings/updateNotificationSettings';


const notificationFields: { key: keyof IUserNotificationSettings; label: string }[] = [
    { key: 'generalNotification', label: i18n.t('notification.generalNotification') },
    { key: 'appUpdates', label: i18n.t('notification.appUpdates') },
    { key: 'newEpisodes', label: i18n.t('notification.newEpisodes') },
    { key: 'newReleases', label: i18n.t('notification.newReleases') },
    { key: 'subscription', label: i18n.t('notification.subscription') },
];

const NotificationScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.userReducer);
    const [notificationSettings, setNotificationSettings] = useState<IUserNotificationSettings>(userState.notificationSettings);
    const [isActiveButton, setActiveButton] = useState<boolean>(false);

    const { updateNotificationSettings } = useUpdateNotificationSettings();

    useEffect(() => {
        setActiveButton(JSON.stringify(userState.notificationSettings) !== JSON.stringify(notificationSettings));
    }, [notificationSettings, userState.notificationSettings]);

    const handleToggle = useCallback((key: keyof IUserNotificationSettings, value: boolean) => {
        setNotificationSettings(prev => ({ ...prev, [key]: value }));
    }, []);

    const update = useCallback(async () => {
        const data = await updateNotificationSettings(notificationSettings);
        if (data) {
            setActiveButton(false);
            dispatch(setAlertSettings(notificationSettings));
        }
    }, [notificationSettings, dispatch, navigation]);

    return (
        <View style={styles.container}>
            <View>
                <BackButton navigation={navigation} text={i18n.t('profile.notification')} />
                {notificationFields.map(({ key, label }) => (
                    <View key={key} style={styles.containerSetting}>
                        <Text style={styles.textSetting}>{label}</Text>
                        <ToggleSwitch
                            isOn={notificationSettings[key]}
                            onToggle={(value: boolean) => handleToggle(key, value)} />
                    </View>
                ))}
            </View>

            {isActiveButton && (
                <ApplyButton
                    onPress={update}
                    isActiveButton={false}
                    style={styles.applyButton}
                    text={i18n.t('update')} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    applyButton: {
        width: '90%',
        marginBottom: 20,
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
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 15,
    },
});

export default NotificationScreen;