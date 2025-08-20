import MyAnimeListButton from '@Components/buttons/MyAnimeList';
import { i18n } from '@Utils/localization';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimeCard from './Anime';


interface Props {
    navigation: any;
    item: any;
}

const RecomendationAnimeCard: React.FC<Props> = ({ navigation, item }) => {
    return (
        <View key={item.id} style={styles.container}>
            <AnimeCard
                navigation={navigation}
                item={item}
                isLoading={false}
                width={150}
                height={200} />

            <View style={styles.content}>
                <View>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
                        {item.russian ? item.russian : item.name}
                    </Text>
                    <Text style={styles.year}>
                        {item.airedOn.year ? item.airedOn.year : '????'}
                    </Text>
                    <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={styles.genres}>
                        {i18n.t('genre')}: {item.genres.map(genre => genre.russian).join(', ')}
                    </Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <MyAnimeListButton anime={item} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
        marginTop: 15,
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'column',
        marginLeft: 15,
        width: '54%',
        justifyContent: 'space-between'
    },
    genres: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
        marginTop: 10,
    },
    year: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
        marginTop: 10,
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginTop: 10,
    },
});

export default RecomendationAnimeCard;