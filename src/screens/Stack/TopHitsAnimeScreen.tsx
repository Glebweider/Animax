import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useApolloClient, useQuery } from '@apollo/client';

// Components
import BackButton from '@Components/buttons/Back';
import { useAlert } from '@Components/alert/AlertContext';
import RecomendationAnimeCard from '@Components/cards/RecomendationAnime';

// GraphQl
import { GET_TOPHITSANIME } from '@GraphQl/getTopHitsAnimes';

// Utils
import { i18n } from '@Utils/localization';

// Data
import { TOPHITS_CHUNK_SIZE } from '@Data/constants';


const TopHitsAnimeScreen = ({ navigation }: any) => {
    const client = useApolloClient();
    const { showAlert } = useAlert();
    
    const [animes, setAnimes] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    

    const { data } = useQuery(GET_TOPHITSANIME, {
        variables: { page: 1, limit: TOPHITS_CHUNK_SIZE, order: 'ranked' },
    });

    useEffect(() => {
        if (data)
            setAnimes(data.animes);
    }, [data]);

    useEffect(() => {
        if (page === 1) return;
        (async () => {
            try {
                const { data } = await client.query({
                    query: GET_TOPHITSANIME,
                    variables: { page, limit: TOPHITS_CHUNK_SIZE, order: 'ranked' },
                });

                if (data)
                    setAnimes(prev => [...prev, ...data.animes]);
            } catch (e) {
                showAlert(e);
            }
        })();
    }, [page]);

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('home.tophitsanime')} />
            <View style={styles.wrapper}>
                {animes.length > 0 && (
                    <FlatList
                        data={animes}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <RecomendationAnimeCard item={item} navigation={navigation} />
                        )}
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

export default TopHitsAnimeScreen;