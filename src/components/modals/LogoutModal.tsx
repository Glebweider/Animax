import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

//Utils
import { removeTokenFromStorage } from '@Utils/token';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    navigation: any;
}

const LogoutModal: React.FC<ModalProps> = ({ visible, setVisible, navigation }) => {
    const deAuthorization = async () => {
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
                <Text style={styles.modalTitle}>Logout</Text>
                <View style={styles.modalLine} />
                <Text style={styles.modalText}>Are you sure you want to log out?</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        onPress={() => setVisible(false)}
                        style={styles.modalButtonCancel}>
                        <Text style={styles.modalButtonCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => deAuthorization()}
                        style={styles.modalButtonApply}>
                        <Text style={styles.modalButtonApplyText}>Yes, Logout</Text>
                    </TouchableOpacity>
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
    modalButtons: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    modalButtonCancel: {
        width: '48%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#35383F',
        borderRadius: 50,
        height: 58, 
    },
    modalButtonApply: {
        width: '48%',
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
    modalButtonCancelText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14
    },
    modalButtonApplyText: {
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 14
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