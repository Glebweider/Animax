import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

const DownloadScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Text>DownloadScreen</Text>
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
    
export default DownloadScreen;