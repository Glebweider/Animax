import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';

// Styles
import globalStyles from '@Styles/index';

//Icons
import StarIcon from '@Icons/StarIcon';

//Utils
import { i18n } from '@Utils/localization';

// Data
import { COLOR_BACKGROUND_SECONDARY, COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';


interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    anime: any;
}

const RatingModal: React.FC<ModalProps> = ({ visible, setVisible, anime }) => {
    const totalVotes = anime.scoresStats.reduce((sum, rating) => sum + rating.count, 0);

    return (
        <Modal
            isVisible={visible}
            animationIn="fadeInUp"
            animationOut="fadeOutDown"
            onBackdropPress={() => setVisible(false)}
            backdropOpacity={0.5}
            statusBarTranslucent
            style={globalStyles.MiniModalContainer}>
            <View style={styles.modalContent}>
                <View style={styles.modalShelf} />
                <Text style={styles.modalTitle}>{i18n.t('anime.modal.rating')}</Text>
                <View style={styles.modalHorizontalLine} />
                <View style={styles.modalRatingsContainer}>
                    <View style={styles.scoreDataContainer}>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.score}>{Number(anime.score).toFixed(1)}</Text>
                            <Text style={styles.scoreMax}>/10</Text>
                        </View>
                        <View style={styles.scoreStars}>
                            {[...Array(5)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    Style={{}}
                                    Color={COLOR_PRIMARY}
                                    Width={14}
                                    Height={12} />
                            ))}
                        </View>
                        <Text style={styles.userVoting}>({totalVotes} {i18n.t('anime.modal.users')})</Text>
                    </View>
                    <View style={styles.modalVerticalLine} />
                    <FlatList
                        data={anime.scoresStats}
                        keyExtractor={(item) => item.score}
                        style={{}}
                        renderItem={({ item }) =>
                            <View key={item.score} style={styles.scoreLineContainer}>
                                <Text style={styles.scoreLineText}>{item.score}</Text>
                                <View style={styles.progressBarContainer}>
                                    <View style={[
                                        styles.progressBar,
                                        { width: `${(item.count / totalVotes) * 100}%` }
                                    ]} />
                                </View>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 15 }} />
                </View>
                <View style={styles.modalHorizontalLine} />
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
	...globalStyles,
    stars: {
        ...globalStyles.RowCenter,
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
        ...globalStyles.RowCenter,
        width: '86%',
    },
    scoreLineText: {
        ...globalStyles.TextPrimary,
        fontSize: 10,
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
        ...globalStyles.TextPrimary,
        fontSize: 24,
    },
    scoreMax: {
        ...globalStyles.TextPrimary,
        fontSize: 10,
        marginTop: 17,
        marginLeft: 5,
    },
    scoreStars: {
        ...globalStyles.RowCenter,
        marginTop: 19,
    },
    userVoting: {
        ...globalStyles.TextPrimary,
        marginTop: 10,
        fontSize: 8,
    },
    modalRatingsContainer: {
        ...globalStyles.RowCenter,
        marginTop: 23,
        marginBottom: 10,
        height: 133,
        width: '90%',
    },
    modalButtonClose: {
        ...globalStyles.Center,
        marginTop: 25,
        width: '90%',
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 50,
        height: 58,
        shadowColor: 'rgba(6, 193, 73, 0.4)',
        shadowOffset: { width: 4, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 4,
        elevation: 8,
    },
    modalButtonCloseText: {
        ...globalStyles.TextPrimary,
        fontSize: 14
    },
    modalContent: {
        ...globalStyles.ModalPanel,
        width: '100%',
        height: '45%',
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
    },
    modalShelf: {
        ...globalStyles.ModalShelf,
    },
    modalImage: {
        ...globalStyles.ModalImage,
    },
    modalTitle: {
        ...globalStyles.TextPrimary,
        marginTop: 12,
        fontSize: 18
    },
    modalHorizontalLine: {
        ...globalStyles.ModalLine,
    },
    modalVerticalLine: {
        width: 1,
        height: '100%',
        backgroundColor: '#424242',
        borderRadius: 50,
        alignSelf: 'center',
    },
    modalText: {
        ...globalStyles.TextPrimary,
        marginTop: 20,
        fontSize: 14,
        width: '80%',
        textAlign: 'center'
    }
});

export default RatingModal;