import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import BackButton from '@Components/BackButton';
import CrownIcon from '@Icons/CrownIcon';
import CheckIcon from '@Icons/CheckIcon';
import { useState } from 'react';
import ConfigPaymentModal from '@Modal/ConfigPaymentModal';
import { i18n } from '@Utils/localization';
import { getTokenFromStorage } from '@Utils/token';
import { useDispatch } from 'react-redux';
import { setPremium } from '@Redux/reducers/userReducer';
import useBuyPremiumUser from '@Utils/fetch/buyPremiumUser';

const ReviewSummaryScreen = ({ navigation, route }) => {
    const [taxPrice, setTaxPrice] = useState<number>(1.19)
    const { buyData } = route.params;
    const dispatch = useDispatch();
    const [isOpenModalConfigPayment, setOpenModalConfigPayment] = useState<boolean>(false); 
    const { buyPremiumUser } = useBuyPremiumUser();

    const handleBuyPremium = async () => {
        const token = await getTokenFromStorage();
        const response = await buyPremiumUser(token, buyData.objecyBuy.date);
        if (response) {
            dispatch(setPremium(response));
            setOpenModalConfigPayment(true);
        }
    }

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('reviewsummary.reviewsummary')} />
            <ConfigPaymentModal 
                visible={isOpenModalConfigPayment}
                setVisible={setOpenModalConfigPayment}
                data={buyData}
                navigation={navigation} />
            <View style={styles.content}>
                <View style={styles.cardPremium}>
                    <View style={styles.cardHeader}>
                        <CrownIcon Color={'#06C149'} Width={70} Height={70} />
                        <View style={styles.cardHeaderTextContainer}>
                            <Text style={styles.cardHeaderTextPrice}>${buyData.objecyBuy.price}</Text>
                            <Text style={styles.cardHeaderTextMonth}>/{i18n.t(buyData.objecyBuy.date)}</Text>
                        </View>
                    </View>
                    <View style={styles.cardLine} />
                    <View style={styles.cardDataContainer}>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>{i18n.t('premium.watch')}</Text>
                        </View>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>{i18n.t('premium.streaming')}</Text>
                        </View>
                        <View style={styles.cardData}>
                            <CheckIcon Color={'#06C149'} Width={25} Height={25} Style={{marginLeft: 10}} />
                            <Text style={styles.cardDataText}>{i18n.t('premium.quality')}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.dataContainer}>
                    <View style={styles.dataContent}>
                        <View style={styles.dataAmountContainer}>
                            <Text style={styles.dataAmountText}>{i18n.t('reviewsummary.amount')}</Text>
                            <Text style={styles.dataAmountPrice}>${buyData.objecyBuy.price}</Text>
                        </View>
                        <View style={styles.dataTaxContainer}>
                            <Text style={styles.dataTaxText}>{i18n.t('reviewsummary.tax')}</Text>
                            <Text style={styles.dataTaxPrice}>${taxPrice}</Text>
                        </View>
                        <View style={styles.dataLine} />
                        <View style={styles.dataTotalContainer}>
                            <Text style={styles.dataTotalText}>{i18n.t('reviewsummary.total')}</Text>
                            <Text style={styles.dataTotalPrice}>${(buyData.objecyBuy.price + taxPrice).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.paymentMethod}>
                    <View style={styles.paymentCardData}>
                        <Image 
                            source={{ uri: buyData.methodPayment.iconPaymentMethod }} 
                            width={buyData.methodPayment.iconPaymentMethodWidth}
                            height={buyData.methodPayment.iconPaymentMethodHeight}
                            style={styles.paymentMethodIcon} />
                        <Text style={styles.paymentMethodText}>{buyData.methodPayment.textPaymentMethod}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.paymentChangeText}>{i18n.t('reviewsummary.change')}</Text>
                    </TouchableOpacity>
                </View> 
            </View>
            <TouchableOpacity 
                onPress={() => handleBuyPremium()} 
                style={styles.buttonContinue}>
                    <Text style={styles.buttonContinueText}>{i18n.t('reviewsummary.confirmpayment')}</Text>
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
    content: {
        width: '90%',
        height: '77%'
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
        marginLeft: 24,
        marginRight: 24
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
    paymentChangeText: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 14,
        marginRight: 24,
    },
    dataContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F222A',
        borderRadius: 30,
        height: 173,
        marginTop: 30,
    },
    dataContent: {
        width: '86%',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    dataAmountContainer: {
        width: '100%', 
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: 22
    },
    dataAmountText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12,
    },
    dataAmountPrice: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
    },
    dataTaxContainer: {
        width: '100%', 
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: 22
    },
    dataTaxText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12,
    },
    dataTaxPrice: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
    },
    dataTotalContainer: {
        width: '100%', 
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        height: 22
    },
    dataTotalText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12,
    },
    dataTotalPrice: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12,
    },
    dataLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#35383F',
        borderRadius: 50,
        alignSelf: 'center',
    },
    cardPremium: {
        height: 294,
        width: '100%',
        borderColor: '#06C149',
        borderWidth: 2,
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
    
export default ReviewSummaryScreen;