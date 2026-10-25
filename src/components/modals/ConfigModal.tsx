import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';

// Styles
import globalStyles from '@Styles/index';

// Components
import { BallIndicator } from '@Components/BallIndicator';

// Data
import { BACKGROUND_CONFIGURATOR, COLOR_PRIMARY_LIGHT } from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';


interface ModalProps {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfigModal: React.FC<ModalProps> = ({ visible, setVisible }) => {

	useEffect(() => {
		if (visible) {
			setTimeout(() => {
				setVisible(false);
			}, 5000);
		}
	}, [visible]);

	return (
		<Modal transparent visible={visible} animationType="slide">
			<View style={globalStyles.ModalContainer}>
				<View style={styles.modalContent}>
					<Image
						source={BACKGROUND_CONFIGURATOR}
						style={globalStyles.ModalImage} />
					<Text style={globalStyles.ModalTitle}>{i18n.t('configModal.congratulations')}</Text>
					<Text style={globalStyles.ModalText}>{i18n.t('configModal.text')}</Text>
					<BallIndicator color={COLOR_PRIMARY_LIGHT} size={60} count={8} />
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContent: {
		...globalStyles.ModalPanel,
		width: '90%',
		height: '75%',
		borderRadius: 20
	}
});

export default ConfigModal;