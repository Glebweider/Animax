/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Share, FlatList, Animated, Easing } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { BallIndicator } from 'react-native-indicators';
import { useFocusEffect } from '@react-navigation/native';

//Modal
import RatingModal from '@Modal/RatingModal';

//Components
import AnilibriaPlayer from '@Components/AnilibriaPlayer';
import KodikPlayer from '@Components/KodikPlayer';
import { useAlert } from '@Components/alert/AlertContext';

//Icons
import ArrowLeftIcon from '@Icons/ArrowLeftIcon';
import SendIcon from '@Icons/SendIcon';
import MyListIcon from '@Icons/MyListIcon';
import StarIcon from '@Icons/StarIcon';
import PlayIcon from '@Icons/PlayIcon';
import ArrowRightIcon from '@Icons/ArrowRightIcon';

//Utils
import { getTokenFromStorage } from '@Utils/functions/token';
import { i18n } from '@Utils/localization';
import { GET_ANIME } from '@Utils/api/graphql/getAnime';
import useAddAnimeList from '@Utils/api/rest/anime/addAnimeListUser';
import useGetAnimeEpisodes from '@Utils/api/rest/anime/getAnimeEpisodes';
import useRemoveAnimeListUser from '@Utils/api/rest/anime/removeAnimeListUser';
import useUpdateTimeSpent from '@Utils/api/rest/analytics/updateTimeSpent';
import useGetCommentsCount from '@Utils/api/rest/comments/getCommentsCount';
import formatViews from '@Utils/formatters/views';
import { GET_ANIMEBYGENRES } from '@Utils/api/graphql/getAnimeByGenres';

//Interface
import { IAnime } from '@Interfaces/animeAnimeScreen.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@Redux/store';

const arrayRatings = {
    g: 0,
    pg: 10,
    pg_13: 13,
    r: 17,
    r_plus: 18,
    rx: 18,
    nc_17: 18,
};

export interface IEpisode {
    id: string;
    ordinal: number;
    name: string;
    preview: {
        optimized: {
            src: string;
        };
    };
    hls_480: string;
    hls_720: string;
    hls_1080: string;
}

const AnimeScreen = ({ navigation, route }) => {
    const client = useApolloClient();
    const { showAlert } = useAlert();
    const { animeId } = route.params;

    const userAnimeList = useSelector((state: RootState) => state.userReducer.animelist);

    const [anime, setAnime] = useState<IAnime>({
        id: '',
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
    const [animeRecomendations, setAnimeRecomendations] = useState<any[]>([]);
    const [isInMyList, setIsInMyList] = useState<boolean>(false);
    const [episodes, setEpisodes] = useState<IEpisode[]>([]);
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [selectedEpisodeId, setSelectedEpisodeId] = useState<number>(1);
    const [isScroll, setScroll] = useState<boolean>(true);
    const [isOpenRatingWindow, setOpenRatingWindow] = useState<boolean>(false);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectInfoAnime, setSelectInfoAnime] = useState<string>('MoreLikeThis');
    const [moveLeft, setMoveLeft] = useState<boolean>(true);


    const { addAnimeListUser } = useAddAnimeList();
    const { getAnimeEpisodes } = useGetAnimeEpisodes();
    const { removeAnimeListUser } = useRemoveAnimeListUser();
    const { updateTimeSpent } = useUpdateTimeSpent();
    const { getCommentsCount } = useGetCommentsCount();

    const moveValue = useRef(new Animated.Value(0)).current;
    const startTime = useRef<number | null>(null);
    const endTime = useRef<number | null>(null);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         startTime.current = Date.now();

    //         return () => {
    //             endTime.current = Date.now();
    //         };
    //     }, [])
    // );

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             let token = await getTokenFromStorage();

    //             endTime.current = Date.now();
    //             const timeSpent = ((endTime.current - (startTime.current || 0)));
    //             startTime.current = Date.now();

    //             await updateTimeSpent(token, Number(timeSpent));
    //         } catch (error) {
    //             showAlert(error.message);
    //         }
    //     };

    //     const intervalId = setInterval(fetchData, 6000);
    //     const handleAppStateChange = (nextAppState: AppStateStatus) => {
    //         if (nextAppState === 'inactive' || nextAppState === 'background') {
    //             startTime.current = Date.now();
    //         }
    //     };
    //     const subscription = AppState.addEventListener('change', handleAppStateChange);

    //     fetchData();
    //     return () => {
    //         subscription.remove();
    //         clearInterval(intervalId)
    //     };
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (animeId) {
                setLoading(true);
                const { data, error } = await client.query({
                    query: GET_ANIME,
                    variables: {
                        id: String(animeId)
                    },
                });

                if (data && !error) {
                    setAnime(data.animes[0]);
                    searchRecomendationAnime(data.animes[0].genres);

                    const animeName = data.animes[0].name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/gi, '')
                        .trim()
                        .replace(/\s+/g, '-');

                    const animeEpisodes = await getAnimeEpisodes(animeName);
                    if (animeEpisodes) {
                        if (Object.keys(animeEpisodes.episodes).length === 0) {
                            showAlert('Error, not found this anime episodes');
                            setEpisodes(null);
                            return;
                        }

                        setEpisodes(animeEpisodes.episodes);
                    }
                }

                setLoading(false);
            }
        }
        fetchData()
    }, [animeId, client]);

    useEffect(() => {
        setIsInMyList(userAnimeList.some(animeId => animeId == animeId));
    }, [animeId]);

    const fetchCommentsCount = async () => {
        try {
            let token = await getTokenFromStorage();
            if (token) {
                const data = await getCommentsCount(token, animeId);
                if (data) {
                    setCommentsCount(data);
                }
            }
        } catch (error) {
            showAlert('Error fetching comments');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCommentsCount();
        }, [animeId])
    );

    useEffect(() => {
        const animation = Animated.timing(moveValue, {
            toValue: moveLeft ? 0 : 173,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
        });

        animation.start();

        return () => {
            animation.stop();
        };
    }, [moveLeft, moveValue]);

    const searchRecomendationAnime = async (genres: any[]) => {
        const shuffled = [...genres].sort(() => 0.5 - Math.random());

        const randomGenres = shuffled.slice(0, Math.min(2, genres.length));
        const randomGenreIds = randomGenres.map(g => g.id).join(',');

        const { data, error } = await client.query({
            query: GET_ANIMEBYGENRES,
            variables: {
                page: 1,
                limit: 12,
                genreIds: randomGenreIds,
                excludeIds: animeId
            },
        });

        if (data && !error) {
            setAnimeRecomendations(data.animes);
        }
    }

    const handlePressMyList = async () => {
        let token = await getTokenFromStorage();
        if (isInMyList) {
            await removeAnimeListUser(token, String(anime.id));
        } else {
            await addAnimeListUser(token, anime.id);
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
            contentContainerStyle={[styles.scrollContainer, isPlaying && { maxHeight: '100%' }]}
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
                    <View style={{ width: '100%', height: '100%' }}>
                        <View style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            width: '100%',
                            height: '100%',
                            zIndex: 2,
                            position: 'absolute'
                        }}>
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
                    <TouchableOpacity
                        onPress={() => handlePressMyList()}
                        style={styles.titleButtonMyList}>
                        <MyListIcon Style={{}} Color={isInMyList ? '#06C149' : '#fff'} />
                    </TouchableOpacity>
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
                    {anime.genres.length > 0 &&
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.genresScrollView}>
                            <View style={styles.genreContainer}>
                                <Text style={styles.genreText}>{arrayRatings[anime.rating]}+</Text>
                            </View>
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
                    }
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
            {isLoading ? (
                <BallIndicator style={{ marginTop: 55, marginBottom: 40 }} color="#13D458" size={70} animationDuration={700} />
            ) : episodes.length > 0 ? (
                <>
                    <View style={styles.animeEpisodesContainer}>
                        <View style={styles.animeEpisodesHeader}>
                            <Text style={styles.animeEpisodesText}>{i18n.t('anime.episodes')}</Text>
                        </View>
                        <FlatList
                            data={episodes}
                            horizontal
                            keyExtractor={(item) => item.id}
                            style={{ marginTop: 15 }}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => setSelectedEpisodeId(item.ordinal)}
                                    style={[item.ordinal === selectedEpisodeId && styles.selectedEpisode, styles.cardEpisodeContainer]}>
                                    <Image
                                        source={item.preview ?
                                            { uri: `https://www.anilibria.top${item.preview.optimized.src}` }
                                            :
                                            require('../../../assets/default-to-poster.jpg')
                                        }
                                        style={styles.cardEpisodeImage} />
                                    <PlayIcon
                                        Color={'#fff'}
                                        Style={{}}
                                        Width={23}
                                        Height={23} />
                                    <Text style={styles.cardEpisodeText}>{i18n.t('anime.episode')} {item.ordinal}</Text>
                                </TouchableOpacity>
                            }
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 10 }} />
                    </View>
                    <AnilibriaPlayer
                        episode={episodes[selectedEpisodeId]}
                        setPlaying={setPlaying}
                        setScroll={setScroll}
                        hasNextEpisode={episodes.findIndex(ep => ep.ordinal === selectedEpisodeId) < episodes.length - 1}
                        hasPrevEpisode={episodes.findIndex(ep => ep.ordinal === selectedEpisodeId) > 0}
                        onNextEpisode={() => { setSelectedEpisodeId(selectedEpisodeId + 1) }}
                        onPrevEpisode={() => { setSelectedEpisodeId(selectedEpisodeId - 1) }} />
                </>
            ) : (
                <KodikPlayer shikimoriId={anime.id} />
            )}

            <View style={styles.infoContainer}>
                <View style={styles.infoTextContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectInfoAnime('MoreLikeThis');
                            setMoveLeft(true);
                        }}
                        style={styles.methodContainer}>
                        <Text style={selectInfoAnime == 'MoreLikeThis' ? styles.infoTextActive : styles.infoText}>{i18n.t('anime.morelikethis')} ({animeRecomendations.length ? animeRecomendations.length : 0})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectInfoAnime('Comments');
                            setMoveLeft(false);
                        }}
                        style={styles.methodContainer}>
                        <Text style={selectInfoAnime == 'Comments' ? styles.infoTextActive : styles.infoText}>{i18n.t('anime.comments')} ({formatViews(commentsCount)})</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line}>
                    <Animated.View style={[styles.lineActive, {
                        transform: [{ translateX: moveValue }],
                    }]} />
                </View>
            </View>
            <View style={{ width: '94%', height: '100%', marginTop: 20, alignItems: 'center' }}>
                {moveLeft ?
                    <View style={styles.animeRecomendationContainer}>
                        {animeRecomendations.length != 0 ?
                            <FlatList
                                data={animeRecomendations}
                                scrollEnabled={false}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('AnimeScreen', { animeId: item.id })}
                                        key={item.id}
                                        style={styles.animeContainerAnimeTop}>
                                        <View style={styles.scoreContainer}>
                                            <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
                                        </View>
                                        {(item.rating === 'r_plus' || item.rating === 'rx') && (
                                            <View style={styles.ratingContainer}>
                                                <Text style={styles.ratingText}>18+</Text>
                                            </View>
                                        )}
                                        <Image
                                            source={{ uri: item.poster.originalUrl }}
                                            style={styles.animeImageAnimeTop} />
                                    </TouchableOpacity>
                                )}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.containerAnimeTop}
                                numColumns={2} />
                            :
                            <BallIndicator
                                color='#13D458' size={70}
                                animationDuration={700} />
                        }
                    </View>
                    :
                    <View style={styles.commentsContainer}>
                        <Text style={styles.commentsText}>{formatViews(commentsCount)} {i18n.t('anime.comments')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('CommentsScreen', { animeId: animeId, commentsCount: commentsCount })}>
                            <Text style={styles.seeAllComments}>{i18n.t('home.seeall')}</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#181A20'
    },
    commentsContainer: {
        width: '92%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    seeAllComments: {
        color: '#06C049',
        fontSize: 13,
        fontFamily: 'Outfit'
    },
    commentsText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Outfit'
    },
    scoreContainer: {
        zIndex: 2,
        borderRadius: 6,
        width: 33,
        height: 24,
        backgroundColor: '#06C149',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 12
    },
    ratingContainer: {
        zIndex: 2,
        borderRadius: 6,
        width: 33,
        height: 24,
        borderColor: 'red',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    ratingText: {
        color: 'red',
        fontFamily: 'Outfit',
        fontSize: 11,
    },
    scoreText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
    },
    containerAnimeTop: {
        width: '100%',
        flexGrow: 1,
        marginBottom: 15
    },
    animeContainerAnimeTop: {
        margin: 7,
        width: 165,
        height: 225,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: '#1F222A'
    },
    animeImageAnimeTop: {
        width: '100%',
        height: '100%',
        zIndex: 1,
        borderRadius: 10,
        position: 'absolute'
    },
    animeRecomendationContainer: {
        flexGrow: 1,
        alignItems: 'center'
    },
    infoContainer: {
        width: '90%',
        marginTop: 25,
    },
    infoTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    methodContainer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        color: '#616161',
        fontSize: 13,
        fontFamily: 'Outfit',
    },
    infoTextActive: {
        color: '#06C149',
        fontSize: 13,
        fontFamily: 'Outfit',
    },
    line: {
        width: '100%',
        backgroundColor: '#35383F',
        height: 3,
        borderRadius: 50,
        marginTop: 12,
    },
    lineActive: {
        width: '50%',
        backgroundColor: '#06C149',
        height: 4,
        borderRadius: 50,
    },
    cardEpisodeContainer: {
        width: 150,
        height: 110,
        marginRight: 7,
        marginLeft: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F222A',
        borderRadius: 10
    },
    selectedEpisode: {
        borderColor: '#06C149',
        borderWidth: 1,
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
        paddingRight: 9,
        paddingLeft: 9
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
    headerIconArrow: {
        width: 30,
        height: 30,
    },
    previewAnimeContainer: {
        width: '100%',
        height: 300,
    },
    previewAnimeImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1F222A'
    }
});

export default AnimeScreen;