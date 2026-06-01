import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// Data
import {
    COLOR_BACKGROUND_PRIMARY, COLOR_BACKGROUND_SECONDARY,
    COLOR_PRIMARY, COLOR_TEXT_PRIMARY, COLOR_TEXT_TERTIARY
} from '@Data/constants';

// Redux
import { RootState } from '@Redux/store';
import { setData } from '@Redux/reducers/forgotPasswordReducer';


interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ForgotPasswordInputModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.forgotPasswordReducer);
    
    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalInputSection}>
                        <TextInput
                            style={styles.modalInput}
                            placeholderTextColor={COLOR_TEXT_TERTIARY}
                            placeholder={state.type}
                            value={state.data}
                            onChangeText={(newText) => dispatch(setData(newText))} />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setVisible(false);
                        }}
                        style={styles.modalButtonContainer}>
                        <Text style={styles.modalButtonText}>Oк</Text>
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
        backgroundColor: COLOR_PRIMARY,
        shadowRadius: 4,
        marginTop: 20,
        marginBottom: 20
    },
    modalButtonText: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 16
    },
    modalContent: {
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        width: '80%',
        borderRadius: 40,
        alignItems: 'center',
    },
    modalInput: {
        flex: 1,
        height: '100%',
        color: COLOR_TEXT_PRIMARY,
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
        backgroundColor: COLOR_BACKGROUND_PRIMARY,
    }
});

export default ForgotPasswordInputModal;