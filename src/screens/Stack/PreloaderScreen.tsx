import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, Button } from 'react-native';
import { getTokenFromStorage, removeTokenFromStorage } from '../../utils/token';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/reducers/userReducer';
import authUserInToken from '../../utils/fetch/authUserInToken';
import * as Font from 'expo-font';
import { BallIndicator } from 'react-native-indicators';

const PreloaderScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const bootStart = async () => {
            await Font.loadAsync({ 'Outfit': require('../../../assets/fonts/Outfit.ttf') });
        
            let token = await getTokenFromStorage();
            if (token) {
                const user = await authUserInToken(token);
                if (user) {
                    dispatch(setUser(user));
                    navigation.navigate('HomeScreen');
                } else {
                    navigation.navigate('AuthSignIn');
                }
            } else {
                navigation.navigate('AuthWelcome');
            }
        };
    
        bootStart();
    }, [getTokenFromStorage, navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
            <View style={styles.loaderIndicatorContainer}>
                <BallIndicator style={styles.loaderIndicator} color='#13D458' size={70} animationDuration={700} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181A20',
        position: 'absolute'
    },
    logo: {
        width: 160,
        height: 160,
    },
    loaderIndicatorContainer: {
        height: 70,
    },
    loaderIndicator: {
        marginTop: '50%'
    }
});
    
export default PreloaderScreen;