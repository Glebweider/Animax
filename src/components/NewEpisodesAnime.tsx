/* eslint-disable react/display-name */
import React, { FC, memo } from 'react';
import { FlatList, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Anime } from '@Interfaces/animeHomeScreen.interface';

interface NewEpisodeAnimeProps {
    data: Anime[];
    onSelect: (anime: Anime) => void;
}

interface NewEpisodeAnimeItemProps {
    anime: Anime;
    onPress: (anime: Anime) => void;
}

const NewEpisodeAnimeItem: FC<NewEpisodeAnimeItemProps> = memo(({ anime, onPress }) => (
    <TouchableOpacity 
        onPress={() => onPress(anime)}
        style={styles.animeContainerAnimeTop}>
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{anime.score.toFixed(1)}</Text>
            </View>
            {(anime.rating === 'r_plus' || anime.rating === 'rx') && (
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>18+</Text>
                </View>
            )}
            <Image
                source={{ uri: anime.poster.mainUrl }}
                style={styles.animeImageAnimeTop}/>
    </TouchableOpacity>
));


const NewEpisodesAnime: FC<NewEpisodeAnimeProps> = ({ data, onSelect }) => (
    <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <NewEpisodeAnimeItem anime={item} onPress={onSelect} />
        )}
        ListEmptyComponent={() => (
            <View style={{ alignItems: 'center' }}>
                <Text style={{ marginTop: 20 }}>No data available</Text>
            </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 10 }}/>
);

const styles = StyleSheet.create({
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
    containerAnimeTop: {
        width: '100%',
        marginTop: 20,
        paddingLeft: 20,
        flexGrow: 1,
    },
    animeContainerAnimeTop: {
        margin: 7,
        marginTop: 10,
        width: 150,
        height: 200,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: '#1F222A'
    },
    animeImageAnimeTop: {
        width: 150,
        height: 200,
        zIndex: 1,
        borderRadius: 10,
        position: 'absolute',
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

export default NewEpisodesAnime;