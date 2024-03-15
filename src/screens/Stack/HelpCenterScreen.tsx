import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import BackButton from '../../components/BackButton';
import { useEffect, useRef, useState } from 'react';
import ContactUs from '../../components/ContactUs';
import { i18n } from '../../localization';

const HelpCenterScreen = ({ navigation }) => {
    const [selectMethodHelp, setSelectMethodHelp] = useState<string>('FAQ');
    const [moveLeft, setMoveLeft] = useState<boolean>(true);
    const moveValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.timing(moveValue, {
            toValue: moveLeft ? 0 : 190,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
        });
    
        animation.start();
    
        return () => {
            animation.stop();
        };
    }, [moveLeft, moveValue]);

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('profile.helpcenter')} />
            <View style={styles.methodsContainer}>
                <View style={styles.methodsTextContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectMethodHelp('FAQ');
                            setMoveLeft(true);
                        }}
                        style={styles.FAQContainer}>
                        <Text style={selectMethodHelp == 'FAQ' ? styles.methodTextActive : styles.methodText}>FAQ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectMethodHelp('ContactUs');
                            setMoveLeft(false);
                        }}
                        style={styles.ContactUsContainer}>
                        <Text style={selectMethodHelp == 'ContactUs' ? styles.methodTextActive : styles.methodText}>Contact us</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line}>
                    <Animated.View style={[styles.lineActive, {
                        transform: [ 
                            {
                                translateX: moveValue,
                            } 
                        ],
                    }]} />
                </View>
            </View>
            <View style={styles.containerContent}>
                {moveLeft ? 
                    <View>
                        
                    </View>
                    :
                    <ContactUs />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    containerContent: {
        width: '100%',
        height: '100%',
    },
    methodsContainer: {
        width: '92%',
        marginTop: 15
    },
    methodsTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    FAQContainer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ContactUsContainer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodText: {
        color: '#616161',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    methodTextActive: {
        color: '#06C149',
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    line: {
        width: '100%',
        backgroundColor: '#35383F',
        height: 2,
        borderRadius: 50,
        marginTop: 18,
    },
    lineActive: {
        width: '50%',
        backgroundColor: '#06C149',
        height: 4,
        borderRadius: 50,
    },
});
    
export default HelpCenterScreen;