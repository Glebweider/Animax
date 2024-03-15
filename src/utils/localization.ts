import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLocalizationToStorage = async (languageCode: string) => {
  try {
    await AsyncStorage.setItem('Language', languageCode);
  } catch (error) {
    console.error('Error when saving Language:', error);
  }
};

export const getLocalizationFromStorage = async () => {
  try {
    let token = await AsyncStorage.getItem('Language');
    if (!token) {
      return;
    }
    return token;
  } catch (error) {
    console.error('Error when receiving Language:', error);
    return null;
  }
};