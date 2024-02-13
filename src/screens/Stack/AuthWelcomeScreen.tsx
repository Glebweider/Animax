import React from 'react';
import { StyleSheet, View, Image, Text, Button, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

const AuthWelcomeScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/background.png')} style={styles.backgroundImage} />
            <LinearGradient
                    colors={['rgba(24, 26, 32, 0)', 'rgba(24, 26, 32, 100)']}
                    start={{ x: 0, y: 0,}}
                    end={{ x: 0, y: 1 }}
                    style={styles.backgroundShadow}>
            </LinearGradient>
            <View style={styles.containerData}>
                <View style={styles.data}>
                    <Text style={styles.title}>Welcome to Animax</Text>
                    <Text style={styles.description}>The best streaming anime app of the century to entertain you every day</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('AuthFGA')} 
                        style={styles.button}>
                        <Text style={styles.buttonTitle}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    containerData: {
        width: '100%',
        height: '30%',
        alignItems: 'center',
        zIndex: 2,
        marginBottom: 25,
    },
    backgroundShadow: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '70%',
        zIndex: 2
    },
    data: {
        width: '89%',
        height: '100%',
        justifyContent: 'space-evenly',
    },
    button: {
        backgroundColor: '#06C149',
        width: '100%',
        height: 60,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8, 
    },
    buttonTitle: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1
    },
    title: {
        color: '#fff',
        fontWeight: "500",
        fontSize: 31,
        fontFamily: 'Outfit',
    },
    description: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Outfit',
        textAlign: 'center',
    }
});
    
export default AuthWelcomeScreen;