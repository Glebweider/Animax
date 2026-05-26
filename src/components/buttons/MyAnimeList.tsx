import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Data
import { COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';

// Rest
import useAddAnimeList from '@Rest/anime/addAnimeListUser';
import useRemoveAnimeListUser from '@Rest/anime/removeAnimeListUser';

// Icons
import AddIcon from '@Icons/AddIcon';
import CheckIcon from '@Icons/CheckIcon';

// Redux
import { RootState } from '@Redux/store';
import { addAnime, removeAnime } from '@Redux/reducers/userReducer';


const MyAnimeListButton = ({ anime }) => {
    const dispatch = useDispatch();
    const userAnimeList = useSelector((state: RootState) => state.userReducer.animelist);

    const [isInMyList, setIsInMyList] = useState<boolean>(false);

    const { addAnimeListUser } = useAddAnimeList();
    const { removeAnimeListUser } = useRemoveAnimeListUser();

    const fetchMyAnimeList = async () => {
        if (userAnimeList)
            setIsInMyList(Boolean(userAnimeList.find((userAnimeId) => userAnimeId == anime.id)));
    };

    useEffect(() => {
        fetchMyAnimeList();
    }, [anime.id]);

    const handlePress = async () => {
        const id = anime.id
        dispatch(isInMyList ? removeAnime(id) : addAnime(id));
        setIsInMyList(!isInMyList);

        const response = isInMyList ? await removeAnimeListUser(id) : await addAnimeListUser(id);
        if (!response)
            setIsInMyList(isInMyList);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={isInMyList ? styles.animeButtonMyListEnabled : styles.animeButtonMyListDisabled}>
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
            <Text style={isInMyList ? styles.animeButtonTextMyListEnabled : styles.animeButtonTextMyListDisabled}>
                {i18n.t('mylisttext')}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    animeButtonMyListEnabled: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 145,
        height: 36,
        borderColor: COLOR_PRIMARY,
        borderWidth: 2,
        flexDirection: 'row',
    },
    animeButtonTextMyListEnabled: {
        color: COLOR_PRIMARY,
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginRight: 13,
    },
    animeButtonMyListDisabled: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 145,
        height: 36,
        borderColor: COLOR_TEXT_PRIMARY,
        borderWidth: 2,
        flexDirection: 'row',
    },
    animeButtonTextMyListDisabled: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginRight: 13,
    },

});

export default MyAnimeListButton;
