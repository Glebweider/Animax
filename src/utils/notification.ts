import * as Notifications from 'expo-notifications';

const sendNotification = async (title: string, content: string) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: content,
        },
        trigger: null,
    });
}

export default sendNotification;