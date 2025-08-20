import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useApolloClient, useQuery } from '@apollo/client';
import { GET_TOPHITSANIME } from '@Utils/api/graphql/getTopHitsAnimes';
import BackButton from '@Components/buttons/Back';
import { i18n } from '@Utils/localization';
import { useAlert } from '@Components/alert/AlertContext';
import RecomendationAnimeCard from '@Components/cards/RecomendationAnime';


const TopHitsAnimeScreen = ({ navigation }: any) => {
    const client = useApolloClient();
    const [animes, setAnimes] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const { showAlert } = useAlert();

    const { data } = useQuery(GET_TOPHITSANIME, {
        variables: { page: 1, limit: 50, order: 'ranked' },
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
                    variables: { page, limit: 50, order: 'ranked' },
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
        backgroundColor: '#181A20',
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