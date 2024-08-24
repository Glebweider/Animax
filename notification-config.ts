import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
  let token: string;
  
  // Запрос разрешений на уведомления
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Проверка, что разрешения предоставлены
  if (finalStatus !== 'granted') {
    return;
  }

  // Получение токена
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } catch (error) {

  }

  return token;
}
