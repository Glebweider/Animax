import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native';
import ArrowLeftIconIcon from './icons/ArrowLeftIcon';

const BackButton = ({ navigation, text }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeftIconIcon Style={styles.image} Color={'#fff'} />
            </TouchableOpacity>
            <Text style={styles.text}>{text}</Text>            
        </View>
    );
};
    
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        margin: 24,
        width: 28,
        height: 28
    },
    text: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
    },
});
    
export default BackButton;