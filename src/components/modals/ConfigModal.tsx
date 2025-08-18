import { i18n } from '@Utils/localization';
import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';
import { BallIndicator } from 'react-native-indicators';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfigModal: React.FC<ModalProps> = ({ visible, setVisible }) => {

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setVisible(false);
            }, 5000);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image
                        source={require('../../../assets/backgroundConfigurator.png')}
                        style={styles.modalImage} />
                    <Text style={styles.modalTitle}>{i18n.t('configModal.congratulations')}</Text>
                    <Text style={styles.modalText}>{i18n.t('configModal.text')}</Text>
                    <BallIndicator color='#13D458' size={60} animationDuration={700} />
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
    modalContent: {
        backgroundColor: '#1F222A',
        width: '90%',
        height: '75%',
        borderRadius: 20,
        alignItems: 'center',
    },
    modalImage: {
        marginTop: 15,
        width: 270,
        height: 270
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
        fontSize: 14,
        width: '80%',
        textAlign: 'center'
    }
});

export default ConfigModal;