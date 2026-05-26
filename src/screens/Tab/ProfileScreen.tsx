import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { BarChart } from "react-native-gifted-charts";
import { useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { BallIndicator } from '@Components/BallIndicator';
import CrownIcon from '@Components/icons/CrownIcon';
import SettingsIcon from '@Components/icons/SettingsIcon';
import AnimeCard from '@Components/cards/Anime';

// Data
import {
    COLOR_BACKGROUND_PRIMARY, COLOR_PRIMARY,
    COLOR_PRIMARY_LIGHT, COLOR_TEXT_PRIMARY,
    PROFILE_CHUNK_SIZE
} from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';
import { GET_ANIMESANALYTICS } from '@Utils/api/graphql';
import { CacheMyFavoriteGenresService, ICachedMyFavoriteGenres } from '@Utils/services/MyFavoriteGenresCache';

// GraphQl
import { GET_ANIMES } from '@GraphQl/getAnimes';

// Rest
import useGetUserProfile from '@Rest/user/getUserProfile';

// Redux
import { RootState } from '@Redux/store';
import { addFilter } from '@Redux/reducers/sortReducer';

// Interface
import { IMyFavoriteGenre, IUserProfile } from '@Interfaces/ProfileScreen.interface';


const ProfileScreen = ({ navigation, route }) => {
    const client = useApolloClient();
    const dispatch = useDispatch();
    const uuid = useSelector((state: RootState) => state.userReducer.uuid);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<IUserProfile>({
        uuid: "",
        interests: [],
        animelist: [],
        premium: false,
        description: "",
        profile: {
            avatar: "",
            nickname: "",
        },
        animestats: {
            counterWatchedAnime: 0,
            timeSpentWatchingAnime: 0,
            achievementsCountWatchedAnime: 0,
        }
    });
    const [topGenres, setTopGenres] = useState<IMyFavoriteGenre[]>();

    const { getUserProfile } = useGetUserProfile();
    const { userId } = route.params;

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            const userData = await getUserProfile(userId);
            if (userData) {
                setUser(userData);
                let animeList = userData.animelist ?? [];

                // ===== Get Favorite Animes =====
                const { data } = await client.query({
                    query: GET_ANIMES,
                    variables: {
                        ids: animeList.join(","),
                        limit: 10,
                        page: 1
                    }
                });

                if (data?.animes)
                    setUser((prev) => ({ ...prev, animelist: data?.animes }));

                // ===== Get Favorite Genres =====
                let allAnimes = [];
                let localCache = [];

                if (uuid == userId) {
                    localCache = await CacheMyFavoriteGenresService.getList();
                    if (localCache) {
                        const liveIdsSet = new Set(animeList);
                        const updatedCache = localCache.filter(cachedAnime => liveIdsSet.has(cachedAnime.id));
                        allAnimes = updatedCache;

                        const idsSet = new Set(localCache.map(obj => obj.id));
                        animeList = animeList.filter(animeId => !idsSet.has(animeId));
                    }
                }

                const chunks = Array.from(
                    { length: Math.ceil(animeList.length / PROFILE_CHUNK_SIZE) },
                    (_, index) => animeList.slice(index * PROFILE_CHUNK_SIZE, index * PROFILE_CHUNK_SIZE + PROFILE_CHUNK_SIZE)
                );

                for (const [index, ids] of chunks.entries()) {
                    try {
                        const dataAnalytics = await client.query({
                            query: GET_ANIMESANALYTICS,
                            variables: {
                                ids: ids.join(","),
                                page: 1,
                            },
                            fetchPolicy: "no-cache",
                        });

                        const animes = dataAnalytics.data?.animes ?? [];
                        allAnimes.push(...animes);

                        console.log(`Loaded chunk ${index + 1}/${chunks.length}`);
                    } catch (error: any) {
                        console.log(`Error: Чанк ${index + 1} окончательно зафейлился`, error);
                        break;
                    }
                }

                const map = new Map<string, { id: string; count: number }>();
                const cache: ICachedMyFavoriteGenres[] = [];

                for (const anime of allAnimes) {
                    for (const genre of anime.genres || []) {
                        const key = genre.russian;
                        const genreId = genre.id;

                        const current = map.get(key);
                        if (current) {
                            current.count += 1;
                        } else {
                            map.set(key, { id: genreId, count: 1 });
                        }
                    }
                }

                for (const anime of allAnimes) {
                    if (!anime.id || !anime.genres) continue;
                    const animeGenres = anime.genres.map((genre: any) => ({ id: genre.id, russian: genre.russian }));

                    cache.push({
                        id: String(anime.id),
                        genres: animeGenres,
                    });
                }

                const result = [...map.entries()]
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(0, 5)
                    .map(([label, dataObj]) => {
                        const item: IMyFavoriteGenre = {
                            id: dataObj.id,
                            label: label,
                            value: dataObj.count
                        };
                        item.onPress = () => handleClickFavoriteGenre(item);

                        return item;
                    });

                setTopGenres(result);

                if (uuid == userId && (animeList.length != 0 || localCache.length > allAnimes.length))
                    await CacheMyFavoriteGenresService.saveList(cache);

                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    // Добавить возможность ставить что например аниме просмотренно или ожидает просмотра и тд.
    // Добавить отображенния статуса аниме для человека, рядом с оценкой показывать просмотренно или нет
    // Начать вести статистику просмотра аниме и тд.

    const handleClickFavoriteGenre = (data: IMyFavoriteGenre) => {
        dispatch(addFilter({ id: Number(data.id), text: data.label }));
        navigation.navigate('AnimeSearchScreen');
    }

    if (!user)
        return <BallIndicator color={COLOR_PRIMARY_LIGHT} size={70} count={8} />;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                alignItems: 'center',
                paddingBottom: 70,
            }}
            showsVerticalScrollIndicator={false}>
            <StatusBar style='light' />
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../../assets/icon.png')} style={styles.headerIcon} />
                    <Text style={styles.headerText}>{i18n.t('navigation.profile')}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
                    <SettingsIcon Color={COLOR_TEXT_PRIMARY} Style={{}} />
                </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={!isLoading && { uri: user.profile.avatar }}
                        style={styles.avatarImage} />
                </View>
                <View style={styles.profileUserData}>
                    <View style={{ flexDirection: 'row' }}>
                        {user.premium && <CrownIcon Width={34} Height={34} Color={COLOR_PRIMARY} />}
                        <Text style={styles.profileUsername}>{!isLoading && user.profile.nickname}</Text>
                    </View>
                    <Text style={styles.profileDescription}>{!isLoading && user.description}</Text>
                    <View style={styles.genresContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.genresScrollView}>
                            {!isLoading && user.interests.map((genre) => (
                                <View
                                    style={styles.genreContainer}
                                    key={genre.id}>
                                    <Text style={styles.genreText}>{genre.text}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
            {/* <View style={styles.statsContainer}>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Просмотренно аниме</Text>
                    <Text style={styles.statDataText}>{isLoading && user.animestats.counterWatchedAnime}</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Просмотренно</Text>
                    <Text style={styles.statDataText}>{isLoading && user.animestats.achievementsCountWatchedAnime}</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Время проведённое за просмотром</Text>
                    <Text style={styles.statDataTimeText}>{isLoading && formattedTime(user.animestats.timeSpentWatchingAnime)}</Text>
                </View>
            </View> */}
            <Text style={styles.favoriteAnimelistText}>{i18n.t('profile.favoriteanime')}</Text>
            <FlatList
                data={user.animelist}
                nestedScrollEnabled={true}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AnimeCard
                        navigation={navigation}
                        item={item}
                        width={130}
                        height={175}
                        isLoading={!item?.id} />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 5, height: '100%', marginTop: 9 }}
                horizontal />
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{i18n.t('profile.favoritegenres')}</Text>
                {!isLoading &&
                    <BarChart
                        data={topGenres}
                        barWidth={48}
                        spacing={20}
                        maxValue={Math.max(...topGenres.map(item => item.value)) + 5}
                        noOfSections={6}
                        barBorderRadius={6}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        initialSpacing={0}
                        endSpacing={0}
                        xAxisLabelTextStyle={{
                            color: COLOR_PRIMARY,
                            fontSize: 8,
                            fontFamily: 'Outfit'
                        }}
                        topLabelTextStyle={{
                            color: COLOR_TEXT_PRIMARY,
                            fontSize: 14,
                            fontFamily: 'Outfit'
                        }}

                        hideYAxisText
                        hideRules
                        isAnimated
                        showValuesAsTopLabel
                        animationDuration={900}
                        frontColor="#20aa50dc"
                        height={250} />
                }
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: COLOR_BACKGROUND_PRIMARY,
    },
    chartContainer: {
        width: '94%',
        alignSelf: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    chartTitle: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 18,
        fontFamily: 'Outfit',
        alignSelf: 'flex-start',
        marginBottom: 8
    },
    statsContainer: {
        marginTop: 22,
        height: '15%',
        width: '98%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    statContainer: {
        width: '30%',
        height: 120,
        borderColor: COLOR_PRIMARY,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    statTitleText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 10,
        marginTop: 10,
    },
    statDataText: {
        color: COLOR_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 24,
        marginBottom: 10,
    },
    favoriteAnimelistText: {
        width: '90%',
        color: COLOR_TEXT_PRIMARY,
        marginTop: 15,
        fontSize: 18
    },
    genresContainer: {
        width: '100%',
        height: 30,
        marginTop: 8,
        marginLeft: -3,
        alignItems: 'flex-start',
    },
    genresScrollView: {
        width: '70%',
        height: 26,
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
        paddingHorizontal: 7,
    },
    genreText: {
        color: COLOR_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 8
    },
    profileDescription: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 11,
        marginLeft: 6,
        width: '62%'
    },
    profileContainer: {
        width: '90%',
        height: 100,
        flexDirection: 'row',
        marginTop: 25,
    },
    profileUserData: {
        height: '100%',
        width: '100%',
        marginLeft: 12,
    },
    profileUsername: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 18,
        marginLeft: 6,
        marginTop: 4
    },
    avatarImage: {
        width: 100,
        height: 100,
        backgroundColor: '#464648',
        borderRadius: 450,
        overflow: 'hidden'
    },
    avatarContainer: {
        alignItems: 'center',
    },
    headerContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        marginTop: 50
    },
    headerIcon: {
        width: 30,
        height: 30,
    },
    headerText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 18,
        marginLeft: 15,
    },
});

export default ProfileScreen;