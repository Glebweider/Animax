import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';

//Icons
import StarIcon from '@Icons/StarIcon';

//Utils
import { i18n } from '@Utils/localization';


interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    anime: any;
}

const RatingModal: React.FC<ModalProps> = ({ visible, setVisible, anime }) => {
    const totalVotes = anime.scoresStats.reduce((sum, rating) => sum + rating.count, 0);

    const ProgressBar = ({ progress }) => (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
    );

    return (
        <Modal 
            isVisible={visible}
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            onBackdropPress={() => setVisible(false)}
            backdropOpacity={0.5}
            statusBarTranslucent
            style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <View style={styles.modalShelf}/>
                <Text style={styles.modalTitle}>{i18n.t('anime.modal.rating')}</Text>
                <View style={styles.modalHorizontalLine}/>
                <View style={styles.modalRatingsContainer}>
                    <View style={styles.scoreDataContainer}>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.score}>{Number(anime.score).toFixed(1)}</Text>
                            <Text style={styles.scoreMax}>/10</Text>
                        </View>
                        <View style={styles.scoreStars}>
                            <StarIcon Style={{}} Color={'#06C149'} Width={14} Height={12} />
                            <StarIcon Style={{}} Color={'#06C149'} Width={14} Height={12} />
                            <StarIcon Style={{}} Color={'#06C149'} Width={14} Height={12} />
                            <StarIcon Style={{}} Color={'#06C149'} Width={14} Height={12} />
                            <StarIcon Style={{}} Color={'#06C149'} Width={14} Height={12} />
                        </View>
                        <Text style={styles.userVoting}>({totalVotes} {i18n.t('anime.modal.users')})</Text>
                    </View>
                    <View style={styles.modalVerticalLine}/>
                    <FlatList
                        data={anime.scoresStats}
                        keyExtractor={(item) => item.score}
                        style={{}}
                        renderItem={({ item }) => 
                            <View key={item.score} style={styles.scoreLineContainer}>
                                <Text style={styles.scoreLineText}>{item.score}</Text>
                                <ProgressBar progress={(item.count / totalVotes) * 100} />
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingHorizontal: 15}}/>
                </View>
                <View style={styles.modalHorizontalLine}/>
                <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={styles.modalButtonClose}>
                    <Text style={styles.modalButtonCloseText}>{i18n.t('anime.modal.close')}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        margin: 0,
        padding: 0
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        width: '80%',
        justifyContent: 'space-evenly'
    },
    progressBarContainer: {
        height: 6,
        width: '90%',
        backgroundColor: '#424242',
        borderRadius: 5,
        overflow: 'hidden',
        marginLeft: 8
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#15D75A',
        borderRadius: 5,
    },
    scoreLineContainer: {
        flexDirection: 'row',
        width: '86%',
        alignItems: 'center'
    },
    scoreLineText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Outfit',
        width: 13
    },
    scoreDataContainer: {
        width: '30%',
        height: '100%',
        alignItems: 'center',
        marginRight: 15
    },
    scoreContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    score: {
        color: '#fff',
        fontSize: 24,
        fontFamily: 'Outfit',
    },
    scoreMax: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Outfit',
        marginTop: 17,
        marginLeft: 5,
    },
    scoreStars: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 19,
    },
    userVoting: {
        marginTop: 10,
        color: '#fff',
        fontSize: 8,
        fontFamily: 'Outfit',
    },
    modalRatingsContainer: {
        marginTop: 23,
        marginBottom: 10,
        height: 133,
        width: '90%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    modalButtonClose: {
        marginTop: 25,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#06C149',
        borderRadius: 50,
        height: 58, 
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8, 
    },
    modalButtonCloseText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14
    },
    modalContent: {
        backgroundColor: '#1F222A',
        width: '100%',
        height: '45%',
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
        alignItems: 'center',
    },
    modalShelf: {
        width: 40,
        height: 4,
        backgroundColor: '#424242',
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 8
    },
    modalImage: {
        marginTop: 15,
        width: 270,
        height: 270
    },
    modalTitle: {
        marginTop: 12,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18
    },
    modalHorizontalLine: {
        width: '90%',
        height: 1,
        backgroundColor: '#424242',
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 16
    },
    modalVerticalLine: {
        width: 1,
        height: '100%',
        backgroundColor: '#424242',
        borderRadius: 50,
        alignSelf: 'center',
    },
    modalText: {
        marginTop: 20,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14,
        width: '80%',
        textAlign: 'center'
    }
});

export default RatingModal;