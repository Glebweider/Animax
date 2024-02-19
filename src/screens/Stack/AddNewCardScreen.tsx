import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import BackButton from '../../components/BackButton';

const AddNewCardScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text="Payment" />
            <Image source={require('../../../assets/NewCard.png')} style={{}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },

});
    
export default AddNewCardScreen;