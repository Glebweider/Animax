import { useState } from 'react';
import globalStyles from '@Styles/index';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';

// Data
import { COLOR_BACKGROUND_SECONDARY, COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';

// Icons
import CrownIcon from '@Icons/CrownIcon';
import CheckIcon from '@Icons/CheckIcon';

// Modal
import ConfigPaymentModal from '@Modal/ConfigPaymentModal';

// Utils
import { i18n } from '@Utils/localization';

// Rest
import useBuyPremiumUser from '@Rest/user/buyPremiumUser';

// Redux
import { setPremium } from '@Redux/reducers/userReducer';


const ReviewSummaryScreen = ({ navigation, route }) => {
	const [taxPrice, setTaxPrice] = useState<number>(1.19)
	const { buyData } = route.params;
	const dispatch = useDispatch();
	const [isOpenModalConfigPayment, setOpenModalConfigPayment] = useState<boolean>(false);
	const { buyPremiumUser } = useBuyPremiumUser();

	const handleBuyPremium = async () => {
		const response = await buyPremiumUser(buyData.objecyBuy.date);
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
			<View style={{ width: '90%' }}>
				<View style={styles.cardPremium}>
					<View style={styles.cardHeader}>
						<CrownIcon Color={COLOR_PRIMARY} Width={70} Height={70} />
						<View style={globalStyles.RowCenter}>
							<Text style={styles.cardHeaderTextPrice}>${buyData.objecyBuy.price}</Text>
							<Text style={styles.cardHeaderTextMonth}>/{i18n.t(buyData.objecyBuy.date)}</Text>
						</View>
					</View>
					<View style={styles.cardLine} />
					<View style={globalStyles.Center}>
						<View style={styles.cardData}>
							<CheckIcon Color={COLOR_PRIMARY} Width={25} Height={25} Style={{ marginLeft: 10 }} />
							<Text style={styles.cardDataText}>{i18n.t('premium.watch')}</Text>
						</View>
						<View style={styles.cardData}>
							<CheckIcon Color={COLOR_PRIMARY} Width={25} Height={25} Style={{ marginLeft: 10 }} />
							<Text style={styles.cardDataText}>{i18n.t('premium.streaming')}</Text>
						</View>
						<View style={styles.cardData}>
							<CheckIcon Color={COLOR_PRIMARY} Width={25} Height={25} Style={{ marginLeft: 10 }} />
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
							<Text style={styles.dataTotal}>{i18n.t('reviewsummary.total')}</Text>
							<Text style={styles.dataTotal}>${(buyData.objecyBuy.price + taxPrice).toFixed(2)}</Text>
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
		justifyContent: 'space-between'
	},
	paymentMethod: {
		...globalStyles.ModalPanel,
		width: '100%',
		height: 80,
		borderRadius: 20,
		marginTop: 25,
		justifyContent: 'space-between',
		flexDirection: 'row'
	},
	paymentMethodIcon: {
		marginLeft: 24,
		marginRight: 24
	},
	paymentCardData: {
		...globalStyles.RowCenter,
		width: '40%',
		height: 30
	},
	paymentMethodText: {
		...globalStyles.TextPrimary,
		fontSize: 16
	},
	paymentChangeText: {
		color: COLOR_PRIMARY,
		fontFamily: 'Outfit',
		fontSize: 14,
		marginRight: 24
	},
	dataContainer: {
		...globalStyles.AuthTitleContainer,
		backgroundColor: COLOR_BACKGROUND_SECONDARY,
		borderRadius: 30,
		height: 173,
		marginTop: 20
	},
	dataContent: {
		width: '86%',
		height: '100%',
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'space-evenly'
	},
	dataAmountContainer: {
		...globalStyles.RowCenter,
		width: '100%',
		justifyContent: 'space-between',
		height: 22
	},
	dataAmountText: {
		...globalStyles.TextPrimary,
		fontSize: 12
	},
	dataAmountPrice: {
		...globalStyles.TextPrimary,
		fontSize: 13
	},
	dataTaxContainer: {
		...globalStyles.RowCenter,
		width: '100%',
		justifyContent: 'space-between',
		height: 22
	},
	dataTaxText: {
		...globalStyles.TextPrimary,
		fontSize: 12
	},
	dataTaxPrice: {
		...globalStyles.TextPrimary,
		fontSize: 13
	},
	dataTotalContainer: {
		...globalStyles.RowCenter,
		width: '100%',
		justifyContent: 'space-between',
		height: 22
	},
	dataTotal: {
		...globalStyles.TextPrimary,
		fontSize: 12
	},
	dataLine: {
		width: '100%',
		height: 1,
		backgroundColor: '#35383F',
		borderRadius: 50,
		alignSelf: 'center'
	},
	cardPremium: {
		height: 294,
		width: '100%',
		borderColor: COLOR_PRIMARY,
		borderWidth: 2,
		borderRadius: 30
	},
	cardHeader: {
		alignItems: 'center',
		marginTop: 10
	},
	cardHeaderTextPrice: {
		...globalStyles.TextPrimary,
		fontSize: 20,
	},
	cardHeaderTextMonth: {
		...globalStyles.TextPrimary,
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
	cardData: {
		...globalStyles.RowCenter,
		width: '80%',
		marginTop: 18
	},
	cardDataText: {
		...globalStyles.TextPrimary,
		marginLeft: 20,
		fontSize: 13
	},
	buttonContinue: {
		...globalStyles.Center,
		width: '90%',
		height: 58,
		borderRadius: 50,
		backgroundColor: COLOR_PRIMARY,
		shadowColor: 'rgba(6, 193, 73, 0.4)',
		shadowOffset: { width: 4, height: 8 },
		shadowOpacity: 0.24,
		shadowRadius: 4,
		elevation: 8,
		marginBottom: 20
	},
	buttonContinueText: {
		...globalStyles.TextPrimary,
		fontSize: 15
	}
});

export default ReviewSummaryScreen;