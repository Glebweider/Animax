import { StyleSheet, View } from 'react-native';
import globalStyles from '@Styles/index';
import { useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';

// Components
import BackButton from '@Components/buttons/Back';

// Utils
import { i18n } from '@Utils/localization';

// Redux
import { RootState } from '@Redux/store';


const SecurityScreen = ({ navigation }) => {
    const userState = useSelector((state: RootState) => state.userReducer);

    return (
        <View style={globalStyles.FullScreen}>
            <StatusBar style='light' />
            <BackButton navigation={navigation} text={i18n.t('profile.security')} />
        </View>
    );
};

const styles = StyleSheet.create({
});

export default SecurityScreen;