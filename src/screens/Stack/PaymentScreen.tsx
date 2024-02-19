import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import BackButton from '../../components/BackButton';
import { useEffect, useState } from 'react';
import getPaymentMethods from '../../utils/fetch/getPaymentMethods';
import { getTokenFromStorage } from '../../utils/token';

const PaymentScreen = ({ navigation, route }) => {
    const [paymentMethods, setPaymentMethods] = useState<any>([]); 
    const [selectPaymentMethod, setSelectPaymentMethod] = useState<string>('PayPal');
    const { objecyBuy } = route.params;

    useEffect(() => {
        const fetchData = async () => {
            const token = await getTokenFromStorage();
            const paymentMethods = await getPaymentMethods(token);
            if (paymentMethods) {
                setPaymentMethods(paymentMethods);
            }
        };
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text="Payment" />
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Select the payment method you want yo use.</Text>
            </View>
            <View style={styles.paymentMethods}>
                <TouchableOpacity 
                    onPress={() => setSelectPaymentMethod('PayPal')} 
                    style={styles.paymentMethod}>
                        <View style={styles.paymentCardData}>
                            <Image 
                                source={{ uri: 'https://static-00.iconduck.com/assets.00/paypal-icon-856x1024-a3b7wbse.png' }} 
                                width={24}
                                height={24}
                                style={styles.paymentMethodIcon} />
                            <Text style={styles.paymentMethodText}>PayPal</Text>
                        </View>
                        <View style={styles.paymentMethodSelect}>
                            {selectPaymentMethod == 'PayPal' && (
                                <View style={styles.paymentMethodSelected}/>
                            )}
                        </View>
                </TouchableOpacity>   
                <TouchableOpacity 
                    onPress={() => setSelectPaymentMethod('GooglePay')} 
                    style={styles.paymentMethod}>
                        <View style={styles.paymentCardData}>
                            <Image 
                                source={{ uri: 'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png' }} 
                                width={24}
                                height={24}
                                style={styles.paymentMethodIcon} />
                            <Text style={styles.paymentMethodText}>Google Pay</Text>
                        </View>
                        <View style={styles.paymentMethodSelect}>
                            {selectPaymentMethod == 'GooglePay' && (
                                <View style={styles.paymentMethodSelected}/>
                            )}
                        </View>
                </TouchableOpacity>    
                <TouchableOpacity 
                    onPress={() => setSelectPaymentMethod('ApplePay')} 
                    style={styles.paymentMethod}>
                        <View style={styles.paymentCardData}>
                            <Image 
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/1200px-Apple_logo_white.svg.png' }} 
                                width={24}
                                height={30}
                                style={styles.paymentMethodIcon} />
                            <Text style={styles.paymentMethodText}>Apple Pay</Text>
                        </View>
                        <View style={styles.paymentMethodSelect}>
                            {selectPaymentMethod == 'ApplePay' && (
                                <View style={styles.paymentMethodSelected}/>
                            )}
                        </View>
                </TouchableOpacity> 
                <TouchableOpacity 
                    onPress={() => navigation.navigate('AddNewCardScreen')} 
                    style={styles.addNewCard}>
                        <Text style={styles.addNewCardText}>Add New Card</Text>
                </TouchableOpacity>                   
            </View>
            <TouchableOpacity 
                onPress={() => navigation.navigate('ReviewSummaryScreen')} 
                style={styles.buttonContinue}>
                    <Text style={styles.buttonContinueText}>Continue</Text>
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
    headerContainer: {
        width: '90%',
    },
    headerText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
        textAlign: 'left'
    },
    paymentMethods: {
        width: '90%',
        height: '74%'
    },
    paymentMethod: {
        width: '100%',
        height: 80,
        backgroundColor: '#1F222A',
        borderRadius: 20,
        marginTop: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    paymentMethodIcon: {
        marginLeft: 20,
        marginRight: 20
    },
    paymentCardData: {
        width: '40%',
        alignItems: 'center',
        flexDirection: 'row',
        height: 30,
    },
    paymentMethodText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 16,
    },
    paymentMethodSelect: {
        width: 20,
        height: 20,
        borderRadius: 50,
        borderColor: '#06C149',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    paymentMethodSelected: {
        width: 10,
        height: 10,
        borderRadius: 40,
        backgroundColor: '#06C149',
    },
    addNewCard: {
        backgroundColor: '#35383F',
        borderRadius: 50,
        width: '100%',
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    addNewCardText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 15,
    },
    buttonContinue: {
        width: '90%',
        height: 58,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#06C149',
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8, 
    },
    buttonContinueText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 15,
    },
});
    
export default PaymentScreen;