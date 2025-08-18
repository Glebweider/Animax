import { RouteProp, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';

// Stack
import { IMessage, ITicket } from '@Stack/Settings/HelpCenterScreen';

// Components
import BackButton from '@Components/buttons/Back';

// Redux
import { RootState } from '@Redux/store';

// Utils
import encryptor from '@Utils/crypto/encryptor';
import decryptor from '@Utils/crypto/decryptor';
import sendNotification from '@Utils/notifications';
import { socket } from '@Utils/socket';


type TicketDetailsRouteProp = RouteProp<{ TicketDetails: { ticket: ITicket } }, 'TicketDetails'>;

const ReportScreen = ({ navigation }) => {
    const route = useRoute<TicketDetailsRouteProp>();
    const { ticket } = route.params;

    const [messages, setMessages] = useState<IMessage[]>(ticket.messages);
    const [newMessage, setNewMessage] = useState<string>('');
    const userState = useSelector((state: RootState) => state.userReducer);

    useEffect(() => {
        socket.emit('connectToTicket', ticket.id);

        socket.on('exception', (error) => {
            alert(error.message);
        });

        socket.on('newMessage', (data: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, data]);
            if (data.senderId != userState.uuid) {
                sendNotification(ticket.adminNickname, decryptor(data.text));
            }
        });

        return () => {
            socket.off('exception');
            socket.off('newMessage');
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('sendMessage', { message: encryptor(newMessage), ticketId: ticket.id });
            setNewMessage('');
        }
    };


    const renderMessage = ({ item }: { item: IMessage }) => (
        <View
            style={[
                styles.messageContainer,
                item.senderId === userState.uuid ? styles.userMessage : styles.adminMessage,
            ]}>
            <Text style={styles.messageText}>{decryptor(item.text)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={`Chat ${ticket.reason}`} />
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messagesContainer}
                style={{ width: '94%' }} />
            <View style={styles.inputContainer}>
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholderTextColor="#9E9E9E"
                    placeholder="Type a message..."
                    style={styles.input} />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#181A20',
    },
    messagesContainer: {
        flexGrow: 1,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 8,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#333',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#333333',
    },
    adminMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#2B2A2A',
    },
    messageText: {
        color: '#FFF',
        fontFamily: 'Outfit',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10
    },
    input: {
        flex: 1,
        padding: 14,
        borderRadius: 15,
        backgroundColor: '#1F222A',
        color: '#fff',
        fontFamily: 'Outfit',
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 15,
    },
    sendText: {
        color: '#FFF',
        fontFamily: 'Outfit',
    },
});

export default ReportScreen;