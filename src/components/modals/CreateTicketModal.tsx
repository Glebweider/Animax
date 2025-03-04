import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { socket } from '@Utils/socket';

interface ModalProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTicketModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
    const [textReason, setTextReason] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<{ id: string; text: string; }[]>([]);
    const [isEnabledButton, setEnabledButton] = useState<boolean>(true);
    const tags = [
        { id: '0', text: 'Error at the entrance to the account' },
        { id: '1', text: 'Problem with payment' },
        { id: '2', text: 'Error in the application' },
        { id: '3', text: 'Question about the functionality' },
        { id: '4', text: 'Other' }
    ];

    useEffect(() => {
        if (textReason.length > 4 && selectedTags.length >= 1) {
            setEnabledButton(false);
        }
    }, [textReason, selectedTags]);
  
    const createTicket = () => {
        socket.emit('createTicket', { 
            reason: textReason,
            tags: selectedTags
        });
        setVisible(false);
    };    

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.titleText}>Create Ticket</Text>
                    <View style={styles.emailSection}>
                        <TextInput
                            style={styles.emailInput}
                            placeholderTextColor="#9E9E9E"
                            placeholder="Reason"
                            keyboardType="default"
                            onChangeText={(newText) => setTextReason(newText)}
                            value={textReason}/>
                    </View>
                    <View style={styles.tagsContainer}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={styles.tagsScrollView}>
                            {tags.map((tag) => (
                                <TouchableOpacity
                                    style={[
                                        styles.tagContainer, 
                                        selectedTags.some(selectedTag => selectedTag.id === tag.id) && styles.selectedTagContainer
                                    ]}
                                    key={tag.id}
                                    onPress={() => {
                                        setSelectedTags(prevTags => {
                                            if (prevTags.some(selectedTag => selectedTag.id === tag.id)) {
                                                return prevTags.filter(selectedTag => selectedTag.id !== tag.id);
                                            } else {
                                                return [...prevTags, tag];
                                            }
                                        });
                                    }}>
                                    <Text 
                                        style={[
                                            styles.tagText, 
                                            selectedTags.some(selectedTag => selectedTag.id === tag.id) && styles.selectedTagText
                                        ]}>
                                        {tag.text}
                                    </Text>                                  
                                </TouchableOpacity>
                            ))}                    
                        </ScrollView>
                    </View>
                    <View style={styles.containerButtons}>
                        <TouchableOpacity 
                            style={styles.containerButtonCancel}
                            onPress={() => setVisible(false)}>
                            <Text style={styles.textButton}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.containerButtonCreate}
                            disabled={isEnabledButton}
                            onPress={createTicket}>
                            <Text style={styles.textButton}>Create Ticket</Text>
                        </TouchableOpacity>                        
                    </View>
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
    tagsContainer: {
        width: '94%',
        height: 36,
        marginLeft: 10,
        alignItems: 'center',
    },
    selectedTagText: {
        color: '#fff'
    },
    selectedTagContainer: {
        backgroundColor: '#06C149'
    },
    tagsScrollView: {
        width: '100%',
        height: 36,
        flexGrow: 1,
        paddingRight: 10,  
    },
    tagContainer: {
        height: 36,
        borderColor: '#06C149',
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        paddingRight: 7,
        paddingLeft: 7,
    },
    tagText: {
        color: '#06C149',
        fontFamily: 'Outfit',
        fontSize: 10
    },
    containerTag: {
        margin: 7,
        marginTop: 10,
        width: 150,
        height: 200,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: '#1F222A'
    },
    titleText: {
        marginTop: 16,
        color: '#fff',
        fontFamily: 'Outfit',
        fontSize: 18,
        width: '80%',
        textAlign: 'center'
    },
    containerButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        marginBottom: 20,
    },
    containerButtonCancel: {
        width: '44%',
        padding: 14,
        borderRadius: 15,
        backgroundColor: '#35383F',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    containerButtonCreate: {
        width: '44%',
        padding: 14,
        borderRadius: 15,
        backgroundColor: '#0E9E42',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    textButton: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit',
    },
    modalContent: {
        backgroundColor: '#1F222A',
        width: '90%',
        minHeight: '37%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
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
    },
    emailSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 64,
        borderRadius: 20,
        backgroundColor: '#1F222A',
        borderColor: '#35383F',
        borderWidth: 1
    },    
    emailInput: {
        flex: 1,
        height: '100%',
        color: '#fff',
        fontFamily: 'Outfit',
        marginLeft: 22, 
    },
});

export default CreateTicketModal;