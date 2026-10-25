import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

// Styles
import globalStyles from '@Styles/index';

// Components
import ApplyButton from '@Components/buttons/Apply';

// Utils
import { removeTokenFromStorage } from '@Utils/functions/storage';
import { i18n } from '@Utils/localization';

// Redux
import { resetUser } from '@Redux/reducers/userReducer';
import { clearAuth } from '@Redux/reducers/authReducer';



interface ModalProps {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	navigation: any;
}

const LogoutModal: React.FC<ModalProps> = ({ visible, setVisible, navigation }) => {
	const dispatch = useDispatch();

	const logout = async () => {
		removeTokenFromStorage();

		dispatch(resetUser());
		dispatch(clearAuth());

		setVisible(false);

		navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'AuthWelcome' }] }));
	};

	return (
		<Modal
			isVisible={visible}
			animationIn="fadeInUp"
			animationOut="fadeOutDown"
			onBackdropPress={() => setVisible(false)}
			backdropOpacity={0.5}
			statusBarTranslucent
			style={globalStyles.MiniModalContainer}>
			<View style={styles.modalContent}>
				<View style={globalStyles.ModalShelf} />
				<Text style={styles.modalTitle}>{i18n.t('profile.logout')}</Text>
				<View style={globalStyles.ModalLine} />
				<Text style={styles.modalText}>{i18n.t('logout.description')}</Text>
				<View style={styles.modalButtons}>
					<ApplyButton
						onPress={() => setVisible(false)}
						isActiveButton={false}
						style={styles.cancelButton}
						text={i18n.t('logout.cancel')} />
					<ApplyButton
						onPress={logout}
						isActiveButton={false}
						style={styles.applyButton}
						text={i18n.t('logout.apply')} />
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	...globalStyles,
	applyButton: {
		width: '48%',
		marginTop: 0
	},
	cancelButton: {
		width: '48%',
		backgroundColor: '#35383F',
		marginTop: 0,
		elevation: 0
	},
	modalButtons: {
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-between',
		marginTop: 25
	},
	modalContent: {
		...globalStyles.ModalPanel,
		width: '100%',
		height: '30%',
		borderTopRightRadius: 35,
		borderTopLeftRadius: 35
	},
	modalTitle: {
		marginTop: 20,
		color: '#F75555',
		fontFamily: 'Outfit',
		fontSize: 20
	},
	modalText: {
		...globalStyles.TextPrimary,
		marginTop: 20,
		fontSize: 14,
		width: '80%',
		textAlign: 'center'
	}
});

export default LogoutModal;