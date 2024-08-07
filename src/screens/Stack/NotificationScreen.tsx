import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import BackButton from '@Components/BackButton';

//Utils
import { i18n } from '@Utils/localization';
import ToggleSwitch from '@Components/ToggleSwitch';


const NotificationScreen = ({ navigation }) => {
    const [generalNotification, setGeneralNotification] = useState(true);
    const [newArrival, setNewArrival] = useState(true);
    const [newServicesAvailable, setNewServicesAvailable] = useState(true);
    const [appUpdates, setAppUpdates] = useState(true);
    const [subscription, setSubscription] = useState(true);

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('profile.notification')} />
            <View style={styles.containerSetting}>
                <Text style={styles.textSetting}>{i18n.t('notification.generalNotification')}</Text>
                <ToggleSwitch isOn={generalNotification} onToggle={setGeneralNotification} />
            </View>
            <View style={styles.containerSetting}>
                <Text style={styles.textSetting}>{i18n.t('notification.newArrival')}</Text>
                <ToggleSwitch isOn={newArrival} onToggle={setNewArrival} />
            </View>
            <View style={styles.containerSetting}>
                <Text style={styles.textSetting}>{i18n.t('notification.newServicesAvailable')}</Text>
                <ToggleSwitch isOn={newServicesAvailable} onToggle={setNewServicesAvailable} />
            </View>
            <View style={styles.containerSetting}>
                <Text style={styles.textSetting}>{i18n.t('notification.appUpdates')}</Text>
                <ToggleSwitch isOn={appUpdates} onToggle={setAppUpdates} />
            </View>
            <View style={styles.containerSetting}>
                <Text style={styles.textSetting}>{i18n.t('notification.subscription')}</Text>
                <ToggleSwitch isOn={subscription} onToggle={setSubscription} />
            </View>
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