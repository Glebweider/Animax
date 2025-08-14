import ArrowLeftIcon from '@Components/icons/ArrowLeftIcon';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setQualityEpisode: React.Dispatch<React.SetStateAction<'hls_480' | 'hls_720' | 'hls_1080'>>;
}

const QualityEpisodeModal: React.FC<ModalProps> = ({ visible, setVisible, setQualityEpisode }) => {
    const setQuality = async (qualityEpisode: 'hls_480' | 'hls_720' | 'hls_1080') => {
        setQualityEpisode(qualityEpisode);
        setVisible(false);
    };

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            backdropOpacity={0}
            onBackdropPress={() => setVisible(false)}
            style={styles.modalContainer}>

            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setVisible(false)} style={styles.backButton}>
                        <ArrowLeftIcon Color={'#FFFFFF'} Style={{}} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Quality</Text>
                </View>

                <View style={styles.qualityButtons}>
                    <TouchableOpacity onPress={() => setQuality('hls_480')} style={styles.qualityButton}>
                        <Text style={styles.qualityButtonText}>480p</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setQuality('hls_720')} style={styles.qualityButton}>
                        <Text style={styles.qualityButtonText}>720p</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setQuality('hls_1080')} style={styles.qualityButton}>
                        <Text style={styles.qualityButtonText}>1080p</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        margin: 0,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#191C25',
        width: 160,
        height: '100%',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        marginRight: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
    qualityButtons: {
        flexDirection: 'column',
        alignItems: 'center',

    },
    qualityButton: {
        marginBottom: 15,
        alignItems: 'center',
    },
    qualityButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default QualityEpisodeModal;