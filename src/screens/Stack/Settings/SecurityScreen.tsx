import { StyleSheet, View} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@Redux/store';
import { StatusBar } from 'expo-status-bar';
import { i18n } from '@Utils/localization';
import BackButton from '@Components/BackButton';

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
        backgroundColor: '#181A20',
    },
});
    
export default SecurityScreen;