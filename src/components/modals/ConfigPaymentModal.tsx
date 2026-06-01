import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native';

//Utils
import { i18n } from '@Utils/localization';

// Data
import {
    BACKGROUND_CONFIGURATOR, COLOR_BACKGROUND_SECONDARY,
    COLOR_PRIMARY, COLOR_TEXT_PRIMARY
} from '@Data/constants';


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
                navigation.navigate('Profile');
            }, 5000);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image
                        source={BACKGROUND_CONFIGURATOR}
                        style={styles.modalImage} />
                    <Text style={styles.modalTitle}>{i18n.t('reviewsummary.modal.congratulations')}</Text>
                    <Text style={styles.modalText}>{
                        i18n.t('reviewsummary.modal.youhave') +
                        i18n.t(data.objecyBuy.date) +
                        i18n.t('reviewsummary.modal.enjoy')
                    }</Text>
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
        backgroundColor: COLOR_PRIMARY,
        shadowRadius: 4,
        marginTop: 20,
    },
    modalButtonText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 16
    },
    modalContent: {
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
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
        color: COLOR_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 24
    },
    modalText: {
        marginTop: 15,
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 13,
        width: '80%',
        textAlign: 'center'
    }
});

export default ConfigPaymentModal;