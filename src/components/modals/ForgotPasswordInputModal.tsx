import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    navigation: any;
    setData: React.Dispatch<React.SetStateAction<string>>;
    data: any;
}

const ForgotPasswordInputModal: React.FC<ModalProps> = ({ visible, setVisible, setData, data, navigation }) => {

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalInputSection}>
                        <TextInput
                            style={styles.modalInput}
                            placeholderTextColor="#9E9E9E"
                            placeholder={data}
                            onChangeText={(newText) => setData(newText)}/>
                    </View>
                    <TouchableOpacity 
                        onPress={() => {
                            setVisible(false);
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
        width: '86%',
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
        height: '22%',
        borderRadius: 40,
        alignItems: 'center',
    },
    modalInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontFamily: 'Outfit',
        marginLeft: 20
    },
    modalInputSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '86%',
        height: 64,
        borderRadius: 20,
        backgroundColor: '#181A20',
    }
});

export default ForgotPasswordInputModal;