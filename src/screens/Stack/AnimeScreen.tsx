import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { GET_ANIME } from '../../utils/graphql/getAnime';
import { BallIndicator } from 'react-native-indicators';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import SendIcon from '../../components/icons/SendIcon';
import MyListIcon from '../../components/icons/MyListIcon';
import StarIcon from '../../components/icons/StarIcon';
import PlayIcon from '../../components/icons/PlayIcon';
import DownloadIcon from '../../components/icons/DownloadIcon';
import SmartTvIcon from '../../components/icons/SmartTvIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon copy';
import { getTokenFromStorage } from '../../utils/token';
import getAnimeListUser from '../../utils/fetch/getAnimeListUser';
import removeAnimeListUser from '../../utils/fetch/removeAnimeListUser';
import addAnimeListUser from '../../utils/fetch/addAnimeListUser';

interface Anime {
    id: number;
    name: string;
    russian: string;
    poster: {
        originalUrl: string;
    };
    score: string;
    status: string;
    episodes: number;
    episodes_aired: number;
    rating: string;
    aired_on: string;
    released_on: string;
    createdAt: string;
    description: string;
    genres: [
        {
            id: number;
            russian: string;
        },
    ];
}

const AnimeScreen = ({ navigation, route }) => {
    const client = useApolloClient();
    const { animeId } = route.params;
    const [anime, setAnime] = useState<Anime>({
        id: 0,
        name: '',
        russian: '',
        poster: {
            originalUrl: '',
        },
        score: '',
        status: '',
        episodes: 0,
        episodes_aired: 0,
        rating: '',
        aired_on: '',
        released_on: '',
        createdAt: '',
        description: '',
        genres: [
            {
                id: 0,
                russian: '',
            },
        ],
    });
    const [isInMyList, setIsInMyList] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            if (animeId) {
                const { data, error } = await client.query({
                    query: GET_ANIME,
                    variables: { 
                        id: String(animeId) 
                    },
                });         
                if (data && !error) {
                    setAnime(data.animes[0]);
                } 
            }            
        }
        fetchData()
    }, []);

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
            await removeAnimeListUser(token, String(anime.id));
        } else {
            await addAnimeListUser(token, anime);
        }
        setIsInMyList((prev) => !prev);
    };

    const handleShare = async () => {
        const message = `Я советуем тебе аниме ${anime.russian}, ${anime.poster.originalUrl}`;
      
        try {
            await Share.share({
                message,
                title: anime.russian,
            });
        } catch (error) {
            console.error('Ошибка при попытке поделиться:', error.message);
        }
};

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon Style={styles.headerIconArrow} Color={'#fff'} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => {}}
                    style={styles.headerIconSearch}>
                    <SmartTvIcon Color={'#fff'} Style={styles.headerIconSearch} />                            
                </TouchableOpacity>
            </View>   
            <View style={styles.previewAnimeContainer}>
                {anime.poster.originalUrl !== '' ?
                    <Image 
                        source={{ uri: anime.poster.originalUrl }} 
                        style={styles.previewAnimeImage} />
                    :
                    <BallIndicator 
                        color='#13D458' size={70} 
                        animationDuration={700} />
                }
            </View>
            <View style={styles.titleContainer}>
                <Text 
                    numberOfLines={1} 
                    ellipsizeMode="tail" 
                    style={styles.titleText}>{anime.name}</Text>
                <View style={styles.titleContainerButtons}>
                    {isInMyList ? 
                        <TouchableOpacity 
                            onPress={() => handlePress()}
                            style={styles.titleButtonMyList}>
                            <MyListIcon Style={{}} Color={'#06C149'} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity 
                            onPress={() => handlePress()}
                            style={styles.titleButtonMyList}>
                            <MyListIcon Style={{}} Color={'#fff'} />
                        </TouchableOpacity>
                    } 
                    <TouchableOpacity 
                        onPress={() => handleShare()}
                        style={styles.titleButtonSend}>
                        <SendIcon Style={{}} Color={'#fff'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.animeData}>
                <StarIcon Style={{}} Color={'#115D30'} />
                <Text style={styles.animeScore}>
                    {Number(anime.score).toFixed(1)}
                    </Text>
                <ArrowRightIcon Color={'#06C149'} Width={22} Height={22} />
                <Text style={styles.animeDate}>
                    {new Date(anime.createdAt).getFullYear()}
                </Text>
                <View style={styles.genresContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        style={styles.genresScrollView}>
                        {anime.genres.map((genre) => (
                            <View 
                                style={styles.genreContainer}
                                key={genre.id}>
                                <Text style={styles.genreText}>{genre.russian}</Text>                                
                            </View>
                        ))}                    
                    </ScrollView>
                </View>
            </View>
            <View style={styles.animeButtonsContainer}>
                <TouchableOpacity 
                    onPress={() => {}}
                    style={styles.animeButtonPlay}>
                    <PlayIcon 
                        Color={'#fff'} 
                        Style={{ marginRight: 7 }} />
                    <Text style={styles.animeButtonPlayText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => {}}
                    style={styles.animeButtonDownload}>
                    <DownloadIcon 
                        Color={'#06C149'} 
                        Style={{ marginRight: 7 }}
                        Width={20}
                        Height={20} />
                    <Text style={styles.animeButtonDownloadText}>Download</Text>
                </TouchableOpacity>
            </View>
            {anime.description ?
                <View style={styles.animeDescriptionContainer}>
                    <Text 
                        numberOfLines={3} 
                        ellipsizeMode='tail'
                        style={styles.animeDescriptionText}>
                            {anime.description.replace(/\[character=\d+](.*?)\[\/character]/g, '$1')
                            .replace(/\[anime=\d+](.*?)\[\/anime]/g, '$1')
                            .replace(/\[i](.*?)\[\/i]/g, '')}
                    </Text>
                </View>
                :
                <Text>Нету дескриптион</Text>
            }
            <View style={styles.animeEpisodesContainer}>
                <View style={styles.animeEpisodesHeader}>
                    <Text style={styles.animeEpisodesText}>Episodes</Text>
                    <Text style={styles.animeEpisodesLabel}>Season 2</Text>                    
                </View>
                <View style={styles.animeEpisodes}>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    animeEpisodesContainer: {
        width: '90%',
        marginTop: 15,
    },
    animeEpisodesHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    animeEpisodesText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    animeEpisodesLabel: {
        color: '#06C149',
        fontSize: 13,
        fontFamily: 'Outfit',
    },
    animeEpisodes: {

    },
    animeDescriptionContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
    },
    animeDescriptionText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Outfit',
        width: '100%'
    },
    animeButtonsContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 18,
    },
    animeButtonPlay: {
        width: '48%',
        backgroundColor: '#06C149',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        height: 38,
        flexDirection: 'row',
    },
    animeButtonPlayText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
    },
    animeButtonDownload: {
        width: '48%',        
        borderColor: '#06C149',
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 38,
        flexDirection: 'row',
    },
    animeButtonDownloadText: {
        color: '#06C149',
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
    },
    genresContainer: {
        width: '71%',
        height: 26,
        marginLeft: 10,
        alignItems: 'center',
    },
    genresScrollView: {
        width: '100%',
        height: 26,
        flexGrow: 1,
        paddingRight: 10,  
    },
    genreContainer: {
        height: 26,
        borderColor: '#06C149',
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        paddingRight: 7,
        paddingLeft: 7,
    },
    genreText: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 8
    },
    animeScore: {
        marginLeft: 7,
        color: '#06C149',
        fontSize: 12,
        fontFamily: 'Outfit',
    },
    animeRightArrow: {
        marginLeft: 3,
    },
    animeData: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    animeDate: {
        marginLeft: 5,
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Outfit',
    },
    titleContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        height: 34,
        marginTop: 20,
    },
    titleText: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Outfit',
        width: '70%'
    },
    titleContainerButtons: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: 58
    },
    titleButtonMyList: {
        justifyContent: 'center'
    },
    titleButtonSend: {
        justifyContent: 'center'
    },
    headerContainer: {
        position: 'absolute',
        width: '90%',
        height: 40,
        zIndex: 999,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 60,
    },
    headerLogo: {
        width: 35,
        height: 35,
    },
    headerIconsContainer: {
        width: 84,
        height: 35,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    headerIconSearch: {
        width: 30,
        height: 30,
    },
    headerIconArrow: {
        width: 30,
        height: 30,
    },
    previewAnimeContainer: {
        width: '100%',
        height: '35%'
    },
    previewAnimeImage: {
        width: '100%',
        height: '100%'
    }
});
    
export default AnimeScreen;