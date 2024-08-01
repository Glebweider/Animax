import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

//Utils
import getAnimeListUser from '@Utils/fetch/getAnimeListUser';
import { getTokenFromStorage } from '@Utils/token';
import removeAnimeListUser from '@Utils/fetch/removeAnimeListUser';
import addAnimeListUser from '@Utils/fetch/addAnimeListUser';

//Icons
import AddIcon from '@Icons/AddIcon';
import CheckIcon from '@Icons/CheckIcon';

const MyAnimeListButton = ({ anime }) => {
    const [isInMyList, setIsInMyList] = useState(false);

    useEffect(() => {
        const fetchMyAnimeList = async () => {
            try {
                let token = await getTokenFromStorage();
                const userAnimeList = await getAnimeListUser(token);
                const isAnimeInList = userAnimeList.some((userAnime) => userAnime.animeId == anime.id);
                setIsInMyList(isAnimeInList);
            } catch (error) {
                console.error('Ошибка при получении списка аниме пользователя', error);
            }
        };
  
        fetchMyAnimeList();
    }, [anime.id]);
  
    const handlePress = async () => {
        let token = await getTokenFromStorage();
        if (isInMyList) {
            await removeAnimeListUser(token, anime.id);
        } else {
            await addAnimeListUser(token, anime);
        }
        setIsInMyList((prev) => !prev);
    };

    return (
        isInMyList ? 
            <TouchableOpacity
                onPress={() => handlePress()} 
                style={styles.animeButtonMyListEnabled}>
                <CheckIcon Color={'#06C149'} Style={{marginRight: 7}} Width={20} Height={20} />
                <Text style={styles.animeButtonTextMyListEnabled}>My List</Text>
            </TouchableOpacity>
            : 
            <TouchableOpacity
                onPress={() => handlePress()} 
                style={styles.animeButtonMyListDisabled}>
                <AddIcon Color={'#fff'} Style={{marginRight: 7, width: 20, height: 20}} />
                <Text style={styles.animeButtonTextMyListDisabled}>My List</Text>
            </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    animeButtonMyListEnabled: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: 105,
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
    },
    animeButtonMyListDisabled: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: 105,
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
    },
   
});

export default MyAnimeListButton;
