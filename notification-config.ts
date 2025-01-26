import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
  let token: string;
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } catch (error) {

  }

  return token;
}
