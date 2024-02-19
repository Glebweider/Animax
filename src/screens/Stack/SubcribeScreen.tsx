import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BackButton from '../../components/BackButton';
import CrownIcon from '../../components/icons/CrownIcon';
import CheckIcon from '../../components/icons/CheckIcon';

const SubcribeScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text="" />
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Subcribe to Premium</Text>
                <Text style={styles.headerText}>Enjoy watching Full-HD animes, without restrictions and without ads</Text>
            </View>
            <View style={styles.cardsContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('PaymentScreen', { 
                        objecyBuy: {
                            price: 0.99,
                            date: "month"
                        }
                    })}
                    style={styles.cardPremium}>
                    <View style={styles.cardHeader}>
                        <CrownIcon Color={'#06C149'} Width={70} Height={70} />
                        <View style={styles.cardHeaderTextContainer}>
                            <Text style={styles.cardHeaderTextPrice}>$0.99</Text>
                            <Text style={styles.cardHeaderTextMonth}>/month</Text>
                        </View>
                    </View>
                    <View style={styles.cardLine} />
                    <View style={styles.cardDataContainer}>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>Watch all you want. Ad-free.</Text>
                        </View>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>Allows streaming of 4k.</Text>
                        </View>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>Video & Audio Quality is Better.</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('PaymentScreen', { 
                        objecyBuy: {
                            price: 9.99,
                            date: "year"
                        }
                    })}
                    style={styles.cardPremium}>
                    <View style={styles.cardHeader}>
                        <CrownIcon Color={'#06C149'} Width={70} Height={70} />
                        <View style={styles.cardHeaderTextContainer}>
                            <Text style={styles.cardHeaderTextPrice}>$9.99</Text>
                            <Text style={styles.cardHeaderTextMonth}>/year</Text>
                        </View>
                    </View>
                    <View style={styles.cardLine} />
                    <View style={styles.cardDataContainer}>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>Watch all you want. Ad-free.</Text>
                        </View>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>Allows streaming of 4k.</Text>
                        </View>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>Video & Audio Quality is Better.</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    headerContainer: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 28,
    },
    headerText: {
        color: '#E0E0E0',
        fontFamily: 'Outfit',
        fontSize: 13,
        textAlign: 'center',
        justifyContent: 'center'
    },
    cardsContainer: {
        width: '90%',
        height: '70%',
    },
    cardPremium: {
        height: 294,
        width: '100%',
        borderColor: '#06C149',
        borderWidth: 3,
        marginTop: 25,
        borderRadius: 30
    },
    cardHeader: {
        alignItems: 'center',
        marginTop: 10
    },
    cardHeaderTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardHeaderTextPrice: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 20,
    },
    cardHeaderTextMonth: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
        marginLeft: 7
    },
    cardLine: {
        width: '80%',
        height: 1,
        backgroundColor: '#35383F',
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 15
    },
    cardDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardData: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginTop: 18
    },
    cardDataText: {
        marginLeft: 20,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
    }
});
    
export default SubcribeScreen;