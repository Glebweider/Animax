import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokenToStorage = async (token: string) => {
	try {
		await AsyncStorage.setItem('authToken', token);
	} catch (error) {
		console.error('Error when saving AUTH token:', error);
	}
};

export const getTokenFromStorage = async () => {
	try {
		let token = await AsyncStorage.getItem('authToken');
		if (!token)
			return;

		return token;
	} catch (error) {
		console.error('Error when receiving AUTH token:', error);
		return null;
	}
};

export const existsTokenInStorage = async (): Promise<boolean> => {
	try {
		const token = await AsyncStorage.getItem('authToken');
		return token !== null && token !== undefined && token !== '';
	} catch (error) {
		console.error('Error when checking AUTH token:', error);
		return false;
	}
};

export const removeTokenFromStorage = async () => {
	try {
		await AsyncStorage.removeItem('authToken');
	} catch (error) {
		console.error('Error when deleting an AUTH token from storage:', error);
	}
};
