import * as FileSystem from 'expo-file-system';

export interface ICachedMyFavoriteGenres {
    id: string;
    genres: {
        id: string;
        russian: string;
    }[];
}

const CACHE_FILE_PATH = `${FileSystem.cacheDirectory}my_favorite_genres_cache.json`;

export const CacheMyFavoriteGenresService = {
    saveList: async (list: ICachedMyFavoriteGenres[]): Promise<void> => {
        try {
            const jsonString = JSON.stringify(list);
            await FileSystem.writeAsStringAsync(CACHE_FILE_PATH, jsonString, {
                encoding: FileSystem.EncodingType.UTF8,
            });
            console.log(`[Cache] Успешно сохранено аниме в кэш: ${list.length} шт.`);
        } catch (error) {
            console.error('[Cache] Не удалось записать файл кэша:', error);
        }
    },

    getList: async (): Promise<ICachedMyFavoriteGenres[] | null> => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(CACHE_FILE_PATH);

            if (!fileInfo.exists) {
                return null;
            }

            const jsonString = await FileSystem.readAsStringAsync(CACHE_FILE_PATH, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            return JSON.parse(jsonString) as ICachedMyFavoriteGenres[];
        } catch (error) {
            console.error('[Cache] Не удалось прочитать файл кэша:', error);
            return null;
        }
    },

    clear: async (): Promise<void> => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(CACHE_FILE_PATH);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(CACHE_FILE_PATH);
                console.log('[Cache] Файл кэша успешно удален');
            }
        } catch (error) {
            console.error('[Cache] Ошибка при удалении файла кэша:', error);
        }
    }
};