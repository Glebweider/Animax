import { StyleSheet, View, Text, ScrollView } from 'react-native';

// Components
import BackButton from '@Components/buttons/Back';

// Data
import { COLOR_BACKGROUND_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';


const PrivacyPolicyScreen = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('profile.privacypolicy')} />
            <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>{i18n.t('privacyPolicy.section1')}</Text>
                <Text style={styles.contentText}>{i18n.t('privacyPolicy.section1Content')}</Text>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>{i18n.t('privacyPolicy.section2')}</Text>
                <Text style={styles.contentText}>{i18n.t('privacyPolicy.section2Content')}</Text>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.contentTitle}>{i18n.t('privacyPolicy.section3')}</Text>
                <Text style={styles.contentText}>{i18n.t('privacyPolicy.section3Content')}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: COLOR_BACKGROUND_PRIMARY,
        paddingBottom: 25,
        width: '100%',
    },
    contentContainer: {
        width: '90%',
        marginTop: 10,
    },
    contentTitle: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 18,
    },
    contentText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 12,
        marginLeft: 20,
    }
});

export default PrivacyPolicyScreen;