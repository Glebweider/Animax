import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

// Components
import MyAnimeListButton from '@Components/buttons/MyAnimeList';
import SearchIcon from '@Components/icons/SearchIcon';
import PlayIcon from '@Components/icons/PlayIcon';
import TopAnimeLists from '@Components/TopAnimeLists';

// Data
import {
    COLOR_PRIMARY, COLOR_TEXT_PRIMARY, DEFAULT_POSTER,
    HOME_RECOMENDATION_LIMIT, HOME_TOPHITS_LIMIT, ICON_APP
} from '@Data/constants';

// Utils
import { formatAnimeTitle, i18n, isCisLocale } from '@Utils/localization';

// GraphQl
import { GET_RECOMENDATIONANIME } from '@GraphQl/getRecomendationAnime';
import { GET_TOPHITSANIME } from '@GraphQl/getTopHitsAnimes';

// Interface
import { IAnimeMedium } from '@Interfaces/HomeScreen.interface';
import { EStatus } from '@Interfaces/AnimeScreen.interface';

// Redux
import { RootState } from '@Redux/store';


const HomeScreen = ({ navigation }) => {
    const [selectAnime, setSelectAnime] = useState<IAnimeMedium>({ poster: { originalUrl: '' }, russian: '', english: '', japanese: '', score: 0, id: '', name: '', rating: '', status: EStatus.ANONS, genres: [{ id: 0, russian: '', name: '' }] });
    const [topHitsAnime, setTopHitsAnime] = useState<IAnimeMedium[]>([]);
    const [recomendationAnime, setRecomendationAnime] = useState<IAnimeMedium[]>([]);

    const [genreId, setGenreId] = useState<string>(null);

    const userInterests = useSelector((state: RootState) => state.userReducer.interests);

    const { data: topHitsData } = useQuery(GET_TOPHITSANIME, {
        variables: {
            page: 1,
            limit: Number(HOME_TOPHITS_LIMIT),
            order: 'ranked',
            season: String(new Date().getFullYear())
        },
    });

    const { data: recomendationData } = useQuery(GET_RECOMENDATIONANIME, {
        variables: {
            limit: Number(HOME_RECOMENDATION_LIMIT),
            order: 'ranked',
            genre: genreId
        },
    });

    useEffect(() => {
        if (!genreId && userInterests.length > 0) {
            setGenreId(userInterests[Math.floor(Math.random() * userInterests.length)]);
        }
    }, [genreId, userInterests]);

    useEffect(() => {
        if (topHitsData) {
            setTopHitsAnime(topHitsData.animes);
            if (!selectAnime || !selectAnime.id) {
                setSelectAnime(topHitsData.animes[0]);
            }
        }
    }, [topHitsData]);

    useEffect(() => {
        if (recomendationData) {
            setRecomendationAnime(recomendationData.animes);
        }
    }, [recomendationData]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <StatusBar style='light' />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image source={ICON_APP} style={styles.headerLogo} />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AnimeSearchScreen')}
                        style={styles.headerIconSearch}>
                        <SearchIcon Color={COLOR_TEXT_PRIMARY} Style={styles.headerIconSearch} />
                    </TouchableOpacity>
                </View>
                <View style={styles.selectAnimeContainer}>
                    <LinearGradient
                        colors={['rgba(24, 26, 32, 0)', 'rgba(24, 26, 32, 100)']}
                        start={{ x: 1, y: 0, }}
                        end={{ x: 0.1, y: 1 }}
                        style={styles.backgroundShadow}>
                    </LinearGradient>
                    {selectAnime?.poster?.originalUrl !== '' &&
                        <View style={styles.imageWrapper}>
                            <Animated.Image
                                key={selectAnime.id}
                                source={selectAnime?.poster?.originalUrl ?
                                    { uri: selectAnime.poster.originalUrl } : DEFAULT_POSTER
                                }
                                style={styles.selectAnimeShiftedImage}
                                resizeMode="cover"
                                entering={FadeIn.duration(500)} />
                        </View>
                    }
                    <View style={styles.animeDataContainer}>
                        <View style={styles.animeContent}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.animeName}>
                                {formatAnimeTitle(selectAnime)}
                            </Text>
                            <View style={styles.tagsContainer}>
                                {selectAnime.genres ?
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={styles.animeDescription}>
                                        {selectAnime.genres.map(genre =>
                                            isCisLocale ? genre.russian : genre.name
                                        ).join(', ')}
                                    </Text>
                                    :
                                    <Text>{i18n.t('loading')}</Text>
                                }
                            </View>
                            <View style={styles.animeButtonsContainer}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AnimeScreen', { animeId: selectAnime.id })}
                                    style={styles.animeButtonPlay}>
                                    <PlayIcon Color={COLOR_TEXT_PRIMARY} Style={{ marginRight: 7, marginLeft: 13, }} Width={16} Height={16} />
                                    <Text style={styles.animeButtonTextPlay}>{i18n.t('play')}</Text>
                                </TouchableOpacity>
                                <View style={{ marginLeft: 10 }}>
                                    <MyAnimeListButton animeId={selectAnime.id} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Top hits anime */}
                <TopAnimeLists
                    data={topHitsAnime}
                    selectAnime={setSelectAnime}
                    text={'home.tophitsanime'}
                    limit={HOME_TOPHITS_LIMIT}
                    navigate={() => navigation.navigate('TopHitsAnimeScreen')} />

                {/* Recomondation for you */}
                <TopAnimeLists
                    data={recomendationAnime}
                    selectAnime={setSelectAnime}
                    text={'home.yourecomendationanimes'}
                    limit={HOME_RECOMENDATION_LIMIT}
                    navigate={() => navigation.navigate('RecomendationsAnimeScreen')} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        height: '118%'
    },
    animeDataContainer: {
        position: 'absolute',
        zIndex: 3,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    tagsContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    animeContent: {
        width: '80%',
        height: '25%',
        margin: 18,
    },
    animeName: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 17,
        fontFamily: 'Outfit',
        overflow: 'hidden',
    },
    animeDescription: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 11,
        fontFamily: 'Outfit',
        overflow: 'hidden',
    },
    animeButtonsContainer: {
        flexDirection: 'row',
        marginTop: 12,
    },
    animeButtonPlay: {
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 86,
        height: 36,
        flexDirection: 'row',
    },
    animeButtonTextPlay: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginRight: 13,
    },
    backgroundShadow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2
    },
    selectAnimeContainer: {
        width: '100%',
        height: '39%',
        justifyContent: 'center',
    },
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
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
    headerIconSearch: {
        width: 30,
        height: 30,
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    selectAnimeShiftedImage: {
        width: '100%',
        height: '140%',
        position: 'absolute',
        top: 0,
    }
});

export default HomeScreen;