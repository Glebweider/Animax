import { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@Redux/store';
import CrownIcon from '@Icons/CrownIcon';
import Svg, { G, Path } from 'react-native-svg';
import ArrowRightIcon from '@Components/icons/ArrowRightIcon';
import ProfileIcon from '@Icons/ProfileIcon';
import LogoutModal from '@Modal/LogoutModal';
import { StatusBar } from 'expo-status-bar';
import { i18n } from '@Utils/localization';
import NotificationIcon from '@Components/icons/NotificationIcon';

const ProfileScreen = ({ navigation }) => {
    const userState = useSelector((state: RootState) => state.userReducer);
    const [isOpenModalLogout, setOpenModalLogout] = useState<boolean>(false); 

    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <LogoutModal 
                visible={isOpenModalLogout}
                setVisible={setOpenModalLogout}
                navigation={navigation} />
            <View style={styles.headerContainer}>
                <Image source={require('../../../assets/icon.png')} style={styles.headerIcon} />
                <Text style={styles.headerText}>{i18n.t('navigation.profile')}</Text>   
            </View>
            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <Image 
                        source={{ uri: userState.profile.avatar }} 
                        style={styles.avatarImage} />  
                </View>
                <View style={styles.profileUserData}>
                    <Text style={styles.profileUsername}>{userState.profile.nickname}</Text>
                    <Text style={styles.profileUserEmail}>{userState.email}</Text>
                </View>
            </View>
            {!userState.premium.premium && 
                <TouchableOpacity
                    onPress={() => navigation.navigate('SubcribeScreen')}
                    style={styles.premiumContainer}>
                    <CrownIcon Width={60} Height={55} Color={'#06C149'} />
                    <View style={styles.premiumTextContainer}>
                        <Text style={styles.premiumTitle}>{i18n.t('premium.join')}</Text>
                        <Text 
                            numberOfLines={2} 
                            ellipsizeMode="tail" 
                            style={styles.premiumDescription}>{i18n.t('premium.details')}</Text>
                    </View>
                    <ArrowRightIcon Color={'#06C149'} Width={30} Height={30} />
                </TouchableOpacity>
            }
            <View style={styles.labelsContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('EditDataScreen')}
                    style={styles.labelContainer}>
                    <View style={styles.labelLeftContainer}>
                        <ProfileIcon Style={{}} Color={'#fff'} />
                        <Text style={styles.labelLeftText}>{i18n.t('profile.edit')}</Text>
                    </View>
                    <ArrowRightIcon Color={'#fff'} Width={20} Height={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('NotificationScreen')}
                    style={styles.labelContainer}>
                    <View style={styles.labelLeftContainer}>
                        <NotificationIcon Style={{}} Color={'#fff'} Width={25} Height={25} />
                        <Text style={styles.labelLeftText}>{i18n.t('profile.notification')}</Text>
                    </View>
                    <ArrowRightIcon Color={'#fff'} Width={20} Height={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => {}}
                    style={styles.labelContainer}>
                    <View style={styles.labelLeftContainer}>
                        <Svg
                            width="27"
                            height="27"
                            viewBox="0 0 48 48">
                            <G data-name="Layer 2">
                                <Path fill="none" data-name="invisible box" d="M0 0H48V48H0z" />
                                <G data-name="icons Q2">
                                    <Path 
                                        d="M24 6.2c5.3 1.5 11.1 3.3 14 4.3v15.7c0 3.4-3.7 9.4-14 15.4-10.3-6.1-14-12-14-15.4V10.5c2.9-1.1 8.7-2.8 14-4.3M24 2S6 7.1 6 8v18.2c0 9.2 13.3 17.3 17 19.5a1.8 1.8 0 002 0c3.8-2.1 17-10.3 17-19.5V8c0-.9-18-6-18-6z"
                                        fill='#fff' />
                                    <Path 
                                        d="M19.6 29.4l-5-4.9a2.1 2.1 0 01-.2-2.7 1.9 1.9 0 013-.2l3.6 3.6 9.6-9.6a2 2 0 012.8 2.8l-11 11a1.9 1.9 0 01-2.8 0z"
                                        fill='#fff' />
                                </G>
                            </G>
                        </Svg>
                        <Text style={styles.labelLeftText}>{i18n.t('profile.security')}</Text>
                    </View>
                    <ArrowRightIcon Color={'#fff'} Width={20} Height={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('LanguageScreen')}
                    style={styles.labelContainer}>
                    <View style={styles.labelLeftContainer}>
                        <Svg
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                            fill="none">
                            <G stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
                                <Path
                                    d="M2.75 12c0-6.937 2.313-9.25 9.25-9.25 6.937 0 9.25 2.313 9.25 9.25 0 6.937-2.313 9.25-9.25 9.25-6.937 0-9.25-2.313-9.25-9.25z"
                                    strokeWidth={1.5}/>
                                <Path
                                    d="M15.204 13.9h.01M12.204 9.9h.01M9.196 13.9h.009"
                                    strokeWidth={2}/>
                            </G>
                        </Svg>
                        <Text style={styles.labelLeftText}>{i18n.t('profile.language')}</Text>
                    </View>
                    <ArrowRightIcon Color={'#fff'} Width={20} Height={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('HelpCenterScreen')}
                    style={styles.labelContainer}>
                    <View style={styles.labelLeftContainer}>
                        <Svg width="27" height="27" viewBox="0 0 24 24" fill="none">
                            <G stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M21.25 12c0 6.937-2.313 9.25-9.25 9.25-6.937 0-9.25-2.313-9.25-9.25 0-6.937 2.313-9.25 9.25-9.25 6.937 0 9.25 2.313 9.25 9.25z"/>
                                <Path d="M12 15.895V12M12.005 8.5h-.01" />
                            </G>
                        </Svg>
                        <Text style={styles.labelLeftText}>{i18n.t('profile.helpcenter')}</Text>
                    </View>
                    <ArrowRightIcon Color={'#fff'} Width={20} Height={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                    style={styles.labelContainer}>
                    <View style={styles.labelLeftContainer}>
                        <Svg width="27" height="27" viewBox="0 0 24 24" fill="none">
                            <G stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M2.75 12c0-6.937 2.313-9.25 9.25-9.25 6.937 0 9.25 2.313 9.25 9.25 0 6.937-2.313 9.25-9.25 9.25-6.937 0-9.25-2.313-9.25-9.25z"/>
                                <Path d="M12 8.105V12M11.995 15.5h.01" />
                            </G>
                        </Svg>
                        <Text style={styles.labelLeftText}>{i18n.t('profile.privacypolicy')}</Text>
                    </View>
                    <ArrowRightIcon Color={'#fff'} Width={20} Height={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setOpenModalLogout(true)}
                    style={styles.labelContainer}>
                    <View style={styles.labelLeftContainer}>
                        <Svg
                            width="27"
                            height="27"
                            viewBox="0 0 24 24"
                            fill="none">
                            <G
                                stroke="#F75555"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <Path d="M21.791 12.12H9.75M18.864 9.205l2.928 2.916-2.928 2.916M16.36 7.63c-.33-3.58-1.67-4.88-7-4.88-7.101 0-7.101 2.31-7.101 9.25 0 6.94 0 9.25 7.1 9.25 5.33 0 6.67-1.3 7-4.88" />
                            </G>
                        </Svg>
                        <Text style={styles.labelLeftTextLogout}>{i18n.t('profile.logout')}</Text>
                    </View>
                </TouchableOpacity>
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
    labelsContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        marginTop: 10
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
        marginTop:25,
    },
    profileUserData: {
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        marginLeft: 24,
    },
    profileUsername: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 15,
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
        borderRadius: 100,
        overflow: 'hidden'
    },
    avatarContainer: {
        alignItems: 'center',
    },
    headerContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
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