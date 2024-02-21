import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BallIndicator } from 'react-native-indicators';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    navigation: any;
    data: any
}

const ConfigPaymentModal: React.FC<ModalProps> = ({ visible, setVisible, data, navigation }) => {

    useEffect(() => {
        if (visible) {                
            setTimeout(() => {
                setVisible(false);
            }, 775000);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image 
                        source={require('../../../assets/backgroundConfigurator.png')} //Заменить на другую иконку
                        style={styles.modalImage} />
                    <Text style={styles.modalTitle}>Congratulations!</Text>
                    <Text style={styles.modalText}>Your have successfully subscribed 1 {data.objecyBuy.date} premium. Enjoy the benefits!</Text>
                    <TouchableOpacity 
                        onPress={() => {
                            setVisible(false);
                            navigation.navigate('Profile');
                        }}
                        style={styles.modalButtonContainer}>
                        <Text style={styles.modalButtonText}>oк</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalButtonContainer: {
        width: '80%',
        height: 58,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#06C149',
        shadowRadius: 4,
        marginTop: 20,
    },
    modalButtonText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 16
    },
    modalContent: {
        backgroundColor: '#1F222A',
        width: '80%',
        height: '60%',
        borderRadius: 40,
        alignItems: 'center',
    },
    modalImage: {
        marginTop: 15,
        width: 240,
        height: 240
    },
    modalTitle: {
        marginTop: 20,
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 24
    },
    modalText: {
        marginTop: 15,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 13,
        width: '80%',
        textAlign: 'center'
    }
});

export default ConfigPaymentModal;