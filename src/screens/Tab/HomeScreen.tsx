import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from "expo-status-bar";
import SearchIcon from '../../components/icons/SearchIcon';
import { useQuery } from '@apollo/client';
import { GET_ANIMES } from '../../utils/graphql/getTopHitsAnimes';
import { LinearGradient } from 'expo-linear-gradient';
import PlayIcon from '../../components/icons/PlayIcon';
import MyAnimeListButton from '../../components/MyAnimeListButton';
import TopHitsAnime from '../../components/TopHitsAnime';
import NewEpisodesAnime from '../../components/NewEpisodesAnime';
import { GET_NEWEPISODESANIME } from '../../utils/graphql/getNewEpisodesAnime';

const HomeScreen = ({ navigation }) => {
    const [selectAnime, setSelectAnime] = useState<Anime>({
        poster: {
            originalUrl: '',
            mainUrl: '',
        },
        russian: '',
        score: 0,
        id: 0,
        rating: '',
        genres: [
            {
                russian: ''
            },
        ],
    });
    const [topHitsAnime, setTopHitsAnime] = useState<Anime[]>([]);
    const [newEpisodesAnime, setNewEpisodesAnime] = useState<Anime[]>([]);

    const { data: topHitsData } = useQuery(GET_ANIMES, {
        variables: { 
            page: 1,
            limit: 6,
            order: 'ranked',
            season: String(new Date().getFullYear())
        },
    });   
    
    useEffect(() => {
        if (topHitsData) {
          setTopHitsAnime(topHitsData.animes);
            if (selectAnime) {
                setSelectAnime(topHitsData.animes[0]);
            }
        }
    }, [topHitsData]);
    
    const { data: newEpisodesData } = useQuery(GET_NEWEPISODESANIME, {
        variables: { 
            limit: 6,
            order: 'ranked'
        },
    });   
    
    useEffect(() => {
        if (newEpisodesData) {
            setNewEpisodesAnime(newEpisodesData.animes);
        }
    }, [newEpisodesData]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <StatusBar style='light' />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image source={require('../../../assets/icon.png')} style={styles.headerLogo} />
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('AnimeSearchScreen')}
                        style={styles.headerIconSearch}>
                        <SearchIcon Color={'#fff'} Style={styles.headerIconSearch} />                            
                    </TouchableOpacity>
                </View>               
                <View style={styles.selectAnimeContainer}>
                    <LinearGradient
                        colors={['rgba(24, 26, 32, 0)', 'rgba(24, 26, 32, 100)']}
                        start={{ x: 1, y: 0,}}
                        end={{ x: 0.1, y: 1 }}
                        style={styles.backgroundShadow}>
                    </LinearGradient>
                    {selectAnime.poster.originalUrl !== '' ?
                        <Image source={{
                            uri: selectAnime.poster.originalUrl}} 
                            style={styles.selectAnimeImage} />
                        :
                        <Text>Загрузка</Text>
                    }
                    <View style={styles.animeDataContainer}>
                        <View style={styles.animeContent}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.animeName}>{selectAnime.russian}</Text>
                            <View style={styles.tagsContainer}>
                                {selectAnime.genres ?
                                    selectAnime.genres.map((tag) => (
                                        <Text 
                                            key={tag.russian} 
                                            numberOfLines={1} 
                                            ellipsizeMode="tail" 
                                            style={styles.animeDescription}>{tag.russian}, </Text>
                                    ))
                                    :
                                    <Text style={styles.animeDescription}>Загрузка</Text>
                                }
                            </View>
                            <View style={styles.animeButtonsContainer}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AnimeScreen', {animeId: selectAnime.id})} 
                                    style={styles.animeButtonPlay}>
                                    <PlayIcon Color={'#fff'} Style={{marginRight: 7}} Width={16} Height={16} />
                                    <Text style={styles.animeButtonTextPlay}>Play</Text>
                                </TouchableOpacity>
                                <View style={{marginLeft: 10}}>
                                    <MyAnimeListButton anime={selectAnime} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>                    
                <View style={styles.topAnimeContainer}>
                    <View style={styles.hitsAnimeTextContainer}>
                        <Text style={styles.hitsAnimeText}>Top Hits Anime</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('TopHitsAnimeScreen')}>
                            <Text style={styles.hitsAnimeTextSeeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <TopHitsAnime data={topHitsAnime} onSelect={setSelectAnime} />              
                </View>
                <View style={styles.topAnimeContainer}>
                    <View style={styles.newEpisodeAnimeTextContainer}>
                        <Text style={styles.newEpisodeAnimeText}>New Episode Releases</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('see all')}>
                            <Text style={styles.newEpisodeAnimeTextSeeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <NewEpisodesAnime data={newEpisodesAnime} onSelect={setSelectAnime} />                   
                </View>
            </View>            
        </ScrollView>
    );
};

const styles = StyleSheet.create({ 
    scrollContainer: {
        flexGrow: 1,
        height: '110%'
    },
    animeDataContainer: {
        position: 'absolute',
        zIndex: 3,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    tagsContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    animeContent: {
        width: '80%',
        height: '25%',
        margin: 18,
    },
    animeName: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Outfit',
        overflow: 'hidden',
    },
    animeDescription: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit',
        overflow: 'hidden',
    },
    animeButtonsContainer: {
        flexDirection: 'row',
        marginTop: 12,
    },
    animeButtonPlay: {
        backgroundColor: '#06C149',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: 86,
        height: 36,
        flexDirection: 'row',
    },
    animeButtonTextPlay: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
    },
    animeButtonMyList: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: 105,
        height: 36,
        borderColor: '#fff',
        borderWidth: 2,
        flexDirection: 'row',
        marginLeft: 10
    },
    animeButtonTextMyList: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Outfit',
        overflow: 'hidden',
    },
    topAnimeContainer: {
        width: '100%', 
        height: 280, 
        alignItems: 'center'
    },
    selectContainer: {
        width: '100%', 
        height: '48%', 
        alignItems: 'center'
    },
    backgroundShadow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2
    },
    newEpisodeAnimeContainer: {
        width: '100%', 
        height: 300, 
        alignItems: 'center'
    },
    selectAnimeContainer: {
        width: '100%',
        height: '39%',
        justifyContent: 'center',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#181A20',
        alignItems: 'center',
    },
    headerContainer: {
        position: 'absolute',
        width: '90%',
        height: 40,
        zIndex: 999,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 60,
    },
    headerLogo: {
        width: 35,
        height: 35,
    },
    headerIconSearch: {
        width: 30,
        height: 30,
    },
    hitsAnimeTextContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    hitsAnimeText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    hitsAnimeTextSeeAll: {
        color: '#06C049',
        fontSize: 12,
        fontFamily: 'Outfit',
    },
    animeHitsContainer: {
        flexDirection: 'row'
    },
    newEpisodeAnimeTextContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    newEpisodeAnimeText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    newEpisodeAnimeTextSeeAll: {
        color: '#06C049',
        fontSize: 12,
        fontFamily: 'Outfit',
    },
    cardContainer: {
        width: 150,
        height: 200,
        backgroundColor: 'red',
        borderRadius: 15,
    },
    selectAnimeImage: {
        width: '100%',
        height: '100%',
        zIndex: 1,
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
    containerAnimeTop: {
        width: '100%',
        marginTop: 20,
        paddingLeft: 20,
        flexGrow: 1,
    },
    animeContainerAnimeTop: {
        marginRight: 10,
        width: 150,
        height: 200,
        borderRadius: 15,
    },
    animeImageAnimeTop: {
        width: 150,
        height: 200,
        zIndex: 1,
        borderRadius: 10,
        position: 'absolute',
    },
    animeTitleAnimeTop: {
        marginTop: 5,
        textAlign: 'center',
    },
});
    
export default HomeScreen;