import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const BackButton = ({ navigation, text }) => {

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon Style={styles.headerButtonBack} Color={'#fff'} />
                </TouchableOpacity>
                <Text style={styles.headerText}>{text}</Text>                    
            </View>            
        </View>
    );
};
    
const styles = StyleSheet.create({
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
        alignItems: 'center'
    },
    headerText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
        marginLeft: 15,
    },
    headerButtonBack: {
        width: 28,
        height: 28,
    },
});
    
export default BackButton;