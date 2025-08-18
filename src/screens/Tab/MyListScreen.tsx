import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { getTokenFromStorage } from '@Utils/functions/token';
import { BallIndicator } from 'react-native-indicators';
import { i18n } from '@Utils/localization';
import { useIsFocused } from '@react-navigation/native';
import useGetAnimeListUser from '@Utils/api/rest/anime/getAnimeListUser';
import { useAlert } from '@Components/AlertContext';
import { StatusBar } from 'expo-status-bar';

const MyListScreen = ({ navigation }) => {
    const [userAnimeList, setUserAnimeList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isFocused = useIsFocused();
    const { getAnimeListUser } = useGetAnimeListUser();
    const { showAlert } = useAlert();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        let token = await getTokenFromStorage();
        if (token) {
            try {
                const userAnimeList = await getAnimeListUser(token);
                setUserAnimeList(userAnimeList);
            } catch (error) {
                alert(error);
            }
        } else {
            showAlert('У вас отсутствует AuthToken, пожалуйста, перезайдите в приложение');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused, fetchData]);

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image source={require('../../../assets/icon.png')} style={styles.headerIcon} />
                    <Text style={styles.headerText}>{i18n.t('navigation.mylist')}</Text>
                </View>
            </View>
            <View style={{ width: '100%', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? (
                    <BallIndicator color='#06C149' size={80} animationDuration={700} />
                ) : (
                    userAnimeList?.length >= 1 ?
                        <FlatList
                            data={userAnimeList}
                            keyExtractor={(item) => item.animeId.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AnimeScreen', { animeId: item.animeId })}
                                    key={item.animeId}
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
                                        style={styles.animeImageAnimeTop} />
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.containerAnimeTop}
                            numColumns={2} />
                        :
                        <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                            <Image style={{ marginTop: 80 }} source={require('../../../assets/error404MyList.png')} />
                            <View style={styles.errorTextContainer}>
                                <Text style={styles.errorTitle}>{i18n.t('mylist.listempty')}</Text>
                                <Text style={styles.errorText}>{i18n.t('mylist.emptytext')}</Text>
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
        width: '90%',
        fontSize: 14,
        marginTop: 20,
        textAlign: 'center'
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
        paddingBottom: 200,
    },
    animeContainerAnimeTop: {
        margin: 7,
        width: 172,
        height: 232,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: '#1F222A'
    },
    animeImageAnimeTop: {
        width: '100%',
        height: '100%',
        zIndex: 1,
        borderRadius: 10,
        position: 'absolute'
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
    },
    headerIconsContainer: {
        width: 84,
        height: 35,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    headerIconSearch: {
        width: 34,
        height: 34,
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

export default MyListScreen;