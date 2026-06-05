import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Share, FlatList, Animated, Easing } from 'react-native';
import { useApolloClient } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';

// Modal
import RatingModal from '@Modal/RatingModal';

// Components
import AnilibriaPlayer from '@Components/AnilibriaPlayer';
import KodikPlayer from '@Components/KodikPlayer';
import { useAlert } from '@Components/alert/AlertContext';
import { BallIndicator } from '@Components/BallIndicator';
import { AnimeCard, AnimeCardSkeleton } from '@Components/cards/Anime';

// Icons
import ArrowLeftIcon from '@Icons/ArrowLeftIcon';
import SendIcon from '@Icons/SendIcon';
import MyListIcon from '@Icons/MyListIcon';
import StarIcon from '@Icons/StarIcon';
import PlayIcon from '@Icons/PlayIcon';
import ArrowRightIcon from '@Icons/ArrowRightIcon';

// Utils
import { formatAnimeTitle, i18n, isCisLocale } from '@Utils/localization';
import { useUserAnime } from '@Utils/hooks';
import { Formatter } from '@Utils/functions';

// GraphQl
import { GET_ANIME } from '@GraphQl/getAnime';
import { GET_ANIMEBYGENRES } from '@GraphQl/getAnimeByGenres';

// Rest
import useGetAnimeEpisodes from '@Rest/anime/getAnimeEpisodes';
import useUpdateTimeSpent from '@Rest/analytics/updateTimeSpent';
import useGetCommentsCount from '@Rest/comments/getCommentsCount';

//Interface
import { IAnime, IEpisode } from '@Interfaces/AnimeScreen.interface';
import { IRearchAnime } from '@Interfaces/ResearchScreen.interface';

// Data
import { ANIME_RATINGS } from '@Data/animeRatings';
import {
    ANIME_RECOMENDATION_LIMIT, COLOR_BACKGROUND_SECONDARY,
    COLOR_PRIMARY, COLOR_PRIMARY_DARK, COLOR_PRIMARY_LIGHT,
    COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY, DEFAULT_POSTER
} from '@Data/constants';


const AnimeScreen = ({ navigation, route }) => {
    const client = useApolloClient();
    const { showAlert } = useAlert();
    const { animeId } = route.params;

    const [anime, setAnime] = useState<IAnime>({ id: '', name: '', russian: '', japanese: '', english: '', poster: { originalUrl: '' }, score: 0, status: '', rating: '', createdAt: '', description: '', genres: [{ id: 0, russian: '', name: '' }], scoresStats: [{ count: 0, score: 0 }] });
    const [animeRecomendations, setAnimeRecomendations] = useState<IRearchAnime[]>([]);
    const [episodes, setEpisodes] = useState<IEpisode[]>([]);

    const [selectInfoAnime, setSelectInfoAnime] = useState<string>('MoreLikeThis');

    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [selectedEpisodeId, setSelectedEpisodeId] = useState<number>(1);

    const [isOpenRatingWindow, setOpenRatingWindow] = useState<boolean>(false);
    const [isPlaying, setPlaying] = useState<boolean>(false);
    const [moveLeft, setMoveLeft] = useState<boolean>(true);

    const { isInMyList, toggleAnimeList } = useUserAnime(animeId);
    const { getAnimeEpisodes } = useGetAnimeEpisodes();
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
    //             endTime.current = Date.now();
    //             const timeSpent = ((endTime.current - (startTime.current || 0)));
    //             startTime.current = Date.now();

    //             await updateTimeSpent(Number(timeSpent));
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
            setEpisodes([]);

            if (animeId) {
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
                            setEpisodes([]);
                            return;
                        }

                        setEpisodes(animeEpisodes.episodes);
                    }
                }
            }
        }
        fetchData()
    }, [animeId, client]);

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

    const fetchCommentsCount = async () => {
        setCommentsCount(await getCommentsCount(animeId));
    };

    const searchRecomendationAnime = async (genres: any[]) => {
        const shuffled = [...genres].sort(() => 0.5 - Math.random());

        const randomGenres = shuffled.slice(0, Math.min(2, genres.length));
        const randomGenreIds = randomGenres.map(g => g.id).join(',');

        const { data, error } = await client.query({
            query: GET_ANIMEBYGENRES,
            variables: {
                page: 1,
                limit: ANIME_RECOMENDATION_LIMIT,
                genreIds: randomGenreIds,
                excludeIds: String(animeId)
            },
        });

        if (data && !error) {
            setAnimeRecomendations(data.animes);
        }
    }

    const handleShare = async () => {
        const name = formatAnimeTitle(anime);
        const message = `${i18n.t('anime.share') + name}, ${anime.poster.originalUrl}`;
        try {
            await Share.share({
                message,
                title: name,
            });
        } catch (error) {
            showAlert(error.message);
        }
    };

    return (
        <ScrollView
            scrollEnabled={!isPlaying}
            contentContainerStyle={[styles.container, isPlaying && { maxHeight: '100%' }]}
            showsVerticalScrollIndicator={false}>
            <StatusBar style='light' />
            <RatingModal
                visible={isOpenRatingWindow}
                setVisible={setOpenRatingWindow}
                anime={anime} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon Style={styles.headerIconArrow} Color={COLOR_TEXT_PRIMARY} />
                </TouchableOpacity>
            </View>
            <View style={styles.previewAnimeContainer}>
                {anime?.poster?.originalUrl !== '' ? (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={anime?.poster?.originalUrl ? { uri: anime.poster.originalUrl } : DEFAULT_POSTER}
                            style={[styles.previewAnimeImage, { position: 'absolute' }]}
                            resizeMode="cover"
                            blurRadius={15} />
                        <View style={styles.darkBackground} />
                        <Image
                            source={anime?.poster?.originalUrl ? { uri: anime.poster.originalUrl } : DEFAULT_POSTER}
                            style={{ width: '60%', height: '90%', zIndex: 3 }}
                            resizeMode="contain" />
                    </View>
                ) : (
                    <BallIndicator color={COLOR_PRIMARY_LIGHT} size={70} count={8} />
                )}
            </View>
            <View style={styles.titleContainer}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.titleText}>
                    {formatAnimeTitle(anime)}
                </Text>
                <View style={styles.titleContainerButtons}>
                    <TouchableOpacity
                        onPress={toggleAnimeList}
                        style={styles.titleButtonMyList}>
                        <MyListIcon Style={{}} Color={isInMyList ? COLOR_PRIMARY : COLOR_TEXT_PRIMARY} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleShare()}
                        style={styles.titleButtonSend}>
                        <SendIcon Style={{}} Color={COLOR_TEXT_PRIMARY} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.animeData}>
                <TouchableOpacity
                    onPress={() => setOpenRatingWindow(true)}
                    style={styles.animeScoreContainer}>
                    <StarIcon Style={{}} Color={COLOR_PRIMARY} Width={24} Height={24} />
                    <Text style={styles.animeScore}>
                        {Number(anime.score).toFixed(1)}
                    </Text>
                </TouchableOpacity>
                <ArrowRightIcon Color={COLOR_PRIMARY} Width={22} Height={22} />
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
                                <Text style={styles.genreText}>{ANIME_RATINGS[anime.rating]}+</Text>
                            </View>
                            {anime.genres.map((genre) => (
                                <View
                                    style={styles.genreContainer}
                                    key={genre.id}>
                                    <Text style={styles.genreText}>
                                        {isCisLocale ? genre.russian : genre.name}
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
            {!anime.id ? (
                <BallIndicator
                    style={{ marginTop: 55, marginBottom: 40 }}
                    color={COLOR_PRIMARY_LIGHT}
                    size={70}
                    count={8} />
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
                                            { uri: `${process.env.EXPO_PUBLIC_ANILIBIRTY_API_URL}/${item.preview.optimized.src}` }
                                            : DEFAULT_POSTER
                                        }
                                        style={styles.cardEpisodeImage} />
                                    <PlayIcon Color={COLOR_TEXT_PRIMARY} Style={{}} Width={23} Height={23} />
                                    <Text style={styles.cardEpisodeText}>{i18n.t('anime.episode')} {item.ordinal}</Text>
                                </TouchableOpacity>
                            }
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 10 }} />
                    </View>
                    <AnilibriaPlayer
                        animeId={anime.id}
                        selectedEpisodeId={setSelectedEpisodeId}
                        episode={episodes[selectedEpisodeId - 1]}
                        setPlaying={setPlaying}
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
                        <Text style={selectInfoAnime == 'Comments' ? styles.infoTextActive : styles.infoText}>{i18n.t('anime.comments')} ({Formatter.views(commentsCount)})</Text>
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
                        <FlatList
                            data={animeRecomendations}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <AnimeCard
                                    navigation={navigation}
                                    item={item}
                                    width={165}
                                    height={225} />
                            )}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() =>
                                <View style={styles.skeletonGrid}>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <AnimeCardSkeleton
                                            key={i}
                                            width={165}
                                            height={225} />
                                    ))}
                                </View>
                            }
                            contentContainerStyle={styles.containerAnimeTop}
                            numColumns={2} />
                    </View>
                    :
                    <View style={styles.commentsContainer}>
                        <Text style={styles.commentsText}>{Formatter.views(commentsCount)} {i18n.t('anime.comments')}</Text>
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
    container: {
        flexGrow: 1,
        alignItems: 'center',
    },
    darkBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
        zIndex: 2,
        position: 'absolute'
    },
    skeletonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        rowGap: 14
    },
    commentsContainer: {
        width: '92%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    seeAllComments: {
        color: COLOR_PRIMARY_DARK,
        fontSize: 13,
        fontFamily: 'Outfit'
    },
    commentsText: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 16,
        fontFamily: 'Outfit'
    },
    containerAnimeTop: {
        width: '100%',
        flexGrow: 1,
        marginBottom: 15,
        gap: 12
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
        color: COLOR_TEXT_SECONDARY,
        fontSize: 13,
        fontFamily: 'Outfit',
    },
    infoTextActive: {
        color: COLOR_PRIMARY,
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
        backgroundColor: COLOR_PRIMARY,
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
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        borderRadius: 10
    },
    selectedEpisode: {
        borderColor: COLOR_PRIMARY,
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
        color: COLOR_TEXT_PRIMARY,
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
        color: COLOR_TEXT_PRIMARY,
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
        color: COLOR_TEXT_PRIMARY,
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
        borderColor: COLOR_PRIMARY,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        paddingRight: 9,
        paddingLeft: 9
    },
    genreText: {
        color: COLOR_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 8
    },
    animeScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    animeScore: {
        marginLeft: 7,
        color: COLOR_PRIMARY,
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
        color: COLOR_TEXT_PRIMARY,
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
        color: COLOR_TEXT_PRIMARY,
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
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
    }
});

export default AnimeScreen;