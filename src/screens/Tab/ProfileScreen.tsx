import { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import LogoutModal from '@Modal/LogoutModal';
import { StatusBar } from 'expo-status-bar';
import { i18n } from '@Utils/localization';
import { BallIndicator } from 'react-native-indicators';
import useGetUserProfile from '@Utils/fetch/getUserProfile';
import { getTokenFromStorage } from '@Utils/token';
import { IUserProfile } from '@Interfaces/userProfileScreen.interface';
import CrownIcon from '@Components/icons/CrownIcon';
import formattedTime from '@Utils/formattedTime';
import SettingsIcon from '@Components/icons/SettingsIcon';

const ProfileScreen = ({ navigation, route }) => {
    const [isLoading, setLoading] = useState<boolean>(true); 
    const [user, setUser] = useState<IUserProfile>({
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
        }
    });

    const { getUserProfile } =  useGetUserProfile();
    const { userId } = route.params;

    useEffect(() => {
        const fetchData = async () => {
            let token = await getTokenFromStorage();
            if (token && userId) {
                const data = await getUserProfile(token, userId);
                if(data) {
                    setUser(data);
                    setLoading(true);
                }
            }
        };

        fetchData();
    }, [userId]);

    if (!user) {
        return <BallIndicator color="#13D458" size={70} animationDuration={700} />;
    }

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.headerContainer}>
                <View style={{flexDirection: 'row'}}>
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
                        source={ isLoading && { uri: user.profile.avatar }} 
                        style={styles.avatarImage} />  
                </View>
                <View style={styles.profileUserData}>
                    <View style={{ flexDirection: 'row' }}>
                        {user.premium && <CrownIcon Width={34} Height={34} Color={'#06C149'} /> }
                        <Text style={styles.profileUsername}>{isLoading && user.profile.nickname}</Text>
                    </View>
                    <Text style={styles.profileDescription}>{isLoading && user.description}</Text>
                    <View style={styles.genresContainer}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={styles.genresScrollView}>
                            {isLoading && user.interests.map((genre) => (
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
            <View style={styles.statsContainer}>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Просмотренно аниме</Text>
                    <Text style={styles.statDataText}>{isLoading && user.animestats.counterWatchedAnime}</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Просмотренно</Text>
                    <Text style={styles.statDataText}>6</Text>
                </View>
                <View style={styles.statContainer}>
                    <Text style={styles.statTitleText}>Время проведённое за просмотром</Text>
                    <Text style={styles.statDataTimeText}>{isLoading && formattedTime(user.animestats.timeSpentWatchingAnime)}</Text>
                </View>
            </View>
            <FlatList
                data={user.animelist}
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
                            style={styles.animeImageAnimeTop}/>
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 5, marginTop: 17, height: '100%' }}
                horizontal
            />
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
        fontSize: 32,
        marginBottom: 5,
    },
    statDataTimeText: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 24,
        marginBottom: 10,
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
    animeImageAnimeTop: {
        width: 130,
        height: 175,
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
    animeContainerAnimeTop: {
        margin: 9,
        width: 130,
        height: 175,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: '#1F222A'
    },
    labelsContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        marginTop: 10
    },
    topAnimeListUserContainer: {
        width: '100%',
    },
    profileDescription: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 11,
        marginLeft: 6,
        width: '62%'
    },
    labelContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 30,
        marginTop: 20,
    },
    labelLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelLeftText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
        marginLeft: 15
    },
    labelLeftTextLogout: {
        color: '#F75555',
        fontFamily: 'Outfit',
        fontSize: 14,
        marginLeft: 15
    },
    premiumContainer: {
        flexDirection: 'row',
        width: '90%',
        height: 110,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#06C149',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 25,
    },
    premiumTextContainer: {
        width: '60%',
    },
    premiumTitle: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 15,
    },
    premiumDescription: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 10,
        marginTop: 10,
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
    profileUserEmail: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 12,
        marginTop: 10,
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