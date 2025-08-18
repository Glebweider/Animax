import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { useApolloClient } from '@apollo/client';
import MyAnimeListButton from '@Components/buttons/MyAnimeList';
import BackButton from '@Components/buttons/Back';
import { i18n } from '@Utils/localization';
import { GET_RECOMENDATIONANIME } from '@Utils/api/graphql/getRecomendationAnime';
import { useSelector } from 'react-redux';
import { RootState } from '@Redux/store';
import { useAlert } from '@Components/AlertContext';

const RecomendationsAnimeScreen = ({ navigation }: any) => {
    const client = useApolloClient();
    const [animes, setAnimes] = useState([]);
    const [page, setPage] = useState(1);
    const [genreId, setGenreId] = useState<number>(null);
    const userInterests = useSelector((state: RootState) => state.userReducer.interests);
    const { showAlert } = useAlert();

    useEffect(() => {
        if (!genreId && userInterests.length > 0) {
            const randomGenreId = userInterests[Math.floor(Math.random() * userInterests.length)].id;
            setGenreId(randomGenreId);
        }
    }, [genreId, userInterests]);

    useEffect(() => {
        if (genreId) {
            client.query({
                query: GET_RECOMENDATIONANIME,
                variables: {
                    page,
                    limit: 50,
                    order: 'ranked',
                    genre: genreId
                },
            }).then(({ data }) => {
                if (data) {
                    setAnimes(prevAnimes => [...prevAnimes, ...data.animes]);
                }
            }).catch(error => {
                showAlert(error);
            });
        }
    }, [page, genreId]);

    const handleEndReached = async () => {
        setPage(prevPage => prevPage + 1);
        const newGenreId = userInterests[Math.floor(Math.random() * userInterests.length)].id;
        setGenreId(newGenreId);
    };

    const AnimeCard = React.memo(({ item }: any) => {
        return (
            <View key={item.id} style={styles.animeCardContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AnimeScreen', { animeId: item.id })}
                    style={styles.animeCardImageContainer}>
                    <Image
                        source={{ uri: item.poster.originalUrl }}
                        style={styles.animeCardImage} />
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
                    </View>
                    {(item.rating === 'r_plus' || item.rating === 'rx') && (
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>18+</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.animeCardData}>
                    <View>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.animeCardTitle}>
                            {item.russian ? item.russian : item.name}
                        </Text>
                        <Text style={styles.animeCardYear}>
                            {item.airedOn.year ? item.airedOn.year : '????'}
                        </Text>
                        <Text
                            numberOfLines={3}
                            ellipsizeMode="tail"
                            style={styles.animeCardGenre}>
                            {i18n.t('genre')}: {item.genres.map(genre => genre.russian).join(', ')}
                        </Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <MyAnimeListButton anime={item} />
                    </View>
                </View>
            </View>)
    });

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('home.yourecomendationanimes')} />
            <View style={{ width: '90%', height: '87%', alignItems: 'center' }}>
                {animes.length >= 1 && (
                    <FlatList
                        data={animes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <AnimeCard item={item} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.containerAnimes}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.1} />
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
    containerAnimes: {
        width: '100%',
        flexGrow: 1,
        paddingBottom: 10,
    },
    animeCardContainer: {
        width: '100%',
        height: 200,
        marginTop: 15,
        flexDirection: 'row',
    },
    animeCardImageContainer: {
        width: 150,
        height: 200,
        flexDirection: 'row'
    },
    animeCardImage: {
        width: 150,
        height: 200,
        borderRadius: 15,
        position: 'absolute',
        backgroundColor: '#1F222A'
    },
    animeCardData: {
        flexDirection: 'column',
        marginLeft: 15,
        width: '54%',
        justifyContent: 'space-between'
    },
    animeCardGenre: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
        marginTop: 10,
    },
    animeCardYear: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
        marginTop: 10,
    },
    animeCardTitle: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginTop: 10,
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
    scoreText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
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
});

export default RecomendationsAnimeScreen;