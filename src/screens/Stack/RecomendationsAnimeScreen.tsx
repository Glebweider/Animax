import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useApolloClient, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';

// Components
import BackButton from '@Components/buttons/Back';
import { useAlert } from '@Components/alert/AlertContext';
import RecomendationAnimeCard from '@Components/cards/RecomendationAnime';

// Utils
import { i18n } from '@Utils/localization';

// GraphQl
import { GET_RECOMENDATIONANIME } from '@GraphQl/getRecomendationAnime';

// Redux
import { RootState } from '@Redux/store';

// Data
import { RECOMENDATION_CHUNK_SIZE } from '@Data/constants';

// Interface
import { ITopHitsAnime } from '@Interfaces/TopHitsScreen.interface';


const RecomendationsAnimeScreen = ({ navigation }: any) => {
    const client = useApolloClient();
    const { showAlert } = useAlert();

    const [animes, setAnimes] = useState<ITopHitsAnime[]>([]);

    const [page, setPage] = useState<number>(1);
    const [genreId, setGenreId] = useState<string>(null);

    const userInterests = useSelector((state: RootState) => state.userReducer.interests);

    useEffect(() => {
        if (!genreId && userInterests.length > 0) {
            const randomGenreId = userInterests[Math.floor(Math.random() * userInterests.length)];
            setGenreId(randomGenreId);
        }
    }, [genreId, userInterests]);

    const { data } = useQuery(GET_RECOMENDATIONANIME, {
        skip: !genreId,
        variables: { page: 1, limit: RECOMENDATION_CHUNK_SIZE, order: 'ranked', genre: genreId },
    });

    useEffect(() => {
        if (data)
            setAnimes(data.animes);
    }, [data]);

    useEffect(() => {
        if (page === 1 || !genreId) return;

        (async () => {
            try {
                const { data } = await client.query({
                    query: GET_RECOMENDATIONANIME,
                    variables: { page, limit: RECOMENDATION_CHUNK_SIZE, order: 'ranked', genre: genreId },
                });
                if (data)
                    setAnimes(prev => [...prev, ...data.animes]);
            } catch (e) {
                showAlert(e);
            }
        })();
    }, [page, genreId]);


    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('home.yourecomendationanimes')} />
            <View style={styles.wrapper}>
                {animes.length >= 1 && (
                    <FlatList
                        data={animes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) =>
                            <RecomendationAnimeCard
                                item={item}
                                navigation={navigation} />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.containerAnimes}
                        onEndReached={() => setPage(p => p + 1)}
                        onEndReachedThreshold={0.1} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    wrapper: {
        width: '90%',
        height: '87%',
        alignItems: 'center',
    },
    containerAnimes: {
        flexGrow: 1,
        width: '100%',
        paddingBottom: 10,
    },
});

export default RecomendationsAnimeScreen;