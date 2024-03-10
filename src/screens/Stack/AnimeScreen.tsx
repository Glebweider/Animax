import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Share, FlatList } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { GET_ANIME } from '../../utils/graphql/getAnime';
import { BallIndicator } from 'react-native-indicators';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import SendIcon from '../../components/icons/SendIcon';
import MyListIcon from '../../components/icons/MyListIcon';
import StarIcon from '../../components/icons/StarIcon';
import PlayIcon from '../../components/icons/PlayIcon';
import SmartTvIcon from '../../components/icons/SmartTvIcon';
import ArrowRightIcon from '../../components/icons/ArrowRightIcon copy';
import { getTokenFromStorage } from '../../utils/token';
import getAnimeListUser from '../../utils/fetch/getAnimeListUser';
import removeAnimeListUser from '../../utils/fetch/removeAnimeListUser';
import addAnimeListUser from '../../utils/fetch/addAnimeListUser';
import getAnimeEpisodes from '../../utils/fetch/getAnimeEpisodes';
import { ResizeMode, Video } from 'expo-av';
import RatingModal from '../../components/modals/RatingModal';

interface Anime {
    id: number;
    name: string;
    russian: string;
    poster: {
        id: string;
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
        }
    ];
    scoresStats: [
        {
            count: number;
            score: number;
        }
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
    const [isOpenRatingWindow, setOpenRatingWindow] = useState<boolean>(false);
    const videoRef = useRef<Video>(null);

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
                    const animeEpisodes = await getAnimeEpisodes(data.animes[0].name || data.animes[0].russian || data.animes[0].japanese);
                    if (animeEpisodes.list[0]) {
                        const arrayData = Object.values(animeEpisodes.list[0].player.list);
                        setEpisodesAnime(arrayData);
                        setEpisodesAnimeHost(animeEpisodes.list[0].player.host);
                        setSelectedEpisodeAnime(arrayData[0])
                    } else {
                        alert('Ошибка серии этого аниме не найдены');
                        setEpisodesAnime(null);
                    }
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
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <StatusBar style='light' />
            <RatingModal 
                visible={isOpenRatingWindow} 
                setVisible={setOpenRatingWindow}
                anime={anime} />
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
                                <Text style={styles.genreText}>{genre.russian}</Text>                                
                            </View>
                        ))}                    
                    </ScrollView>
                </View>
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
                <Text style={styles.animeNoneDescriptionText}>None description</Text>
            }
            <View style={styles.animeEpisodesContainer}>
                <View style={styles.animeEpisodesHeader}>
                    <Text style={styles.animeEpisodesText}>Episodes</Text>                  
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
                            <Text style={styles.cardEpisodeText}>Episode {item.episode}</Text>
                        </TouchableOpacity>
                    }
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 10}}/>
            </View>
            {selectedEpisodeAnime &&
                <Video
                    ref={videoRef}
                    source={{ uri: `https://${episodesAnimeHost}${selectedEpisodeAnime.hls.fhd}` }}
                    posterSource={selectedEpisodeAnime.preview ?
                        {uri: `https://anilibria.tv${selectedEpisodeAnime.preview}`} 
                        :
                        require('../../../assets/default-to-video.jpg')
                    }
                    posterStyle={styles.videoPoster}
                    usePoster={true}
                    style={styles.videoContainer}
                    videoStyle={styles.video}
                    resizeMode={ResizeMode.COVER}
                    useNativeControls={true}/> 
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        width: '100%',
        height: '118%',
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    videoContainer: {
        width: "92%", 
        height: 260,
        borderRadius: 10,
        marginTop: 25
    },
    videoPoster: {
        opacity: 0.9
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
        opacity: 0.9
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
        height: '100%'
    }
});
    
export default AnimeScreen;