import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import en_Eng from '@locales/en_Eng.json';
import fr_Fra from '@locales/fr_Fra.json';
import de_Ger from '@locales/de_Ger.json';
import it_Ita from '@locales/it_Ita.json';
import ja_Jap from '@locales/ja_Jap.json';
import ru_Rus from '@locales/ru_Rus.json';
import uk_Ukr from '@locales/uk_Ukr.json';

export const saveLocalizationToStorage = async (languageCode: string) => {
    try {
        await AsyncStorage.setItem('Language', languageCode);
    } catch (error) {
        console.error('Error when saving Language:', error);
    }
};

export const getLocalizationFromStorage = async () => {
    try {
        let localization = await AsyncStorage.getItem('Language');
        if (!localization) {
            return;
        }
        return localization;
    } catch (error) {
        console.error('Error when receiving Language:', error);
        alert('Error when receiving Language')
        return null;
    }
};

export const translations = {
    en: en_Eng,
    fr: fr_Fra,
    de: de_Ger,
    it: it_Ita,
    ja: ja_Jap,
    ru: ru_Rus,
    uk: uk_Ukr
}

export const languageNames = {
    en: 'English',
    ru: 'Russian',
    uk: 'Ukraine',
    ja: 'Japan',
    de: 'Germany',
    fr: 'France',
    it: 'Italy'
}

export let i18n = new I18n(translations)

const setAppLanguage = async () => {
    const language = await getLocalizationFromStorage();

    if (language) {
        i18n.locale = language;
    } else {
        i18n.locale = Localization.getLocales()[0].languageCode ?? 'en';
        if (Localization.getLocales()[0].languageCode) {
            await saveLocalizationToStorage(Localization.getLocales()[0].languageCode)
        } else {
            await saveLocalizationToStorage('en')
        }
    }
};

setAppLanguage();

interface LocaleData {
    languageCode: string | null;
    currencySymbol: string | null;
}

export const getLocaleData = (): LocaleData => {
    const {languageCode, currencySymbol} = Localization.getLocales()[0]
    return {
        languageCode, currencySymbol
    }
}