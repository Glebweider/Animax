import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApolloClient } from '@apollo/client';

// Components
import { BallIndicator } from '@Components/BallIndicator';
import { AnimeCard, AnimeCardSkeleton } from '@Components/cards/Anime';

// Data
import {
    BACKGROUND_ERROR_404_MYLIST, COLOR_PRIMARY,
    COLOR_TEXT_PRIMARY, ICON_APP, MYLIST_CHUNK_SIZE
} from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';

// Interface
import { AnimeItem } from '@Interfaces/AnimeCard.interface';

// Rest
import useGetAnimeListUser from '@Rest/anime/getAnimeListUser';

// GraphQl
import { GET_ANIMES } from '@GraphQl/getAnimes';


const MyListScreen = ({ navigation }) => {
    const client = useApolloClient();
    const [userAnimeListId, setUserAnimeListId] = useState<string[]>([]);
    const [userAnimeList, setUserAnimeList] = useState<AnimeItem[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);

    const { getAnimeListUser } = useGetAnimeListUser();


    const fetchAnimes = useCallback(
        async (ids: string[], pageToFetch: number) => {
            const paginatedIds = ids.slice((pageToFetch - 1) * MYLIST_CHUNK_SIZE, pageToFetch * MYLIST_CHUNK_SIZE);
            if (paginatedIds.length === 0) return;

            const { data } = await client.query({
                query: GET_ANIMES,
                variables: {
                    ids: paginatedIds.join(","),
                    limit: Number(MYLIST_CHUNK_SIZE),
                    page
                },
            });

            if (data?.animes?.length) {
                setUserAnimeList(prev =>
                    pageToFetch === 1 ? data.animes : [...prev, ...data.animes]
                );
            }
        },
        [client]
    );

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        const ids = await getAnimeListUser();

        setUserAnimeListId(ids);
        setPage(1);
        setUserAnimeList([]);

        await fetchAnimes(ids, 1);
        setIsLoading(false);
    }, [fetchAnimes]);

    const handleEndReached = async () => {
        if (isFetchingMore) return;
        if (userAnimeList.length >= userAnimeListId.length) return;

        setIsFetchingMore(true);
        const newPage = page + 1;
        setPage(newPage);
        await fetchAnimes(userAnimeListId, newPage);
        setIsFetchingMore(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image source={ICON_APP} style={styles.headerIcon} />
                    <Text style={styles.headerText}>{i18n.t('navigation.mylist')}</Text>
                </View>
            </View>
            <View style={{ width: '100%', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? (
                    <BallIndicator color={COLOR_PRIMARY} size={80} count={8} />
                ) : (
                    userAnimeListId?.length >= 1 ?
                        <FlatList
                            data={userAnimeList}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) =>
                                <AnimeCard
                                    navigation={navigation}
                                    item={item}
                                    width={172}
                                    height={232} />
                            }
                            ListEmptyComponent={() =>
                                <View style={styles.skeletonGrid}>
                                    {Array.from({ length: MYLIST_CHUNK_SIZE }).map((_, i) => (
                                        <AnimeCardSkeleton
                                            key={i}
                                            width={172}
                                            height={232} />
                                    ))}
                                </View>
                            }
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.containerAnimeTop}
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.2}
                            numColumns={2} />
                        :
                        <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                            <Image style={{ marginTop: 80 }} source={BACKGROUND_ERROR_404_MYLIST} />
                            <View style={styles.errorTextContainer}>
                                <Text style={styles.errorTitle}>{i18n.t('mylist.listempty')}</Text>
                                <Text style={styles.errorText}>{i18n.t('mylist.emptytext')}</Text>
                            </View>
                        </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    skeletonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        rowGap: 14
    },
    errorTextContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTitle: {
        color: COLOR_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 20,
        marginTop: 20
    },
    errorText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        width: '90%',
        fontSize: 14,
        marginTop: 20,
        textAlign: 'center'
    },
    containerAnimeTop: {
        flexGrow: 1,
        paddingBottom: 200,
        gap: 14,
    },
    header: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        marginTop: 50
    },
    headerLeft: {
        flexDirection: 'row',
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

export default MyListScreen;