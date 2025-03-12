import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BackButton from '@Components/BackButton';
import { i18n, languageNames, translations } from '@Utils/localization';
import { saveLocalizationToStorage } from '@Utils/localization';
import * as Updates from 'expo-updates';
import { useAlert } from '@Components/AlertContext';

const LanguageScreen = ({ navigation }) => {
    const languageOptions = Object.keys(translations);
    const { showAlert } = useAlert();

    const handleChangeLanguage = async (lang: string) => {
        try {
            await saveLocalizationToStorage(lang);
            i18n.locale = lang;
            await Updates.reloadAsync();
        } catch (error) {
            showAlert(error);
        }
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('profile.language')} />
            <Text style={styles.cautionLangText}>{i18n.t('caution_lang')}</Text>
            {languageOptions.map((lang) => (
                <TouchableOpacity 
                    key={lang}
                    onPress={() => handleChangeLanguage(lang)}
                    style={styles.laguageContainer} >
                    <Text style={styles.laguageText}>{languageNames[lang] || lang.toUpperCase()}</Text>
                    <View style={styles.buttonSelect}>
                        {i18n.locale == lang && (
                            <View style={styles.buttonSelected}/>
                        )}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    cautionLangText: {
        color: '#06C149',
        fontSize: 18,
        fontFamily: 'Outfit',
        marginHorizontal: 20,
        marginBottom: 15,
    },
    laguageContainer: {
        width: "90%",
        height: 65,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#2D3036',
        borderRadius: 10,
    },
    laguageText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Outfit',
        marginLeft: 20,
    },
    buttonSelect: {
        width: 21,
        height: 21,
        borderRadius: 50,
        borderColor: '#06C149',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    buttonSelected: {
        width: 11,
        height: 11,
        borderRadius: 40,
        backgroundColor: '#06C149',
    },
});
    
export default LanguageScreen;