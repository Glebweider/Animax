import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, FlatList } from 'react-native';
import { getTokenFromStorage } from '@Utils/functions/token';
import { BallIndicator } from 'react-native-indicators';
import { i18n } from '@Utils/localization';
import useGetAnimeListUser from '@Rest/anime/getAnimeListUser';
import { StatusBar } from 'expo-status-bar';
import { useApolloClient } from '@apollo/client';
import { GET_ANIMES } from '@GraphQl/getAnimes';
import AnimeCard from '@Components/cards/Anime';

const MyListScreen = ({ navigation }) => {
    const client = useApolloClient();
    const [userAnimeListId, setUserAnimeListId] = useState<string[]>([]);
    const [userAnimeList, setUserAnimeList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const limit = 40;
    const { getAnimeListUser } = useGetAnimeListUser();
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const fetchAnimes = useCallback(
        async (ids: string[], pageToFetch: number) => {
            const paginatedIds = ids.slice((pageToFetch - 1) * limit, pageToFetch * limit);
            if (paginatedIds.length === 0) return;

            const { data } = await client.query({
                query: GET_ANIMES,
                variables: {
                    ids: paginatedIds.join(","),
                    limit,
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
        const token = await getTokenFromStorage();
        if (token) {
            const ids = await getAnimeListUser(token);
            setUserAnimeListId(ids);
            setPage(1);
            setUserAnimeList([]);

            await fetchAnimes(ids, 1);
        }
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
                    <Image source={require('../../../assets/icon.png')} style={styles.headerIcon} />
                    <Text style={styles.headerText}>{i18n.t('navigation.mylist')}</Text>
                </View>
            </View>
            <View style={{ width: '100%', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? (
                    <BallIndicator color='#06C149' size={80} animationDuration={700} />
                ) : (
                    userAnimeListId?.length >= 1 ?
                        <FlatList
                            data={userAnimeList}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) =>
                                <AnimeCard
                                    navigation={navigation}
                                    item={item}
                                    isLoading={userAnimeList.length < 1}
                                    width={172}
                                    height={232} />
                            }
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.containerAnimeTop}
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.2}
                            numColumns={2} />
                        :
                        <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                            <Image style={{ marginTop: 80 }} source={require('../../../assets/error404MyList.png')} />
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
        backgroundColor: '#181A20',
    },
    errorTextContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTitle: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 20,
        marginTop: 20
    },
    errorText: {
        color: '#fff',
        fontFamily: 'Outfit',
        width: '90%',
        fontSize: 14,
        marginTop: 20,
        textAlign: 'center'
    },
    containerAnimeTop: {
        width: '100%',
        flexGrow: 1,
        paddingBottom: 200,
        gap: 12
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
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
        marginLeft: 15,
    },
});

export default MyListScreen;