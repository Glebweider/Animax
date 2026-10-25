import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Styles
import globalStyles from '@Styles/index';

//Utils
import { i18n } from '@Utils/localization';

// Data
import { BACKGROUND_CONFIGURATOR, COLOR_PRIMARY } from '@Data/constants';


interface ModalProps {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	navigation: any;
	data: any
}

const ConfigPaymentModal: React.FC<ModalProps> = ({ visible, setVisible, data, navigation }) => {
	useEffect(() => {
		if (visible) {
			setTimeout(() => {
				setVisible(false);
				navigation.navigate('Profile');
			}, 5000);
		}
	}, [visible]);

	return (
		<Modal transparent visible={visible} animationType="slide">
			<View style={globalStyles.ModalContainer}>
				<View style={styles.modalContent}>
					<Image
						source={BACKGROUND_CONFIGURATOR}
						style={styles.modalImage} />
					<Text style={globalStyles.ModalTitle}>{i18n.t('reviewsummary.modal.congratulations')}</Text>
					<Text style={styles.modalText}>{
						i18n.t('reviewsummary.modal.youhave') +
						i18n.t(data.objecyBuy.date) +
						i18n.t('reviewsummary.modal.enjoy')
					}</Text>
					<TouchableOpacity
						onPress={() => {
							setVisible(false);
							navigation.navigate('Profile');
						}}
						style={styles.modalButtonContainer}>
						<Text style={styles.modalButtonText}>oк</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalButtonContainer: {
		...globalStyles.Center,
		width: '80%',
		height: 58,
		borderRadius: 50,
		backgroundColor: COLOR_PRIMARY,
		shadowRadius: 4,
		marginTop: 20
	},
	modalButtonText: {
		...globalStyles.TextPrimary,
		fontSize: 16
	},
	modalContent: {
		...globalStyles.ModalPanel,
		width: '80%',
		height: '60%',
		borderRadius: 40
	},
	modalImage: {
		marginTop: 15,
		width: 240,
		height: 240
	},
	modalText: {
		...globalStyles.TextPrimary,
		marginTop: 15,
		fontSize: 13,
		width: '80%',
		textAlign: 'center'
	}
});

export default ConfigPaymentModal;