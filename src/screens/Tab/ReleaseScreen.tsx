/* eslint-disable react/display-name */
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

// Components
import MyAnimeListButton from '@Components/buttons/MyAnimeList';
import { BallIndicator } from '@Components/BallIndicator';
import { ReleaseAnimeCard } from '@Components/cards/ReleaseAnime';

// Data
import { COLOR_BACKGROUND_PRIMARY, COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';

// Rest
import useGetCalendarAnime from '@Rest/anime/getCalendarAnime';

// Utils
import { i18n } from '@Utils/localization';
import { getDateArrayForMonth } from '@Utils/functions';

// Interface
import { IDate } from '@Interfaces/ReleaseScreen.interface';


const ReleaseScreen = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState<IDate>({ dayOfMonth: '', dayOfWeek: '', dayOfDate: '' });
    const [Animes, setAnimes] = useState<any[]>([]);
    const [selectedAnimes, setSelectedAnimes] = useState<any[]>([]);
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
                dayOfDate: new Date(today.getTime()).toISOString().split('T')[0]
            });
            setIsLoading(false);
        };

        if (isFocused) {
            setIsLoading(true)
            fetchData();
        }
    }, [isFocused]);

    useEffect(() => {
        if (selectedDate) {
            if (Animes) {
                const animeForDate = Animes.filter((anime) => {
                    if (anime.anime.score >= 7)
                        return anime.next_episode_at.split('T')[0] == selectedDate.dayOfDate;
                });

                setSelectedAnimes(animeForDate);
            }
        }
    }, [selectedDate, Animes]);

    const animeCardTime = (data: string) => {
        const date = new Date(data);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

        const formattedTime = `${formattedHours}:${formattedMinutes}`;
        return formattedTime
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Image source={require('../../../assets/icon.png')} style={styles.headerIcon} />
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
                ) : (
                    selectedAnimes.length >= 1 ?
                        <FlatList
                            data={selectedAnimes}
                            keyExtractor={(item) => item.anime.id.toString()}
                            renderItem={({ item }) => (
                                <View style={{ marginTop: 15 }}>
                                    <View style={styles.animeCardTimeContainer}>
                                        <View style={styles.animeCardTimeLine} />
                                        <Text style={styles.animeCardTimeText}>{animeCardTime(item.next_episode_at)}</Text>
                                    </View>
                                    <View key={item.anime.id} style={styles.animeCardContainer}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('AnimeScreen', { animeId: item.anime.id })}
                                            style={styles.animeCardImage}>
                                            <Image
                                                source={{ uri: `${process.env.EXPO_PUBLIC_SHIKIMORI_API_URL}${item.anime.image.original}` }}
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
                                                <MyAnimeListButton anime={item.anime} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.animesContainer} />
                        :
                        <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                            <Image style={{ marginTop: 80 }} source={require('../../../assets/error404Anime.png')} />
                            <View style={styles.errorTextContainer}>
                                <Text style={styles.errorTitle}>{i18n.t('release.norelease')}</Text>
                                <Text style={styles.errorText}>{i18n.t('release.noreleasetext')}</Text>
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
        backgroundColor: COLOR_BACKGROUND_PRIMARY,
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