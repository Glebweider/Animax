import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput, ScrollView, FlatList } from 'react-native';
import SearchIcon from '../../components/icons/SearchIcon';
import SortIcon from '../../components/icons/SortIcon';
import { useApolloClient, useQuery } from '@apollo/client';
import { GET_ANIMEBYGENRES } from '../../utils/graphql/getAnimeByGenres';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { GET_ANIMEBYSEARCH } from '../../utils/graphql/getAnimeBySearch';
import { i18n } from '../../localization';

const AnimeSearchScreen = ({ navigation }) => {
    const client = useApolloClient();
    const [textSearch, setTextSearch] = React.useState<string>('');
    const [errorSearch, setErrorSearch] = React.useState<boolean>(false);
    const FilterState = useSelector((state: RootState) => state.sortReducer);
    const [animes, setAnimes] = useState([]);
    const [page, setPage] = useState(1);
    
    const handleEndReached = async () => {
        let tags: string;
        let newPage = page + 1;
        setPage(newPage);

        if (FilterState.filter.length !== 0) {
            const idArray = FilterState.filter.map(item => item.id);
            tags = idArray.join(',');
        } else {
            tags = ""
        };

        const { data } = await client.query({
            query: GET_ANIMEBYGENRES,
            variables: { 
                page: newPage,
                limit: 50,
                genreIds: tags,
            },
        });   
        if (data) {
            setAnimes(prevAnimes => [...prevAnimes, ...data.animes]);     
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const idArray = FilterState.filter.map(item => item.id);
            const resultString = idArray.join(',');
            setErrorSearch(false);

            const { data } = await client.query({
                query: GET_ANIMEBYGENRES,
                variables: { 
                    page: 1,
                    limit: 50,
                    genreIds: resultString
                },
            });   
            if (data.animes.length !== 0) {
                setAnimes(data.animes);
            } else {
                setErrorSearch(true);
            };
        };    
        fetchData();
    }, [FilterState.filter]);

    const searchAnime = async () => {
        if(textSearch) {
            let tags: string;

            if (FilterState.filter.length !== 0) {
                const idArray = FilterState.filter.map(item => item.id);
                tags = idArray.join(',');
            } else {
                tags = ""
            };

            const { data } = await client.query({
                query: GET_ANIMEBYSEARCH,
                variables: { 
                    page: 1,
                    search: textSearch,
                    genreIds: tags,
                },
            });   
            if (data.animes.length !== 0) {
                setAnimes(data.animes);
            } else {
                setErrorSearch(true);
            };
        };
    };

    const AnimeCard = React.memo(({ item }: any) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('AnimeScreen', { animeId: item.id })}
                key={item.id}
                style={styles.animeContainerAnimeTop}>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
                </View>
                {(item.rating === 'r_plus' || item.rating === 'rx') && (
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>18+</Text>
                    </View>
                )}
                <Image
                    source={{ uri: item.poster.originalUrl }}
                    style={styles.animeImageAnimeTop}/>
            </TouchableOpacity>)
    });

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <View style={styles.searchSection}>
                    <SearchIcon 
                        Color={textSearch ? '#fff' : '#9E9E9E'} 
                        Style={styles.icon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholderTextColor="#9E9E9E"
                        placeholder={i18n.t('searchanime.search')}
                        keyboardType='default'
                        returnKeyType='search'
                        onSubmitEditing={() => searchAnime()}
                        onChangeText={(newText) => setTextSearch(newText)}
                        value={textSearch}/>
                </View>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('AnimeSortScreen')}
                    style={styles.sortButton}>
                    <SortIcon Color={'#06C149'} Style={{width: 200, height: 200,}} />
                </TouchableOpacity>
            </View>
            {FilterState.filter.length >= 1 && (
                <View style={styles.filters}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
                        {FilterState.filter.map((tag) => (
                                <View 
                                    style={styles.tag}
                                    key={tag.id}>
                                    <Text 
                                        numberOfLines={1} 
                                        ellipsizeMode="tail" 
                                        style={styles.tagText}>{tag.text}</Text>                                
                                </View>
                            ))
                        }                    
                    </ScrollView>
                </View>
            )}
            <View style={{width: '100%', flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
                {!errorSearch ? (
                    animes.length >= 1 && (
                        <FlatList
                            data={animes}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <AnimeCard item={item} />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.containerAnimeTop}
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.1}
                            numColumns={2}/>
                    )) : (
                    <View style={styles.errorContainer}>
                        <Image 
                            source={require('../../../assets/404.png')} 
                            style={styles.errorImage} />
                        <View style={styles.errorTextContainer}>
                            <Text style={styles.errorTitle}>{i18n.t('searchanime.notfound')}</Text>
                            <Text style={styles.errorText}>{i18n.t('searchanime.sorrytext')}</Text>
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
    errorContainer: {
        width: '100%',
        height: '55%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTextContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorImage: {
        width: 350,
        height: 250,
    },
    errorTitle: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 17,
    },
    errorText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
        marginTop: 20,
        textAlign: 'center'
    },
    filters: {
        width: '100%',
        height: 45,
        marginTop: 20,
    },
    filtersScrollView: {
        width: '100%',
        height: 45,
        flexGrow: 1,  
    },
    tag: {
        height: 45,
        backgroundColor: '#06C149',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 13,
        paddingRight: 20,
        paddingLeft: 20,
    },
    tagText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13
    },
    buttonsContainer: {
        width: '91%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 60,
    },
    sortButton: {
        width: 62,
        height: 62,
        backgroundColor: '#162723',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: 62,
        borderRadius: 15,
        backgroundColor: '#1F222A',
    },   
    searchInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14
    },
    icon: {
        width: 28,
        height: 28,
        margin: 22, 
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
        flexGrow: 1,
        paddingBottom: 210,
        marginTop: 15,
    },
    animeContainerAnimeTop: {
        margin: 7,
        width: 182,
        height: 242,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: '#1F222A'
    },
    animeImageAnimeTop: {
        width: 182,
        height: 242,
        zIndex: 1,
        borderRadius: 10,
        position: 'absolute'
    },
    animeTitleAnimeTop: {
        marginTop: 5,
        textAlign: 'center',
    },
});
    
export default AnimeSearchScreen;