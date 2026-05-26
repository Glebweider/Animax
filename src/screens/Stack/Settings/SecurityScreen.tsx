import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

// Components
import BackButton from '@Components/buttons/Back';

// Data
import { COLOR_BACKGROUND_PRIMARY } from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';

// Redux
import { RootState } from '@Redux/store';


const SecurityScreen = ({ navigation }) => {
    const userState = useSelector((state: RootState) => state.userReducer);

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <BackButton navigation={navigation} text={i18n.t('profile.security')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: COLOR_BACKGROUND_PRIMARY,
    },
});

export default SecurityScreen;