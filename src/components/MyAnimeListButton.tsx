import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

//Utils
import { getTokenFromStorage } from '@Utils/token';

//Icons
import AddIcon from '@Icons/AddIcon';
import CheckIcon from '@Icons/CheckIcon';

//Redux
import { RootState } from '@Redux/store';
import { addAnime, removeAnime } from '@Redux/reducers/userReducer';
import { i18n } from '@Utils/localization';
import useAddAnimeList from '@Utils/fetch/addAnimeListUser';
import useRemoveAnimeListUser from '@Utils/fetch/removeAnimeListUser';

const MyAnimeListButton = ({ anime }) => {
    const [isInMyList, setIsInMyList] = useState(false);
    const dispatch = useDispatch();
    const userAnimeList = useSelector((state: RootState) => state.userReducer.animelist);
    const { addAnimeListUser } = useAddAnimeList();
    const { removeAnimeListUser } = useRemoveAnimeListUser();

    useEffect(() => {
        const fetchMyAnimeList = async () => {
            if (userAnimeList) {
                const isAnimeInList = userAnimeList.find((userAnime) => userAnime.animeId == anime.id)
                
                if (isAnimeInList) {
                    setIsInMyList(true);
                } else {
                    setIsInMyList(false);
                }
            }
        };
        fetchMyAnimeList();
    }, [anime.id]);
  
    const handlePress = async () => {
        let token = await getTokenFromStorage();
        if (isInMyList) {
            dispatch(removeAnime(anime.id));
            await removeAnimeListUser(token, anime.id);
        } else {
            dispatch(addAnime({
                animeId: anime.id,
                poster: anime.poster,
                score: anime.score,
                rating: anime.rating
            }));
            await addAnimeListUser(token, anime);
        }
        setIsInMyList((prev) => !prev);
    };

    return (
        isInMyList ? 
            <TouchableOpacity
                onPress={() => handlePress()} 
                style={styles.animeButtonMyListEnabled}>
                <CheckIcon Color={'#06C149'} Style={{marginRight: 7, marginLeft: 13}} Width={20} Height={20} />
                <Text style={styles.animeButtonTextMyListEnabled}>{i18n.t('mylisttext')}</Text>
            </TouchableOpacity>
            : 
            <TouchableOpacity
                onPress={() => handlePress()} 
                style={styles.animeButtonMyListDisabled}>
                <AddIcon Color={'#fff'} Style={{marginRight: 7, marginLeft: 13, width: 20, height: 20}} />
                <Text style={styles.animeButtonTextMyListDisabled}>{i18n.t('mylisttext')}</Text>
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
        borderColor: '#06C149',
        borderWidth: 2,
        flexDirection: 'row',
    },
    animeButtonTextMyListEnabled: {
        color: '#06C149',
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
        borderColor: '#fff',
        borderWidth: 2,
        flexDirection: 'row',
    },
    animeButtonTextMyListDisabled: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginRight: 13,
    },
   
});

export default MyAnimeListButton;
