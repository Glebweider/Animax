import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BackButton from '../../components/BackButton';
import { i18n } from '../../localization';
import { saveLocalizationToStorage } from '../../utils/localization';

const LanguageScreen = ({ navigation }) => {

    const handleChangeLanguage = async (lang: string) => {
        await saveLocalizationToStorage(lang);
        i18n.locale = lang;
        alert('Перезапустите приложение для применения изменений')
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('profile.language')} />
            <TouchableOpacity 
                onPress={() => handleChangeLanguage('en')}
                style={styles.laguageContainer} >
                <Text style={styles.laguageText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => handleChangeLanguage('ru')}
                style={styles.laguageContainer} >
                <Text style={styles.laguageText}>Russian</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    laguageContainer: {
        width: 150,
        height: 70,
        borderColor: 'red',
        borderRadius: 50,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    laguageText: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Outfit',
    }
});
    
export default LanguageScreen;