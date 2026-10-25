import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '@Data/constants';
import { COLOR_BACKGROUND_SECONDARY, COLOR_TEXT_PRIMARY } from '@Data/constants';


const styles = StyleSheet.create({
	SectionInputIcon: {
		width: 20,
		height: 20,
		margin: 22,
	},
	HeaderScreenIcon: {
		width: 30,
		height: 30,
	},
	Section: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: COLOR_BACKGROUND_SECONDARY,
	},
	Input: {
		flex: 1,
		height: '100%',
		color: COLOR_TEXT_PRIMARY,
		fontFamily: 'Outfit',
	},
	ModalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
	MiniModalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'transparent',
		margin: 0,
		padding: 0
	},
	AuthTitle: {
		marginTop: 25,
		color: COLOR_TEXT_PRIMARY,
		fontFamily: 'Outfit',
		fontSize: 26,
		fontWeight: '600',
	},
	AuthTitleContainer: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	AuthTitleImage: {
		width: 115,
		height: 115,
	},
	AuthContainer: {
		width: '90%',
		height: '100%',
	},
	AuthScreen: {
		alignItems: 'center',
		paddingBottom: 25,
	},
	ModalImage: {
		marginTop: 15,
		width: 270,
		height: 270,
	},
	ModalTitle: {
		marginTop: 20,
		color: COLOR_PRIMARY,
		fontFamily: 'Outfit',
		fontSize: 24,
	},
	ModalText: {
		marginTop: 15,
		color: COLOR_TEXT_PRIMARY,
		fontFamily: 'Outfit',
		fontSize: 14,
		width: '80%',
		textAlign: 'center',
	},
	ModalPanel: {
		backgroundColor: COLOR_BACKGROUND_SECONDARY,
		alignItems: 'center',
	},
	ModalShelf: {
		width: 40,
		height: 4,
		backgroundColor: '#424242',
		borderRadius: 20,
		alignSelf: 'center',
		marginTop: 8,
	},
	ModalLine: {
		width: '90%',
		height: 1,
		backgroundColor: '#424242',
		borderRadius: 50,
		alignSelf: 'center',
		marginTop: 16,
	},
	ErrorText: {
		marginTop: 5,
		color: 'red',
		fontFamily: 'Outfit',
		justifyContent: 'center',
		textAlign: 'center',
	},
	FullScreen: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
	},
	Center: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	RowCenter: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	FullSize: {
		width: '100%',
		height: '100%',
	},
	TextPrimary: {
		color: COLOR_TEXT_PRIMARY,
		fontFamily: 'Outfit',
	},
});

export default styles;