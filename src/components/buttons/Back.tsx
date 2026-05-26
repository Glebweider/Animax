import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

//Icons
import ArrowLeftIcon from '@Icons/ArrowLeftIcon';

// Data
import { COLOR_TEXT_PRIMARY } from '@Data/constants';


interface BallIndicatorProps {
    navigation?: NavigationProp<any>;
    text: string;
    onPress?: () => void;
}

const BackButton: React.FC<BallIndicatorProps> = ({ navigation, text, onPress }) => {
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (navigation) {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity onPress={handlePress}>
                    <ArrowLeftIcon Style={styles.button} Color={COLOR_TEXT_PRIMARY} />
                </TouchableOpacity>
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        marginTop: 50
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 18,
        marginLeft: 15,
    },
    button: {
        width: 28,
        height: 28,
    },
});

export default BackButton;