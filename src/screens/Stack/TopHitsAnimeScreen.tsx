import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { useApolloClient, useQuery } from '@apollo/client';
import ArrowLeftIcon from '../../components/icons/ArrowLeftIcon';
import { GET_ANIMES } from '../../utils/graphql/getTopHitsAnimes';
import MyAnimeListButton from '../../components/MyAnimeListButton';

const TopHitsAnimeScreen = ({ navigation }) => {
    const client = useApolloClient();
    const [animes, setAnimes] = useState([]);
    const [page, setPage] = useState(1);

    const { data } = useQuery(GET_ANIMES, {
        variables: { 
            page: 1,
            limit: 50,
            order: 'ranked',
        },
    });   
    
    useEffect(() => {
        if (data) {
            setAnimes(data.animes);
        }
    }, [data]);
    
    const handleEndReached = async () => {
        let newPage = page + 1;
        setPage(newPage);

        const { data } = await client.query({
            query: GET_ANIMES,
            variables: { 
                page: newPage,
                limit: 50,
                order: 'ranked',
            },
        });   
        if (data) {
            setAnimes(prevAnimes => [...prevAnimes, ...data.animes]);     
        };
    };

    const AnimeCard = React.memo(({ item }: any) => {
        return (
            <View key={item.id} style={styles.animeCardContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AnimeScreen', { animeId: item.id })}
                    style={styles.animeCardImageContainer}>
                    <Image
                        source={{ uri: item.poster.originalUrl }}
                        style={styles.animeCardImage}/>
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
                            Genre: {item.genres.map(genre => genre.russian).join(', ')}
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
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon Style={styles.headerButtonBack} Color={'#fff'} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Top Hits Anime</Text>                    
                </View>
            </View>
            <View style={{width: '90%', height: '87%', alignItems: 'center'}}>
                {animes.length >= 1 && (
                    <FlatList
                        data={animes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <AnimeCard item={item} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.containerAnimes}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.1}/>
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
    headerButtonBack: {
        width: 28,
        height: 28,
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
        alignItems: 'center'
    },
    headerText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
        marginLeft: 15,
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
    
export default TopHitsAnimeScreen;