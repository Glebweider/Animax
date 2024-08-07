import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

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
    Alert.alert('Не удалось получить разрешение на push-уведомления!');
    return;
  }

  // Получение токена
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } catch (error) {
    console.error('Ошибка при получении push-токена:', error);
  }

  console.log('Push token:', token);
  return token;
}
