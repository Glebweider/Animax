import React from 'react';
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
            style={[styles.container, isInMyList && styles.containerEnabled]}>
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
            <Text style={[styles.text, isInMyList && styles.textEnabled]}>
                {i18n.t('mylisttext')}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 145,
        height: 36,
        borderColor: COLOR_TEXT_PRIMARY,
        borderWidth: 2,
        flexDirection: 'row',
    },
    containerEnabled: {
        borderColor: COLOR_PRIMARY,
    },
    text: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginRight: 13,
    },
    textEnabled: {
        color: COLOR_PRIMARY,
    },
});

export default MyAnimeListButton;
