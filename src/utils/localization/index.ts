import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'

// Utils
import { getLocalizationFromStorage, saveLocalizationToStorage } from '@Utils/functions';

// Data
import { translations } from '@Data/localizations';


interface LocaleData {
    languageCode: string | null;
    currencySymbol: string | null;
}

interface AnimeNames {
    name: string;
    russian?: string;
    japanese?: string;
    english?: string;
}

export let i18n = new I18n(translations)

const setAppLanguage = async () => {
    const language = getLocalizationFromStorage();

    if (language) {
        i18n.locale = language;
    } else {
        i18n.locale = Localization.getLocales()[0].languageCode ?? 'en';
        saveLocalizationToStorage(i18n.locale)
    }
};
setAppLanguage();

export const getLocaleData = (): LocaleData => {
    const { languageCode, currencySymbol } = Localization.getLocales()[0]
    return {
        languageCode, currencySymbol
    }
}

export const isCisLocale = i18n.locale === 'ru' || i18n.locale === 'uk';

export const formatAnimeTitle = (names: AnimeNames): string => {
    const mapper: Record<string, keyof AnimeNames> = {
        ru: 'russian',
        uk: 'russian',
        en: 'english',
        ja: 'japanese'
    };

    const targetKey = mapper[i18n.locale];

    return names[targetKey] || names.name;
};