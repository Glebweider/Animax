import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

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