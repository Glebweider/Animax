/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Share, FlatList, AppStateStatus, AppState } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { BallIndicator } from 'react-native-indicators';

//Modal
import RatingModal from '@Modal/RatingModal';

//Components
import AnilibriaPlayer from '@Components/AnilibriaPlayer';
import KodikPlayer from '@Components/KodikPlayer';

//Icons
import ArrowLeftIcon from '@Icons/ArrowLeftIcon';
import SendIcon from '@Icons/SendIcon';
import MyListIcon from '@Icons/MyListIcon';
import StarIcon from '@Icons/StarIcon';
import PlayIcon from '@Icons/PlayIcon';
import ArrowRightIcon from '@Icons/ArrowRightIcon';

//Utils
import { getTokenFromStorage } from '@Utils/token';
import { i18n } from '@Utils/localization';
import { GET_ANIME } from '@Utils/graphql/getAnime';

//Interface
import { Anime } from '@Interfaces/animeAnimeScreen.interface';
import useAddAnimeList from '@Utils/fetch/addAnimeListUser';
import { useAlert } from '@Components/AlertContext';
import useGetAnimeEpisodes from '@Utils/fetch/getAnimeEpisodes';
import useRemoveAnimeListUser from '@Utils/fetch/removeAnimeListUser';
import useGetAnimeListUser from '@Utils/fetch/getAnimeListUser';
import { useFocusEffect } from '@react-navigation/native';
import useUpdateTimeSpent from '@Utils/fetch/updateTimeSpent';



const AnimeScreen = ({ navigation, route }) => {
    const client = useApolloClient();
    const { showAlert } = useAlert();
    const { animeId } = route.params;

    const [anime, setAnime] = useState<Anime>({
        id: 0,
        name: '',
        russian: '',
        poster: {
            id: '',
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
                name: ''
            },
        ],
        scoresStats: [
            {
                count: 0,
                score: 0,
            }
        ],
    });
    const [isInMyList, setIsInMyList] = useState<boolean>(false);
    const [episodesAnime, setEpisodesAnime] = useState<any>([]);
    const [episodesAnimeHost, setEpisodesAnimeHost] = useState<string>('');
    const [selectedEpisodeAnime, setSelectedEpisodeAnime] = useState<any>(null);
    const [isScroll, setScroll] = useState<boolean>(true);
    const [isOpenRatingWindow, setOpenRatingWindow] = useState<boolean>(false);
    const [isPlaying, setPlaying] = useState<boolean>(false);

    const { addAnimeListUser } = useAddAnimeList();
    const { getAnimeEpisodes } = useGetAnimeEpisodes();
    const { removeAnimeListUser } = useRemoveAnimeListUser();
    const { getAnimeListUser } = useGetAnimeListUser();
    const { updateTimeSpent } = useUpdateTimeSpent();
    
    const startTime = useRef<number | null>(null);
    const endTime = useRef<number | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            startTime.current = Date.now();
        
            return () => {
                endTime.current = Date.now();
            };
        }, [])
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = await getTokenFromStorage();

                endTime.current = Date.now();
                const timeSpent = ((endTime.current - (startTime.current || 0)));
                startTime.current = Date.now();

                await updateTimeSpent(token, Number(timeSpent));
            } catch (error) {
                showAlert(error.message);
            }
        };

        const intervalId = setInterval(fetchData, 6000);
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'inactive' || nextAppState === 'background') {
                startTime.current = Date.now();
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        
        fetchData();
        return () => {
            subscription.remove();
            clearInterval(intervalId)
        };
    }, []);

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
                    const animeNameArray = [data.animes[0].name, data.animes[0].russian, data.animes[0].japanese];
                    
                    for (let anime of animeNameArray) {
                        const animeEpisodes = await getAnimeEpisodes(anime);
                        if (animeEpisodes.list[0]) {

                            if (Object.keys(animeEpisodes.list[0].player.list).length === 0) {
                                showAlert('Error, notfound this anime episodes');
                                setEpisodesAnime(null);
                                break;
                            }

                            const arrayData = Object.values(animeEpisodes.list[0].player.list);
                            setEpisodesAnime(arrayData);
                            setEpisodesAnimeHost(animeEpisodes.list[0].player.host);
                            setSelectedEpisodeAnime(arrayData[0]);
                            break;
                        }
                    }
                } 
            }            
        }
        fetchData()
    }, [animeId, client]);

    useEffect(() => {
        const fetchMyAnimeList = async () => {
            try {
                let token = await getTokenFromStorage();
                const userAnimeList = await getAnimeListUser(token);
                const isAnimeInList = userAnimeList.some((userAnime) => userAnime.animeId == anime.id);
                setIsInMyList(isAnimeInList);
            } catch (error) {
                showAlert('error');
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
        const message = `${i18n.t('anime.share') + anime.russian}, ${anime.poster.originalUrl}`;
        try {
            await Share.share({
                message,
                title: anime.russian,
            });
        } catch (error) {
            showAlert(error.message);
        }
    };

    return (
        <ScrollView 
            scrollEnabled={isScroll} 
            contentContainerStyle={[styles.scrollContainer, !isPlaying && { maxHeight: '115%' }]}
            showsVerticalScrollIndicator={false}>
            <StatusBar style='light' />
            <RatingModal 
                visible={isOpenRatingWindow} 
                setVisible={setOpenRatingWindow}
                anime={anime} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon Style={styles.headerIconArrow} Color={'#fff'} />
                </TouchableOpacity>
            </View>  
            <View style={styles.previewAnimeContainer}>
                {anime.poster.originalUrl !== '' ?
                    <View style={{
                        width: '100%', 
                        height: '100%'
                        }}>
                        <View style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                            width: '100%', 
                            height: '100%', 
                            zIndex: 2, 
                            position: 'absolute'}}>
                        </View>
                        <Image 
                            source={{ uri: anime.poster.originalUrl }} 
                            style={styles.previewAnimeImage} />
                    </View>
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
                    style={styles.titleText}>{
                                (i18n.locale === 'ru' || i18n.locale === 'uk') 
                                ? anime.russian 
                                : anime.name}</Text>
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
                <TouchableOpacity
                    onPress={() => setOpenRatingWindow(true)}
                    style={styles.animeScoreContainer}>
                    <StarIcon Style={{}} Color={'#06C149'} Width={24} Height={24} />
                    <Text style={styles.animeScore}>
                        {Number(anime.score).toFixed(1)}
                    </Text>                    
                </TouchableOpacity>
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
                                <Text style={styles.genreText}>{(i18n.locale === 'ru' || i18n.locale === 'uk') 
                                    ? genre.russian 
                                    : genre.name}
                                </Text>                                
                            </View>
                        ))}                    
                    </ScrollView>
                </View>
            </View>
            {anime.description &&
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
            }
            <View style={styles.animeEpisodesContainer}>
                <View style={styles.animeEpisodesHeader}>
                    <Text style={styles.animeEpisodesText}>{i18n.t('anime.episodes')}</Text>                  
                </View>
                <FlatList
                    data={episodesAnime}
                    horizontal
                    keyExtractor={(item) => item.uuid}
                    style={{marginTop: 20}}
                    renderItem={({ item }) => 
                        <TouchableOpacity 
                            key={item.uuid}
                            onPress={() => setSelectedEpisodeAnime(item)}
                            style={styles.cardEpisodeContainer}>
                            <Image 
                                source={item.preview ? 
                                    {uri: `https://anilibria.tv${item.preview}`} 
                                    : 
                                    require('../../../assets/default-to-poster.jpg') 
                                }
                                style={styles.cardEpisodeImage} />
                            <PlayIcon 
                                Color={'#fff'} 
                                Style={{}}
                                Width={23}
                                Height={23} />
                            <Text style={styles.cardEpisodeText}>{i18n.t('anime.episode')} {item.episode}</Text>
                        </TouchableOpacity>
                    }
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 10}}/>
            </View>
            {/* <KodikPlayer shikimoriInfo={anime.name} /> */}
            {selectedEpisodeAnime ?
                <AnilibriaPlayer
                    url={`https://${episodesAnimeHost}${selectedEpisodeAnime.hls.fhd}`}
                    setPlaying={setPlaying}
                    setScroll={setScroll}
                    hasNextEpisode={true}
                    onNextEpisode={() => {console.log(343343434)}}/>
                :
                <BallIndicator color="#13D458" size={70} animationDuration={700} />
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    backgroundShadow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2
    },
    video: {
        height: '100%',
        width: '100%',
    },
    animeEpisodesCards: {
        alignItems: 'center',
        width: '100%',
    },
    cardEpisodeContainer: {
        width: 150,
        height: 115,
        marginRight: 7,
        marginLeft: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F222A',
        borderRadius: 10
    },
    cardEpisodeImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 10,
        opacity: 0.7
    },
    cardEpisodeText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
        position: 'absolute', 
        margin: 10, 
        left: 0, 
        bottom: 0
    },
    animeEpisodesContainer: {
        width: '100%',
        marginTop: 15,
        alignItems: 'center'
    },
    animeEpisodesHeader: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    animeEpisodesText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Outfit',
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
    animeNoneDescriptionText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Outfit',
        marginTop: 18,
    },
    genresContainer: {
        flex: 1,
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
    animeScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        height: '100%',
    }
});
    
export default AnimeScreen;