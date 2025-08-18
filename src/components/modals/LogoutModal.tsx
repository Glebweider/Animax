import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

//Utils
import { removeTokenFromStorage } from '@Utils/functions/token';
import ApplyButton from '@Components/buttons/Apply';
import { i18n } from '@Utils/localization';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    navigation: any;
}

const LogoutModal: React.FC<ModalProps> = ({ visible, setVisible, navigation }) => {
    const logout = async () => {
        setVisible(false);
        await removeTokenFromStorage();
        navigation.navigate('AuthFGA');
    };

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
                <View style={styles.modalShelf} />
                <Text style={styles.modalTitle}>{i18n.t('profile.logout')}</Text>
                <View style={styles.modalLine} />
                <Text style={styles.modalText}>{i18n.t('logout.description')}</Text>
                <View style={styles.modalButtons}>
                    <ApplyButton
                        onPress={() => setVisible(false)}
                        isActiveButton={false}
                        style={styles.cancelButton}
                        text={i18n.t('logout.cancel')} />
                    <ApplyButton
                        onPress={logout}
                        isActiveButton={false}
                        style={styles.applyButton}
                        text={i18n.t('logout.apply')} />
                </View>
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
    applyButton: {
        width: '48%',
        marginTop: 0
    },
    cancelButton: {
        width: '48%',
        backgroundColor: '#35383F',
        marginTop: 0,
        elevation: 0,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    modalContent: {
        backgroundColor: '#1F222A',
        width: '100%',
        height: '30%',
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
        marginTop: 20,
        color: '#F75555',
        fontFamily: 'Outfit',
        fontSize: 20
    },
    modalLine: {
        width: '90%',
        height: 1,
        backgroundColor: '#424242',
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 16
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

export default LogoutModal;