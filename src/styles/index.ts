import { StyleSheet } from 'react-native';
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
	}
});

export default styles;