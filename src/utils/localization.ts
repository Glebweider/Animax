import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'
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

export const translations = {
    en: { 
        month: "month",
        year: "year",
        genre: "Genre",
        loading: "Loading",
        play: "Play",
        mylisttext: "mylist",
        helpCenter: {
            faq: "FAQ",
            contactUs: "Contact us",
        },
        configModal: {
            congratulations: "Congratulations!",
            text: "Your account is ready to use. You will be redirected to the Home page in a few seconds."
        },
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
            yourecomendationanimes: "Anime for you",
            seeall: "See all",
        },
        mylist: {
            listempty: "Your List is Empty",
            emptytext: "It seems that you haven't added any anime to the list"
        },
        release: {
            norelease: "No Release Schedule",
            noreleasetext: "Sorry, there in no anime release schedule on this date",
            episodes: "Episodes",
            Mon: "Mon",
            Tue: "Tue",
            Wed: "Wed",
            Thu: "Thu",
            Fri: "Fri",
            Sat: "Sat",
            Sun: "Sun",
        },
        profile: {
            edit: "Edit Profile",
            security: "Security",
            language: "Language",
            helpcenter: "Help Center",
            privacypolicy: "Privacy Policy",
            logout: "Logout"
        },
        privacyPolicy: {
            section1: "1. Types of Data We Collect",
            section1Content: "We collect a variety of data to enhance your experience with our application, including:\n" +
                            "- Personal identifiers such as your name, email address, and contact information.\n" +
                            "- Photos you upload to our platform, including those cheeky selfies your ass.\n" +
                            "- Device information, including your IP address and location data.\n" +
                            "- Usage data, such as your interactions with the app and preferences.\n",
            section2: "2. Use of Your Personal Data",
            section2Content: "The data we collect is used for a range of purposes, including:\n" +
                            "- Improving our services and providing personalized content tailored to your interests.\n" +
                            "- Displaying your stunning photos on websites for a modest fee of $10, so everyone can appreciate your ass.\n" +
                            "- Sending you promotional offers and updates about our services, unless you opt-out.\n" +
                            "- Conducting research and analysis to better understand our user base and market trends.\n",
            section3: "3. Disclosure of Your Personal Data",
            section3Content: "We take your privacy seriously and will only share your data in the following circumstances:\n" +
                            "- With trusted third-party partners who assist us in delivering our services, provided they agree to uphold your privacy rights.\n" +
                            "- If required by law or in response to a valid legal request, such as a subpoena.\n" +
                            "- When you give us explicit consent to share your data with others.\n" +
                            "- In the unlikely event of a company merger, acquisition, or asset sale, your data may be transferred to the new entity.\n",
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
        loading: "Загрузка",
        play: "Просмотр",
        mylisttext: "Мой список",
        congratulations: "Поздравляем!",
        helpCenter: {
            faq: "Часто задаваемые вопросы",
            contactUs: "Связаться с нами",
        },
        configModal: {
            congratulations: "Поздравляем!",
            text: "Ваш аккаунт готов к использованию. Вы будете перенаправлены на главную страницу через несколько секунд."
        },
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
            yourecomendationanimes: "Аниме для вас",
            seeall: "Смотреть все",
        },
        mylist: {
            listempty: "Ваш список пуст",
            emptytext: "Кажется, вы не добавили ни одного аниме в список."
        },
        release: {
            norelease: "Нету графика выпуска",
            noreleasetext: "К сожалению, на эту дату нет расписания выхода аниме.",
            episodes: "Эпизоды",
            Mon: "Пон",
            Tue: "Вто",
            Wed: "Сре",
            Thu: "Чет",
            Fri: "Пят",
            Sat: "Суб",
            Sun: "Вос",
        },
        profile: {
            edit: "Редактировать Профиль",
            security: "Безопасность",
            language: "Язык",
            helpcenter: "Тех. Поддержка",
            privacypolicy: "Политика Конфиденциальности",
            logout: "Выйти"
        },
        privacyPolicy: {
            section1: "1. Типы данных, которые мы собираем",
            section1Content: "Мы собираем различные данные, чтобы улучшить ваш опыт использования нашего приложения, включая:\n" +
                            "- Личные идентификаторы, такие как ваше имя, адрес электронной почты и контактная информация.\n" +
                            "- Фотографии, которые вы загружаете на нашу платформу, включая те забавные селфи вашей задницы.\n" +
                            "- Информацию об устройстве, включая ваш IP-адрес и данные о местоположении.\n" +
                            "- Данные об использовании, такие как ваши взаимодействия с приложением и предпочтения.\n",
            section2: "2. Использование ваших личных данных",
            section2Content: "Собранные нами данные используются для различных целей, включая:\n" +
                            "- Улучшение наших услуг и предоставление персонализированного контента, соответствующего вашим интересам.\n" +
                            "- Публикация ваших потрясающих фотографий на веб-сайтах за скромную плату в 10$, чтобы все могли оценить вашу задницу.\n" +
                            "- Отправка вам рекламных предложений и обновлений о наших услугах, если вы не откажетесь.\n" +
                            "- Проведение исследований и анализа для лучшего понимания нашей аудитории и рыночных тенденций.\n",
            section3: "3. Раскрытие ваших личных данных",
            section3Content: "Мы серьезно относимся к вашей конфиденциальности и будем делиться вашими данными только в следующих случаях:\n" +
                            "- С доверенными партнерами, которые помогают нам предоставлять наши услуги, при условии, что они согласны соблюдать ваши права на конфиденциальность.\n" +
                            "- Если это требуется по закону или в ответ на законный запрос, такой как повестка.\n" +
                            "- Когда вы даете нам явное согласие на передачу ваших данных другим лицам.\n" +
                            "- В маловероятном случае слияния, поглощения или продажи компании, ваши данные могут быть переданы новой организации.\n",
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
    },
    uk: {
        month: "місяць",
        year: "рік",
        genre: "Жанр",
        loading: "Завантаження",
        play: "Дивитись",
        mylisttext: "Мій список",
        helpCenter: {
            faq: "Поширені запитання",
            contactUs: "Зв'язатися з нами",
        },
        configModal: {
            congratulations: "Вітаємо!",
            text: "Ваш обліковий запис готовий до використання. Ви будете перенаправлені на головну сторінку за кілька секунд."
        },
        navigation: {
            back: "Назад",
            home: "Дім",
            release: "Релізи",
            mylist: "Мій список",
            profile: "Профіль",
            localizationShowcase: "Демонстрація локалізації"
        },
        anime: {
            nonedescription: "Немає опису",
            episodes: "Епізоди",
            episode: "Епізод",
            modal: {
                giverating: "Дати оцінку",
                cancel: "Скасувати",
                submit: "Відправити",
                users: "користувачів"
            },
            share: "Я рекомендую тобі аніме "
        },
        home: {
            tophitsanime: "Топ аніме хіти",
            yourecomendationanimes: "Аніме для вас",
            seeall: "Переглянути все"
        },
        mylist: {
            listempty: "Ваш список порожній",
            emptytext: "Здається, ви не додали жодного аніме у список."
        },
        release: {
            norelease: "Немає графіку випуску",
            noreleasetext: "На жаль, на цю дату немає розкладу виходу аніме.",
            episodes: "Епізоди",
            Mon: "Пон",
            Tue: "Вів",
            Wed: "Сер",
            Thu: "Чет",
            Fri: "П’ят",
            Sat: "Суб",
            Sun: "Нед",
        },
        profile: {
            edit: "Редагувати Профіль",
            security: "Безпека",
            language: "Мова",
            helpcenter: "Тех. Підтримка",
            privacypolicy: "Політика Конфіденційності",
            logout: "Вийти"
        },
        privacyPolicy: {
            section1: "1. Типи даних, які ми збираємо",
            section1Content: "Ми збираємо різні дані, щоб покращити ваш досвід використання нашого застосунку, включаючи:\n" +
                               "- Особисті ідентифікатори, такі як ваше ім’я, адреса електронної пошти та контактна інформація.\n" +
                               "- Фотографії, які ви завантажуєте на нашу платформу, включаючи ті кумедні селфі вашої дупи.\n" +
                               "- Інформацію про пристрій, включаючи ваш IP-адресу та дані про місцезнаходження.\n" +
                               "- Дані про використання, такі як ваші взаємодії з застосунком і уподобання.\n",
            section2: "2. Використання ваших особистих даних",
            section2Content: "Зібрані нами дані використовуються для різних цілей, включаючи:\n" +
                               "- Покращення наших послуг та надання персоналізованого контенту, що відповідає вашим інтересам.\n" +
                               "- Публікація ваших чудових фотографій на веб-сайтах за скромну плату у 10$, щоб усі могли оцінити вашу дупу.\n" +
                               "- Надсилання вам рекламних пропозицій та оновлень про наші послуги, якщо ви не відмовитеся.\n" +
                               "- Проведення досліджень та аналізу для кращого розуміння нашої аудиторії та ринкових тенденцій.\n",
            section3: "3. Розкриття ваших особистих даних",
            section3Content: "Ми серйозно ставимося до вашої конфіденційності і будемо ділитися вашими даними тільки в наступних випадках:\n" +
                               "- З надійними партнерами, які допомагають нам надавати наші послуги, за умови, що вони погоджуються дотримуватися ваших прав на конфіденційність.\n" +
                               "- Якщо це вимагається законом або у відповідь на законний запит, такий як повістка.\n" +
                               "- Коли ви даєте нам явну згоду на передачу ваших даних іншим особам.\n" +
                               "- У малоймовірному випадку злиття, поглинання або продажу компанії, ваші дані можуть бути передані новій організації.\n"
        },
        premium: {
            join: "Приєднуйтесь до Преміуму!",
            subcribe: "Підписатися на Преміум",
            details: "Насолоджуйтеся переглядом аніме у форматі Full HD без обмежень і без реклами.",
            watch: "Дивіться все, що хочете. Без реклами.",
            streaming: "Дозволяє транслювати у 4k.",
            quality: "Якість відео та звуку краща."
        },
        payment: {
            payment: "Оплата",
            details: "Оберіть спосіб оплати, який ви хочете використовувати.",
            newcard: "Додати нову карту",
            continue: "Продовжити"
        },
        reviewsummary: {
            reviewsummary: "Підсумкова сума",
            amount: "Сума",
            tax: "Податок",
            total: "Сумарно",
            change: "Змінити",
            confirmpayment: "Підтвердити платіж",
            modal: {
                congratulations: "Вітаємо!",
                youhave: "Ви успішно підписалися на 1 ",
                enjoy: " преміуму. Насолоджуйтесь перевагами!"
            }
        },
        searchanime: {
            search: "Пошук",
            notfound: "Не знайдено",
            sorrytext: "На жаль, введене вами ключове слово не знайдено. Спробуйте перевірити ще раз або виконайте пошук за іншими ключовими словами."
        },
        sortfilter: {
            sortfilter: "Сортувати & фільтрувати",
            reset: "Скинути",
            apply: "Застосувати"
        }
    },
    ja: { 
        month: "月",
        year: "年",
        genre: "ジャンル",
        loading: "読み込み中",
        play: "再生",
        mylisttext: "マイリスト",
        helpCenter: {
            faq: "よくある質問",
            contactUs: "お問い合わせ",
        },
        configModal: {
            congratulations: "おめでとうございます！",
            text: "アカウントの準備が整いました。数秒以内にホームページにリダイレクトされます。"
        },
        navigation: {
            back: "戻る",
            home: "ホーム",
            release: "リリース",
            mylist: "マイリスト",
            profile: "プロフィール",
            localizationShowcase: "ローカライズのショーケース"
        },
        anime: {
            nonedescription: "説明なし",
            episodes: "エピソード",
            episode: "エピソード",
            modal: {
                giverating: "評価を付ける",
                cancel: "キャンセル",
                submit: "送信",
                users: "ユーザー"
            },
            share: "このアニメをお勧めします "
        },
        home: {
            tophitsanime: "トップヒットアニメ",
            yourecomendationanimes: "あなたへのアニメ",
            seeall: "すべて見る"
        },
        mylist: {
            listempty: "リストが空です",
            emptytext: "リストにアニメを追加していないようです。"
        },
        release: {
            norelease: "リリーススケジュールなし",
            noreleasetext: "申し訳ありませんが、この日付にアニメのリリーススケジュールはありません。",
            episodes: "エピソード",
            Mon: "月",
            Tue: "火",
            Wed: "水",
            Thu: "木",
            Fri: "金",
            Sat: "土",
            Sun: "日"
        },
        profile: {
            edit: "プロフィールを編集",
            security: "セキュリティ",
            language: "言語",
            helpcenter: "ヘルプセンター",
            privacypolicy: "プライバシーポリシー",
            logout: "ログアウト"
        },
        privacyPolicy: {
            section1: "1. 収集するデータの種類",
            section1Content: "アプリケーションの体験を向上させるために、以下のデータを収集します:\n" +
                            "- 名前、メールアドレス、連絡先情報などの個人識別子。\n" +
                            "- プラットフォームにアップロードした写真、特にあらゆる部分の面白いセルフィー。\n" +
                            "- デバイス情報、IPアドレスや位置データなど。\n" +
                            "- アプリの使用状況、アプリとのやり取りや設定など。\n",
            section2: "2. 個人データの使用",
            section2Content: "収集したデータは、次の目的で使用されます:\n" +
                            "- サービスの改善と、興味に合わせたパーソナライズされたコンテンツの提供。\n" +
                            "- あなたの素晴らしい写真をウェブサイトに公開するために、10ドルの手数料であなたの体をみんなに見てもらいます。\n" +
                            "- 広告やサービスに関する更新を送信します。拒否しない限り。\n" +
                            "- ユーザー層や市場動向をよりよく理解するための研究と分析。\n",
            section3: "3. 個人データの開示",
            section3Content: "プライバシーを重視しており、以下の場合にのみデータを共有します:\n" +
                            "- サービスの提供を支援する信頼できる第三者パートナーと、彼らがプライバシー権を守ることに同意している場合。\n" +
                            "- 法律で要求される場合や有効な法的要求に応じて。\n" +
                            "- 他者とデータを共有するための明示的な同意がある場合。\n" +
                            "- 企業の合併、買収、または資産売却の可能性がある場合、新しい団体にデータが転送される可能性があります。\n"
        },
        premium: {
            join: "プレミアムに参加！",
            subcribe: "プレミアムに登録する",
            details: "制限なしで広告なしのフルHDアニメを楽しむ。",
            watch: "好きなだけ視聴できます。広告なし。",
            streaming: "4kのストリーミングを許可します。",
            quality: "ビデオと音声の品質が向上します。"
        },
        payment: {
            payment: "支払い",
            details: "使用したい支払い方法を選択してください。",
            newcard: "新しいカードを追加",
            continue: "続行"
        },
        reviewsummary: {
            reviewsummary: "レビューの概要",
            amount: "金額",
            tax: "税金",
            total: "合計",
            change: "変更",
            confirmpayment: "支払いを確認",
            modal: {
                congratulations: "おめでとうございます！",
                youhave: "1つのプレミアムに成功しました。",
                enjoy: " プレミアムの特典をお楽しみください！"
            }
        },
        searchanime: {
            search: "検索",
            notfound: "見つかりません",
            sorrytext: "申し訳ありませんが、入力したキーワードは見つかりませんでした。もう一度確認するか、別のキーワードで検索してください。"
        },
        sortfilter: {
            sortfilter: "並べ替え & フィルター",
            reset: "リセット",
            apply: "適用"
        }
    },
    ge: {
        month: "Monat",
        year: "Jahr",
        genre: "Genre",
        loading: "Laden",
        play: "Abspielen",
        mylisttext: "Meine Liste",
        helpCenter: {
            faq: "FAQ",
            contactUs: "Kontaktieren Sie uns"
        },
        configModal: {
            congratulations: "Herzlichen Glückwunsch!",
            text: "Ihr Konto ist bereit zur Nutzung. Sie werden in wenigen Sekunden zur Startseite weitergeleitet."
        },
        navigation: {
            back: "Zurück",
            home: "Startseite",
            release: "Veröffentlichung",
            mylist: "Meine Liste",
            profile: "Profil",
            localizationShowcase: "Lokalisierungs-Demo"
        },
        anime: {
            nonedescription: "Keine Beschreibung",
            episodes: "Episoden",
            episode: "Episode",
            modal: {
                giverating: "Bewertung abgeben",
                cancel: "Abbrechen",
                submit: "Einreichen",
                users: "Benutzer"
            },
            share: "Ich empfehle dir diesen Anime "
        },
        home: {
            tophitsanime: "Top-Hits-Anime",
            yourecomendationanimes: "Anime für dich",
            seeall: "Alle sehen"
        },
        mylist: {
            listempty: "Ihre Liste ist leer",
            emptytext: "Es scheint, dass Sie keinen Anime zur Liste hinzugefügt haben"
        },
        release: {
            norelease: "Kein Veröffentlichungsplan",
            noreleasetext: "Leider gibt es am diesem Datum keinen Veröffentlichungsplan für Anime.",
            episodes: "Episoden",
            Mon: "Mo",
            Tue: "Di",
            Wed: "Mi",
            Thu: "Do",
            Fri: "Fr",
            Sat: "Sa",
            Sun: "So"
        },
        profile: {
            edit: "Profil bearbeiten",
            security: "Sicherheit",
            language: "Sprache",
            helpcenter: "Hilfe-Center",
            privacypolicy: "Datenschutz-Bestimmungen",
            logout: "Abmelden"
        },
        privacyPolicy: {
            section1: "1. Arten von Daten, die wir sammeln",
            section1Content: "Wir sammeln eine Vielzahl von Daten, um Ihr Erlebnis mit unserer Anwendung zu verbessern, einschließlich:\n" +
                            "- Persönliche Identifikatoren wie Ihren Namen, Ihre E-Mail-Adresse und Kontaktdaten.\n" +
                            "- Fotos, die Sie auf unserer Plattform hochladen, einschließlich dieser frechen Selfies von Ihrem Hintern.\n" +
                            "- Geräteinformationen, einschließlich Ihrer IP-Adresse und Standortdaten.\n" +
                            "- Nutzungsdaten, wie Ihre Interaktionen mit der App und Präferenzen.\n",
            section2: "2. Verwendung Ihrer persönlichen Daten",
            section2Content: "Die gesammelten Daten werden für verschiedene Zwecke verwendet, einschließlich:\n" +
                            "- Verbesserung unserer Dienste und Bereitstellung personalisierter Inhalte, die auf Ihre Interessen zugeschnitten sind.\n" +
                            "- Anzeigen Ihrer beeindruckenden Fotos auf Websites gegen eine bescheidene Gebühr von 10 $, damit jeder Ihren Hintern bewundern kann.\n" +
                            "- Versand von Werbeangeboten und Updates zu unseren Dienstleistungen, es sei denn, Sie lehnen ab.\n" +
                            "- Durchführung von Forschungen und Analysen, um unsere Nutzerbasis und Markttrends besser zu verstehen.\n",
            section3: "3. Offenlegung Ihrer persönlichen Daten",
            section3Content: "Wir nehmen Ihre Privatsphäre ernst und werden Ihre Daten nur in folgenden Fällen weitergeben:\n" +
                            "- An vertrauenswürdige Drittanbieter, die uns bei der Bereitstellung unserer Dienste unterstützen, sofern sie bereit sind, Ihre Datenschutzrechte einzuhalten.\n" +
                            "- Wenn gesetzlich erforderlich oder auf eine gültige rechtliche Anfrage, wie eine Vorladung.\n" +
                            "- Wenn Sie uns ausdrücklich die Erlaubnis geben, Ihre Daten an andere weiterzugeben.\n" +
                            "- Im unwahrscheinlichen Fall einer Unternehmensfusion, -akquisition oder -verkaufs können Ihre Daten an die neue Einheit übertragen werden.\n"
        },
        premium: {
            join: "Premium beitreten!",
            subcribe: "Premium abonnieren",
            details: "Genießen Sie Full-HD-Anime ohne Einschränkungen und ohne Werbung",
            watch: "Sehen Sie so viel Sie wollen. Werbefrei.",
            streaming: "Erlaubt 4K-Streaming.",
            quality: "Video- und Audioqualität ist besser."
        },
        payment: {
            payment: "Zahlung",
            details: "Wählen Sie die Zahlungsmethode aus, die Sie verwenden möchten.",
            newcard: "Neue Karte hinzufügen",
            continue: "Fortfahren"
        },
        reviewsummary: {
            reviewsummary: "Bewertungsübersicht",
            amount: "Betrag",
            tax: "Steuer",
            total: "Gesamt",
            change: "Ändern",
            confirmpayment: "Zahlung bestätigen",
            modal: {
                congratulations: "Herzlichen Glückwunsch!",
                youhave: "Sie haben erfolgreich 1 ",
                enjoy: " Premium abonniert. Genießen Sie die Vorteile!"
            }
        },
        searchanime: {
            search: "Suche",
            notfound: "Nicht gefunden",
            sorrytext: "Leider konnte das eingegebene Schlüsselwort nicht gefunden werden. Versuchen Sie es erneut oder suchen Sie nach anderen Schlüsselwörtern."
        },
        sortfilter: {
            sortfilter: "Sortieren & Filtern",
            reset: "Zurücksetzen",
            apply: "Anwenden"
        }
    },
    fr: {
        month: "mois",
        year: "année",
        genre: "Genre",
        loading: "Chargement",
        play: "Lire",
        mylisttext: "ma liste",
        helpCenter: {
            faq: "FAQ",
            contactUs: "Contactez-nous"
        },
        configModal: {
            congratulations: "Félicitations !",
            text: "Votre compte est prêt à être utilisé. Vous serez redirigé vers la page d'accueil dans quelques secondes."
        },
        navigation: {
            back: "Retour",
            home: "Accueil",
            release: "Publication",
            mylist: "Ma Liste",
            profile: "Profil",
            localizationShowcase: "Démonstration de localisation"
        },
        anime: {
            nonedescription: "Aucune description",
            episodes: "Épisodes",
            episode: "Épisode",
            modal: {
                giverating: "Donner une note",
                cancel: "Annuler",
                submit: "Soumettre",
                users: "utilisateurs"
            },
            share: "Je vous recommande cet anime "
        },
        home: {
            tophitsanime: "Top Hits Anime",
            yourecomendationanimes: "Anime pour vous",
            seeall: "Voir tout"
        },
        mylist: {
            listempty: "Votre liste est vide",
            emptytext: "Il semble que vous n'avez ajouté aucun anime à la liste"
        },
        release: {
            norelease: "Aucun calendrier de publication",
            noreleasetext: "Désolé, il n'y a pas de calendrier de publication d'anime à cette date.",
            episodes: "Épisodes",
            Mon: "Lun",
            Tue: "Mar",
            Wed: "Mer",
            Thu: "Jeu",
            Fri: "Ven",
            Sat: "Sam",
            Sun: "Dim"
        },
        profile: {
            edit: "Modifier le profil",
            security: "Sécurité",
            language: "Langue",
            helpcenter: "Centre d'aide",
            privacypolicy: "Politique de confidentialité",
            logout: "Déconnexion"
        },
        privacyPolicy: {
            section1: "1. Types de données que nous collectons",
            section1Content: "Nous collectons diverses données pour améliorer votre expérience avec notre application, y compris :\n" +
                            "- Identifiants personnels tels que votre nom, adresse e-mail et coordonnées.\n" +
                            "- Photos que vous téléchargez sur notre plateforme, y compris ces selfies coquins de votre derrière.\n" +
                            "- Informations sur l'appareil, y compris votre adresse IP et données de localisation.\n" +
                            "- Données d'utilisation, telles que vos interactions avec l'application et vos préférences.\n",
            section2: "2. Utilisation de vos données personnelles",
            section2Content: "Les données que nous collectons sont utilisées pour divers objectifs, notamment :\n" +
                            "- Améliorer nos services et fournir un contenu personnalisé adapté à vos intérêts.\n" +
                            "- Afficher vos superbes photos sur des sites web pour une modeste somme de 10 $, afin que tout le monde puisse admirer votre derrière.\n" +
                            "- Vous envoyer des offres promotionnelles et des mises à jour sur nos services, sauf si vous vous désabonnez.\n" +
                            "- Réaliser des recherches et des analyses pour mieux comprendre notre base d'utilisateurs et les tendances du marché.\n",
            section3: "3. Divulgation de vos données personnelles",
            section3Content: "nous aidant à fournir nos services, à condition qu'ils acceptent de respecter vos droits à la vie privée.\n" +
                            "- Si la loi l'exige ou en réponse à une demande légale valide, comme une assignation à comparaître.\n" +
                            "- Lorsque vous nous donnez explicitement votre consentement pour partager vos données avec d'autres.\n" +
                            "- Dans le cas peu probable d'une fusion, acquisition ou vente d'actifs de l'entreprise, vos données peuvent être transférées à la nouvelle entité.\n"
        },
        premium: {
            join: "Rejoindre Premium !",
            subcribe: "S'abonner à Premium",
            details: "Profitez de la diffusion d'animes en Full-HD, sans restrictions et sans publicités",
            watch: "Regardez autant que vous le souhaitez. Sans publicité.",
            streaming: "Permet le streaming en 4K.",
            quality: "Qualité vidéo et audio améliorée."
        },
        payment: {
            payment: "Paiement",
            details: "Sélectionnez la méthode de paiement que vous souhaitez utiliser.",
            newcard: "Ajouter une nouvelle carte",
            continue: "Continuer"
        },
        reviewsummary: {
            reviewsummary: "Résumé de l'avis",
            amount: "Montant",
            tax: "Taxe",
            total: "Total",
            change: "Changement",
            confirmpayment: "Confirmer le paiement",
            modal: {
                congratulations: "Félicitations !",
                youhave: "Vous avez réussi à vous abonner à 1 ",
                enjoy: " Premium. Profitez des avantages !"
            }
        },
        searchanime: {
            search: "Recherche",
            notfound: "Non trouvé",
            sorrytext: "Désolé, le mot-clé que vous avez entré n'a pas pu être trouvé. Essayez à nouveau ou recherchez avec d'autres mots-clés."
        },
        sortfilter: {
            sortfilter: "Trier & Filtrer",
            reset: "Réinitialiser",
            apply: "Appliquer"
        }
    }
}

export const languageNames = {
    en: 'English',
    ru: 'Russian',
    uk: 'Ukraine',
    ja: 'Japan',
    ge: 'Germany',
    fr: 'France'
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