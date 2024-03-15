import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'
import { getLocalizationFromStorage, saveLocalizationToStorage } from './utils/localization'

export const translations = {
    en: { 
        month: "month",
        year: "year",
        genre: "Genre",
        navigation: {
            back: 'Back',
            home: 'Home',
            release: 'Release',
            mylist: 'MyList',
            profile: 'Profile',
            localizationShowcase: 'Localization Showcase'
        },
        anime: {
            nonedescription: "None description",
            episodes: "Episodes",
            episode: "Episode",
            modal: {
                giverating: "Give Rating",
                cancel: "Cancel",
                submit: "Submit",
                users: "users"
            },
            share: "I recommend anime to you "
        },
        home: {
            tophitsanime: "Top Hits Anime",
            newepisodereleases: "New Episode Releases",
            seeall: "See all",
        },
        mylist: {
            listempty: "Your List is Empty",
            emptytext: "It seems that you haven't added any anime to the list"
        },
        release: {
            norelease: "No Release Schedule",
            noreleasetext: "Sorry, there in no anime release schedule on this date",
            episodes: "Episodes"
        },
        profile: {
            edit: "Edit Profile",
            security: "Security",
            language: "Language",
            helpcenter: "Help Center",
            privacypolicy: "Privacy Policy",
            logout: "Logout"
        },
        premium: {
            join: "Join Premium!",
            subcribe: "Subcribe to Premium",
            details: "Enjoy watching Full-HD animes, without restrictions and without ads",
            watch: "Watch all you want. Ad-free.",
            streaming: "Allows streaming of 4k.",
            quality: "Video & Audio Quality is Better."
        },
        payment: {
            payment: "Payment",
            details: "Select the payment method you want yo use.",
            newcard: "Add New Card",
            continue: "Continue",
        },
        reviewsummary: {
            reviewsummary: "Review Summary",
            amount: "Amount",
            tax: "Tax",
            total: "Total",
            change: "Change",
            confirmpayment: "Confirm Payment",
            modal: {
                congratulations: "Congratulations!",
                youhave: "Your have successfully subscribed 1 ",
                enjoy: " premium. Enjoy the benefits!"
            }
        },
        searchanime: {
            search: "Search",
            notfound: "Not Found",
            sorrytext: "Sorry, the keyword you entered could not be found. Try to check again or search with other keywords."
        },
        sortfilter: {
            sortfilter: "Sort & Filter",
            reset: "Reset",
            apply: "Apply",
        }
    },
    ru: {
        month: "месяц",
        year: "год",
        genre: "Жанр",
        navigation: {
            back: 'Назад',
            home: 'Дом',
            release: 'Релизы',
            mylist: 'Мой список',
            profile: 'Профиль',
            localizationShowcase: 'Демонстрация локализации'
        },
        anime: {
            nonedescription: "Нет описания",
            episodes: "Эпизоды",
            episode: "Эпизод",
            modal: {
                giverating: "Дать оценку",
                cancel: "Отмена",
                submit: "Отправить",
                users: "пользователей"
            },
            share: "Я рекомендую тебе аниме "
        },
        home: {
            tophitsanime: "Лучшие аниме хиты",
            newepisodereleases: "Выпуски новых эпизодов",
            seeall: "Смотреть все",
        },
        mylist: {
            listempty: "Ваш список пуст",
            emptytext: "Кажется, вы не добавили ни одного аниме в список."
        },
        release: {
            norelease: "Нету графика выпуска",
            noreleasetext: "К сожалению, на эту дату нет расписания выхода аниме.",
            episodes: "Эпизоды"
        },
        profile: {
            edit: "Редактировать Профиль",
            security: "Безопасность",
            language: "Язык",
            helpcenter: "Тех. Поддержка",
            privacypolicy: "Политика Конфиденциальности",
            logout: "Выйти"
        },
        premium: {
            join: "Присоединяйтесь к Премиуму!",
            subcribe: "Подписаться на Премиум",
            details: "Наслаждайтесь просмотром аниме в формате Full HD без ограничений и без рекламы.",
            watch: "Смотрите все, что хотите. Свободный от рекламы.",
            streaming: "Позволяет транслировать 4k.",
            quality: "Качество видео и звука лучше."
        },
        payment: {
            payment: "Оплата",
            details: "Выберите способ оплаты, который вы хотите использовать.",
            newcard: "Добавить новую карту",
            continue: "Продолжать",
        },
        reviewsummary: {
            reviewsummary: "Итоговая сумма",
            amount: "Сумма",
            tax: "Налог",
            total: "Суммарно",
            change: "Изменить",
            confirmpayment: "Подтвердить платеж",
            modal: {
                congratulations: "Поздравляем!",
                youhave: "Вы успешно подписались на 1 ",
                enjoy: " премиума. Наслаждайтесь преимуществами!"
            }
        },
        searchanime: {
            search: "Поиск",
            notfound: "Не найдено",
            sorrytext: "К сожалению, введенное вами ключевое слово не найдено. Попробуйте проверить еще раз или выполните поиск по другим ключевым словам."
        },
        sortfilter: {
            sortfilter: "Сортировать & фильтровать",
            reset: "Скинуть",
            apply: "Применить",
        }
    }
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