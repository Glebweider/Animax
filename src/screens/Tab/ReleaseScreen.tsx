import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { useApolloClient } from '@apollo/client';

// Components
import MyAnimeListButton from '@Components/buttons/MyAnimeList';
import { BallIndicator } from '@Components/BallIndicator';
import { ReleaseAnimeCard } from '@Components/cards/ReleaseAnime';

// Data
import {
    BACKGROUND_ERROR_404_RELEASE, COLOR_PRIMARY,
    COLOR_TEXT_PRIMARY, ICON_APP
} from '@Data/constants';

// GraphQl
import { GET_ANIMEPOSTER } from '@GraphQl/getAnimePoster';

// Rest
import useGetCalendarAnime from '@Rest/anime/getCalendarAnime';

// Utils
import { i18n } from '@Utils/localization';
import { Formatter, getDateArrayForMonth } from '@Utils/functions';

// Interface
import { IDate, IReleaseAnime } from '@Interfaces/ReleaseScreen.interface';


const ReleaseScreen = ({ navigation }) => {
    const client = useApolloClient();

    const [selectedDate, setSelectedDate] = useState<IDate>({ dayOfMonth: '', dayOfWeek: '', dayOfDate: '' });
    const [Animes, setAnimes] = useState<IReleaseAnime[]>([]); // Anime of month
    const [selectedAnimes, setSelectedAnimes] = useState<IReleaseAnime[]>([]); // Anime of select day
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const dateArray = useMemo(() => getDateArrayForMonth(), []);
    const isFocused = useIsFocused();

    const { getCalendarAnime } = useGetCalendarAnime();

    useEffect(() => {
        const fetchData = async () => {
            const Animes = await getCalendarAnime();
            setAnimes(Animes);

            const today = new Date();
            setSelectedDate({
                dayOfMonth: today.getDate().toString(),
                dayOfWeek: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(today),
                dayOfDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
            });

            setIsLoading(false);
        };

        if (isFocused) {
            setIsLoading(true)
            fetchData();
        }
    }, [isFocused]);

    useEffect(() => {
        const GetAnime = async () => {
            if (selectedDate) {
                if (Animes) {
                    const animeForDate = Animes.filter((anime) => {
                        if (Number(anime.anime.score) >= 7)
                            return anime.next_episode_at.split('T')[0] == selectedDate.dayOfDate;
                    });

                    const idsNotHavePoster: string[] = [];
                    for (const item of animeForDate) {
                        const image = item.anime.image?.original;

                        if (!image || image.includes('missing'))
                            idsNotHavePoster.push(item.anime.id.toString());
                    }

                    if (idsNotHavePoster.length > 0) {
                        const newPosters = await fetchPosters(idsNotHavePoster);

                        for (const item of newPosters) {
                            const anime = animeForDate.find(anime => anime.anime.id == item.id);
                            anime.anime.image.original = item.poster.originalUrl;
                        }
                    }

                    setSelectedAnimes(animeForDate);
                }
            }
        };

        GetAnime();
    }, [selectedDate, Animes]);

    const fetchPosters = async (Ids: string[]) => {
        const { data } = await client.query({
            query: GET_ANIMEPOSTER,
            variables: {
                id: String(Ids.join(',')),
            },
        });

        return data.animes;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Image source={ICON_APP} style={styles.headerIcon} />
                    <Text style={styles.headerText}>{i18n.t('navigation.release')}</Text>
                </View>
                <FlatList
                    data={dateArray}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.dayOfMonth.toString()}
                    renderItem={({ item }) => (
                        <ReleaseAnimeCard
                            isSelected={selectedDate.dayOfMonth == item.dayOfMonth}
                            onPress={setSelectedDate}
                            item={item} />
                    )} />
            </View>
            <View style={{ width: '90%', height: '75%', justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? (
                    <BallIndicator color={COLOR_PRIMARY} size={80} count={8} />
                ) :
                    <FlatList
                        data={selectedAnimes}
                        keyExtractor={(item) => item.anime.id.toString()}
                        renderItem={({ item }) => (
                            <View style={{ marginTop: 15 }}>
                                <View style={styles.animeCardTimeContainer}>
                                    <View style={styles.animeCardTimeLine} />
                                    <Text style={styles.animeCardTimeText}>{Formatter.time(item.next_episode_at)}</Text>
                                </View>
                                <View style={styles.animeCardContainer}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('AnimeScreen', { animeId: item.anime.id })}
                                        style={styles.animeCardImage}>
                                        <Image
                                            source={{
                                                uri: item.anime.image.original.includes('https://') ?
                                                    item.anime.image.original :
                                                    `${process.env.EXPO_PUBLIC_SHIKIMORI_API_URL}${item.anime.image.original}`
                                            }}
                                            style={styles.animeCardImage} />
                                    </TouchableOpacity>
                                    <View style={styles.animeCardData}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.animeCardTitle}>
                                            {item.anime.russian ? item.anime.russian : item.anime.name}
                                        </Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.animeCardEpisode}>
                                            {i18n.t('release.episodes')} {item.next_episode}/{item.anime.episodes ? item.anime.episodes : '?'}
                                        </Text>
                                        <View style={{ marginTop: 10 }}>
                                            <MyAnimeListButton animeId={item.anime.id} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                                <Image style={{ marginTop: 80 }} source={BACKGROUND_ERROR_404_RELEASE} />
                                <View style={styles.errorTextContainer}>
                                    <Text style={styles.errorTitle}>{i18n.t('release.norelease')}</Text>
                                    <Text style={styles.errorText}>{i18n.t('release.noreleasetext')}</Text>
                                </View>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.animesContainer} />
                }
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
    animeCardTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    animeCardTimeLine: {
        backgroundColor: COLOR_PRIMARY,
        width: 16,
        height: 6,
        marginTop: 2,
        borderRadius: 50,
    },
    animeCardTimeText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 14,
        textAlign: 'center',
        marginLeft: 6,
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
        fontSize: 14,
        marginTop: 20,
        textAlign: 'center'
    },
    animeCardData: {
        flexDirection: 'column',
        marginLeft: 15,
        width: '55%'
    },
    animeCardTitle: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginTop: 5,
    },
    animeCardEpisode: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 11,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginTop: 12,
    },
    animesContainer: {
        width: '100%',
        flexGrow: 1,
        paddingBottom: 85,
    },
    animeCardContainer: {
        width: '100%',
        height: 115,
        marginTop: 9,
        flexDirection: 'row'
    },
    animeCardImage: {
        width: 145,
        height: 115,
        borderRadius: 15
    },
    headerContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    header: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
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

export default ReleaseScreen;