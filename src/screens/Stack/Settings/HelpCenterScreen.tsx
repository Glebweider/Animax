import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

// Components
import BackButton from '@Components/buttons/Back';
import ContactUs from '@Components/ContactUs';
import CreateTicketModal from '@Components/modals/CreateTicketModal';

// Data
import {
    COLOR_BACKGROUND_SECONDARY, COLOR_PRIMARY,
    COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY
} from '@Data/constants';

// Utils
import formatDate from '@Utils/formatters/date';
import { i18n } from '@Utils/localization';
import { socket } from '@Utils/socket';

// Interface
import { ITicket } from '@Interfaces/HelpCenterScreen.interface';

// Rest
import useGetUserTickets from '@Rest/user/getUserTickets';


const HelpCenterScreen = ({ navigation }) => {
    const [selectMethodHelp, setSelectMethodHelp] = useState<string>('SUPPORT');

    const [moveLeft, setMoveLeft] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [tickets, setTickets] = useState<ITicket[]>([]);

    const moveValue = useRef(new Animated.Value(0)).current;
    const { getUserTickets } = useGetUserTickets();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getUserTickets();

            if (!response) return;

            const data = await response.json();
            setTickets(data)
        }
        //fetchData();

        socket?.on('ticketCreated', (ticket) => {
            setTickets((prevTickets) => [...prevTickets, ticket]);
        });

        return () => {
            socket?.off('ticketCreated');
        };
    }, []);


    useEffect(() => {
        const animation = Animated.timing(moveValue, {
            toValue: moveLeft ? 0 : 176,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
        });

        animation.start();

        return () => {
            animation.stop();
        };
    }, [moveLeft, moveValue]);

    const TicketCard = ({ item }) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={styles.containerTicket}
                onPress={() => navigation.navigate('ReportScreen', { ticket: item })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/api/cdn/avatar/${item.adminId}` }}
                        style={styles.avatarTicket} />
                    <View style={styles.dataTicket}>
                        <Text style={{ color: COLOR_TEXT_PRIMARY }}>{item.adminNickname}</Text>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ color: '#9CA3AF', marginTop: 5, fontSize: 13 }}>
                            {item.reason}
                        </Text>
                    </View>
                </View>
                <Text style={{ color: '#9CA3AF', marginRight: 15, fontSize: 10, marginTop: 15 }}>
                    {formatDate(item.createdAt)}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} text={i18n.t('profile.helpcenter')} />
            <CreateTicketModal
                visible={openModal}
                setVisible={setOpenModal} />
            <View style={styles.methodsContainer}>
                <View style={styles.methodsTextContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectMethodHelp('SUPPORT');
                            setMoveLeft(true);
                        }}
                        style={styles.methodContainer}>
                        <Text style={selectMethodHelp == 'SUPPORT' ? styles.methodTextActive : styles.methodText}>{i18n.t('helpCenter.support')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectMethodHelp('ContactUs');
                            setMoveLeft(false);
                        }}
                        style={styles.methodContainer}>
                        <Text style={selectMethodHelp == 'ContactUs' ? styles.methodTextActive : styles.methodText}>{i18n.t('helpCenter.contactUs')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line}>
                    <Animated.View style={[styles.lineActive, {
                        transform: [{ translateX: moveValue }],
                    }]} />
                </View>
            </View>
            <View style={styles.containerContent}>
                {moveLeft ?
                    <>
                        <FlatList
                            style={{ width: '92%', flexGrow: 0 }}
                            data={tickets}
                            renderItem={(item) => <TicketCard item={item.item} />}
                        />
                        {tickets.length < 2 && (
                            <TouchableOpacity style={styles.containerButton} onPress={() => setOpenModal(true)}>
                                <Text style={styles.textButton}>{i18n.t('helpCenter.newTicket')}</Text>
                            </TouchableOpacity>
                        )}
                    </>
                    :
                    <ContactUs />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    containerButton: {
        width: '74%',
        padding: 16,
        borderRadius: 15,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    textButton: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit',
    },
    containerTicket: {
        width: '100%',
        height: 90,
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        marginTop: 24,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatarTicket: {
        width: 64,
        height: 64,
        borderRadius: 50,
        marginLeft: 15
    },
    dataTicket: {
        flexDirection: 'column',
        marginLeft: 15,
        maxWidth: 210,
    },
    containerContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    methodsContainer: {
        width: '92%',
        marginTop: 15
    },
    methodsTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    methodContainer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodText: {
        color: COLOR_TEXT_SECONDARY,
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    methodTextActive: {
        color: COLOR_PRIMARY,
        fontSize: 15,
        fontFamily: 'Outfit',
    },
    line: {
        width: '100%',
        backgroundColor: '#35383F',
        height: 3,
        borderRadius: 50,
        marginTop: 18,
    },
    lineActive: {
        width: '50%',
        backgroundColor: COLOR_PRIMARY,
        height: 4,
        borderRadius: 50,
    },
});

export default HelpCenterScreen;