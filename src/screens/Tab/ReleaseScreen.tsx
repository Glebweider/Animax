/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import getCalendarAnime from '@Utils/fetch/getCalendarAnime';
import MyAnimeListButton from '@Components/MyAnimeListButton';
import { BallIndicator } from 'react-native-indicators';
import { i18n } from '@Utils/localization';

interface IDate {
    dayOfMonth: string;
    dayOfWeek: string;
    dayOfDate: string;
}

const getDateArrayForMonth = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
    const dateArray = [];
    let currentDate = new Date(firstDayOfMonth);
  
    while (currentDate <= lastDayOfMonth) {
        dateArray.push({
            dayOfWeek: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(currentDate),
            dayOfMonth: currentDate.getDate(),
            dayOfDate: new Date(currentDate.getTime() + 86400000).toISOString().split('T')[0]
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dateArray;
};

const ReleaseScreen = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState<IDate>({
        dayOfMonth: '',
        dayOfWeek: '',
        dayOfDate: ''
    });
    const [Animes, setAnimes] = useState([]);
    const [selectedAnimes, setSelectedAnimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const dateArray = useMemo(() => getDateArrayForMonth(), []);

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
    
        fetchData();
    }, []);
    
    const animeCardTime = (data: string) => {
        const date = new Date(data);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

        const formattedTime = `${formattedHours}:${formattedMinutes}`;
        return formattedTime
    }

    useEffect(() => {
        if(selectedDate) {
            if (Animes) {
                const animeForDate = Animes.filter((anime) => {
                    if (anime.anime.score >= 7) {                
                        return anime.next_episode_at.split('T')[0] == selectedDate.dayOfDate;
                    } 
                });

                setSelectedAnimes(animeForDate);
            }
        }
    }, [selectedDate, Animes]);

    const MemoizedDateItem = React.memo(({ isSelected, onPress, item }: any) => {
        const handlePress = useCallback(() => onPress(item), [item, onPress]);
      
        return (
            <TouchableOpacity
                style={isSelected ? styles.dataContainerEnabled : styles.dataContainerDisabled}
                onPress={handlePress}>
                <Text style={isSelected ? styles.dataTextWeekEnabled : styles.dataTextWeekDisabled}>
                    {item.dayOfWeek && i18n.t(`release.${item.dayOfWeek}`)}
                </Text>
                <Text style={isSelected ? styles.dataTextMonthEnabled : styles.dataTextMonthDisabled}>
                    {item.dayOfMonth}
                </Text>
            </TouchableOpacity>
        );
    }, (prevProps, nextProps) => {
        return prevProps.isSelected === nextProps.isSelected;
    });

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
                        <MemoizedDateItem isSelected={selectedDate.dayOfMonth == item.dayOfMonth} onPress={setSelectedDate} item={item} />
                    )}/>
            </View>
            <View style={{width: '90%', height: '75%', justifyContent: 'center', alignItems: 'center'}}>
            {isLoading ? (
                <BallIndicator color='#06C149' size={80} animationDuration={700} />
            ) : (
                selectedAnimes.length >= 1 ? 
                <FlatList
                    data={selectedAnimes}
                    keyExtractor={(item) => item.anime.id.toString()}
                    renderItem={({ item }) => (
                        <View style={{marginTop: 15}}>
                            <View style={styles.animeCardTimeContainer}>
                                <View style={styles.animeCardTimeLine} /> 
                                <Text style={styles.animeCardTimeText}>{animeCardTime(item.next_episode_at)}</Text>                                
                            </View>
                            <View key={item.anime.id} style={styles.animeCardContainer}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AnimeScreen', { animeId: item.anime.id })}
                                    style={styles.animeCardImage}>
                                    <Image
                                        source={{ uri: `https://shikimori.me${item.anime.image.original}` }}
                                        style={styles.animeCardImage}/>
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
                    contentContainerStyle={styles.animesContainer}/>
                    :
                    <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
                        <Image style={{marginTop: 80}} source={require('../../../assets/error404Anime.png')} />
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
        backgroundColor: '#181A20',
    },
    animeCardTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    animeCardTimeLine: {
        backgroundColor: '#06C149',
        width: 16,
        height: 6,
        marginTop: 2,
        borderRadius: 50,
    },
    animeCardTimeText: {
        color: '#fff',
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
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 20,
        marginTop: 20
    },
    errorText: {
        color: '#fff',
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
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
        marginTop: 5,
    },
    animeCardEpisode: {
        color: '#fff',
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
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
        marginLeft: 15,
    },
    contentDate: {
        width: '100%',
        height: 95,
    },
    dataContainerEnabled: {
        margin: 7.5,
        width: 50,
        height: 78,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#06C149',
        backgroundColor: '#06C149',
        borderRadius: 50,
    },
    dataContainerDisabled: {
        margin: 7.5,
        width: 50,
        height: 78,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#616161',
        borderRadius: 50,
    },
    dataTextWeekEnabled: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12,
    },
    dataTextMonthEnabled: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 15,
    },
    dataTextWeekDisabled: {
        color: '#616161',
        fontFamily: 'Outfit',
        fontSize: 12,
    },
    dataTextMonthDisabled: {
        color: '#616161',
        fontFamily: 'Outfit',
        fontSize: 15,
    },
});
    
export default ReleaseScreen;