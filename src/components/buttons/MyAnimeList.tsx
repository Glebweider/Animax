import React from 'react';
import globalStyles from '@Styles/index';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

// Data
import { COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';
import { useUserAnime } from '@Utils/hooks';

// Icons
import AddIcon from '@Icons/AddIcon';
import CheckIcon from '@Icons/CheckIcon';


const MyAnimeListButton = ({ animeId }) => {
	const { isInMyList, toggleAnimeList } = useUserAnime(animeId);

	return (
		<TouchableOpacity
			onPress={toggleAnimeList}
			style={[styles.container, isInMyList && { borderColor: COLOR_PRIMARY }]}>
			{isInMyList ? (
				<CheckIcon
					Color={COLOR_PRIMARY}
					Style={{ marginRight: 7, marginLeft: 13 }}
					Width={20}
					Height={20} />
			) : (
				<AddIcon
					Color={COLOR_TEXT_PRIMARY}
					Style={{ marginRight: 7, marginLeft: 13 }}
					Width={20}
					Height={20} />
			)}
			<Text style={[styles.text, isInMyList && { color: COLOR_PRIMARY }]}>
				{i18n.t('mylisttext')}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		...globalStyles.Center,
		borderRadius: 50,
		maxWidth: 145,
		height: 36,
		borderColor: COLOR_TEXT_PRIMARY,
		borderWidth: 2,
		flexDirection: 'row'
	},
	text: {
		...globalStyles.TextPrimary,
		fontSize: 13,
		overflow: 'hidden',
		marginRight: 13
	}
});

export default MyAnimeListButton;
