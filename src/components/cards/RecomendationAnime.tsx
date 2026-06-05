import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Components
import { AnimeCard } from './Anime';
import MyAnimeListButton from '@Components/buttons/MyAnimeList';

// Data
import { COLOR_TEXT_PRIMARY } from '@Data/constants';

// Utils
import { formatAnimeTitle, i18n, isCisLocale } from '@Utils/localization';

// Interface
import { ITopHitsAnime } from '@Interfaces/TopHitsScreen.interface';


const RecomendationAnimeCard: React.FC<{ navigation: any; item: ITopHitsAnime; }> = ({ navigation, item }) => {
    return (
        <View key={item.id} style={styles.container}>
            <AnimeCard
                style={{ marginHorizontal: 0 }}
                navigation={navigation}
                item={item}
                width={150}
                height={200} />

            <View style={styles.content}>
                <View>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
                        {formatAnimeTitle(item)}
                    </Text>
                    <Text style={styles.year}>
                        {item.airedOn.year ? item.airedOn.year : '????'} | {i18n.t(item.status)}
                    </Text>
                    <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={styles.genres}>
                        {i18n.t('genre')}: {item.genres.map(genre =>
                            isCisLocale ? genre.russian : genre.name
                        ).join(', ')}
                    </Text>
                </View>
                <View style={{ marginTop: 10, width: 115 }}>
                    <MyAnimeListButton animeId={item.id} />
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
        color: COLOR_TEXT_PRIMARY,
        fontSize: 11,
        fontFamily: 'Outfit',
        marginTop: 10,
        width: 170,
    },
    year: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 11,
        fontFamily: 'Outfit',
        marginTop: 10,
    },
    title: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 14,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginTop: 10,
        width: 170,
    },
});

export default RecomendationAnimeCard;