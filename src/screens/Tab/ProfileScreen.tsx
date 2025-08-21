import { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { i18n } from '@Utils/localization';
import { BallIndicator } from 'react-native-indicators';
import useGetUserProfile from '@Utils/api/rest/user/getUserProfile';
import { getTokenFromStorage } from '@Utils/functions/token';
import CrownIcon from '@Components/icons/CrownIcon';
import formattedTime from '@Utils/formatters/time';
import SettingsIcon from '@Components/icons/SettingsIcon';
import AnimeCard from '@Components/cards/Anime';
import { GET_ANIMES } from '@GraphQl/getAnimes';
import { useApolloClient } from '@apollo/client';


const ProfileScreen = ({ navigation, route }) => {
    const client = useApolloClient();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<any>({
        uuid: "",
        interests: [],
        animelist: [],
        premium: false,
        description: "",
        profile: {
            avatar: "",
            nickname: "",
        },
        animestats: {
            counterWatchedAnime: 0,
            timeSpentWatchingAnime: 0,
            achievementsCountWatchedAnime: 0,
        }
    });
    const [userAnimeList, setUserAnimeList] = useState<any[]>([]);

    const { getUserProfile } = useGetUserProfile();
    const { userId } = route.params;

    useEffect(() => {
        const fetchData = async () => {
            let token = await getTokenFromStorage();
            if (token && userId) {
                const userData = await getUserProfile(token, userId);
                if (userData) {
                    setUser(userData);

                    const { data } = await client.query({
                        query: GET_ANIMES,
                        variables: {
                            ids: userData.animelist?.join(",")
                        }
                    });

                    if (data?.animes) {
                        setUserAnimeList(data?.animes);
                    }

                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [userId]);

    if (!user)
        return <BallIndicator color="#13D458" size={70} animationDuration={700} />;

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../../assets/icon.png')} style={styles.headerIcon} />
                    <Text style={styles.headerText}>{i18n.t('navigation.profile')}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
                    <SettingsIcon Color={'#fff'} Style={{}} />
                </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={!isLoading && { uri: user.profile.avatar }}
                        style={styles.avatarImage} />
                </View>
                <View style={styles.profileUserData}>
                    <View style={{ flexDirection: 'row' }}>
                        {user.premium && <CrownIcon Width={34} Height={34} Color={'#06C149'} />}
                        <Text style={styles.profileUsername}>{!isLoading && user.profile.nickname}</Text>
                    </View>
                    <Text style={styles.profileDescription}>{!isLoading && user.description}</Text>
                    <View style={styles.genresContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.genresScrollView}>
                            {!isLoading && user.interests.map((genre) => (
                                <View
                                    style={styles.genreContainer}
                                    key={genre.id}>
                                    <Text style={styles.genreText}>{genre.text}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
            {/* <View style={styles.statsContainer}>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Просмотренно аниме</Text>
                    <Text style={styles.statDataText}>{isLoading && user.animestats.counterWatchedAnime}</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Просмотренно</Text>
                    <Text style={styles.statDataText}>{isLoading && user.animestats.achievementsCountWatchedAnime}</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Время проведённое за просмотром</Text>
                    <Text style={styles.statDataTimeText}>{isLoading && formattedTime(user.animestats.timeSpentWatchingAnime)}</Text>
                </View>
            </View> */}
            <Text style={styles.favoriteAnimelistText}>{i18n.t('profile.favoriteanime')}</Text>
            <FlatList
                data={userAnimeList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AnimeCard
                        navigation={navigation}
                        item={item}
                        width={130}
                        height={175}
                        isLoading={!item?.id} />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 5, height: '100%', marginTop: 9 }}
                horizontal />
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
    statsContainer: {
        marginTop: 22,
        height: '15%',
        width: '98%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    statContainer: {
        width: '30%',
        height: 120,
        borderColor: '#06C149',
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    statTitleText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 10,
        marginTop: 10,
    },
    statDataText: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 24,
        marginBottom: 10,
    },
    favoriteAnimelistText: {
        width: '90%',
        color: '#fff',
        marginTop: 15,
        fontSize: 18
    },
    genresContainer: {
        width: '100%',
        height: 30,
        marginTop: 8,
        marginLeft: -3,
        alignItems: 'flex-start',
    },
    genresScrollView: {
        width: '70%',
        height: 26,
        paddingRight: 10,
    },
    genreContainer: {
        height: 26,
        borderColor: '#06C149',
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        paddingHorizontal: 7,
    },
    genreText: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 8
    },
    profileDescription: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 11,
        marginLeft: 6,
        width: '62%'
    },
    profileContainer: {
        width: '90%',
        height: 100,
        flexDirection: 'row',
        marginTop: 25,
    },
    profileUserData: {
        height: '100%',
        width: '100%',
        marginLeft: 12,
    },
    profileUsername: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
        marginLeft: 6,
        marginTop: 4
    },
    avatarImage: {
        width: 100,
        height: 100,
        backgroundColor: '#464648',
        borderRadius: 450,
        overflow: 'hidden'
    },
    avatarContainer: {
        alignItems: 'center',
    },
    headerContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        marginTop: 50
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
});

export default ProfileScreen;