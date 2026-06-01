import { createMMKV } from 'react-native-mmkv'


export type IAnimeProgress = {
	animeId: string;
	episode: number;
	time: number;
};

export const storage = createMMKV()

// ==== Token ====
export const saveTokenToStorage = (token: string) => {
	storage.set('authToken', token);
};

export const getTokenFromStorage = () => {
	return storage.getString('authToken');
};

export const existsTokenInStorage = (): boolean => {
	return storage.contains('authToken');
};

export const removeTokenFromStorage = (): void => {
	storage.remove('authToken');
};

// ==== Localization ====
export const saveLocalizationToStorage = (languageCode: string) => {
	storage.set('Language', languageCode);
};

export const getLocalizationFromStorage = () => {
	return storage.getString('Language');
};

// ==== Settings ====
export const saveSettingsNSFWToStorage = (value: boolean) => {
	storage.set('Settings_NSFW', value);
};

export const getSettingsNSFWFromStorage = () => {
	return storage.getBoolean('Settings_NSFW');
};

// ==== Animes ====
export const saveAnimeProgressToStorage = (value: IAnimeProgress) => {
	const data = storage.getString('Anime_Progress');

	let list: IAnimeProgress[] = data ? JSON.parse(data) : [];

	const index = list.findIndex(item => item.animeId === value.animeId);
	if (index !== -1) {
		list[index] = value;
	} else {
		list.push(value);
	}

	storage.set('Anime_Progress', JSON.stringify(list));
};

export const getAnimeProgressFromStorage = (): IAnimeProgress[] => {
	const data = storage.getString('Anime_Progress');
	return data ? JSON.parse(data) : [];
};

export const getAnimeProgressById = (animeId: string): IAnimeProgress | null => {
	const list = getAnimeProgressFromStorage();

	return list.find(item => item.animeId === animeId) || null;
};

export const saveAnimeVolumeToStorage = (value: number) => {
	storage.set('Anime_Volume', value);
};

export const getAnimeVolumeToStorage = (): number => {
	return storage.getNumber('Anime_Volume');
};