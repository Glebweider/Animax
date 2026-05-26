import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

// Components
import BackButton from '@Components/buttons/Back';

// Data
import {
    COLOR_BACKGROUND_PRIMARY, COLOR_BACKGROUND_SECONDARY,
    COLOR_PRIMARY, COLOR_TEXT_PRIMARY
} from '@Data/constants';
import { PAYMENT_METHODS } from '@Data/paymentMethods';

// Utils
import { i18n } from '@Utils/localization';


// TODO: Переписать и передавать просто id метода оплаты, так же все методы получать при загрузке приложенния и кешировать их а после использовать
interface IPaymentMethod {
    textPaymentMethod: string;
    iconPaymentMethod: string;
    iconPaymentMethodWidth: number;
    iconPaymentMethodHeight: number;
}

const PaymentScreen = ({ navigation, route }) => {
    const [selectPaymentMethod, setSelectPaymentMethod] = useState<IPaymentMethod>({
        textPaymentMethod: 'PayPal',
        iconPaymentMethod: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/1200px-Apple_logo_white.svg.png',
        iconPaymentMethodWidth: 24,
        iconPaymentMethodHeight: 24,
    });
    const { objecyBuy } = route.params;

    return (
        <View style={styles.container}>
            <View>
                <BackButton navigation={navigation} text={i18n.t('payment.payment')} />
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{i18n.t('payment.details')}</Text>
                </View>
                <View style={styles.paymentMethods}>
                    {PAYMENT_METHODS.map((method) => (
                        <TouchableOpacity
                            key={method.textPaymentMethod}
                            onPress={() => setSelectPaymentMethod(method)}
                            style={styles.paymentMethod}>
                            <View style={styles.paymentCardData}>
                                <Image
                                    source={{ uri: method.iconPaymentMethod }}
                                    style={styles.paymentMethodIcon} />
                                <Text style={styles.paymentMethodText}>
                                    {method.textPaymentMethod}
                                </Text>
                            </View>
                            <View style={styles.paymentMethodSelect}>
                                {selectPaymentMethod.textPaymentMethod === method.textPaymentMethod && (
                                    <View style={styles.paymentMethodSelected} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('ReviewSummaryScreen', {
                    buyData: {
                        objecyBuy: objecyBuy,
                        methodPayment: {
                            textPaymentMethod: selectPaymentMethod.textPaymentMethod,
                            iconPaymentMethod: selectPaymentMethod.iconPaymentMethod,
                            iconPaymentMethodWidth: selectPaymentMethod.iconPaymentMethodWidth,
                            iconPaymentMethodHeight: selectPaymentMethod.iconPaymentMethodHeight,
                        },
                    }
                })}
                style={styles.buttonContinue}>
                <Text style={styles.buttonContinueText}>{i18n.t('payment.continue')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLOR_BACKGROUND_PRIMARY,
        justifyContent: 'space-between'
    },
    headerContainer: {
        width: '90%',
    },
    headerText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 13,
        textAlign: 'left'
    },
    paymentMethods: {
        width: '90%',
    },
    paymentMethod: {
        width: '100%',
        height: 80,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
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
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 16,
    },
    paymentMethodSelect: {
        width: 20,
        height: 20,
        borderRadius: 50,
        borderColor: COLOR_PRIMARY,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    paymentMethodSelected: {
        width: 10,
        height: 10,
        borderRadius: 40,
        backgroundColor: COLOR_PRIMARY,
    },
    buttonContinue: {
        width: '90%',
        height: 58,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_PRIMARY,
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8,
        marginBottom: 20,
    },
    buttonContinueText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 15,
    },
});

export default PaymentScreen;