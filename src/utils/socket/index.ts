import { io, Socket } from 'socket.io-client';
import { getTokenFromStorage } from '../functions/token';

let socket: Socket | null = null;
let isConnection: boolean = false;
let connectionAttempts: number = 0;
const MAX_ATTEMPTS = 10;

const connectSocket = async () => {
    let token = await getTokenFromStorage();
    isConnection = false;
    connectionAttempts = 0;

    while (!token) {
        console.log('Токен не найден, повторная попытка через 5 секунд...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        token = await getTokenFromStorage();
    }

    console.log('Токен получен, подключаем сокет...');
    socket = io(process.env.EXPO_PUBLIC_API_SOCKET, {
        reconnection: true,
        reconnectionAttempts: MAX_ATTEMPTS,
        reconnectionDelay: 1500,
        extraHeaders: {
            Authorization: token,
        },
    });

    socket.on('connect', () => {
        isConnection = true;
        console.log('Socket подключен');
    });

    socket.on('disconnect', () => {
        isConnection = false;
        connectionAttempts++;
        if (connectionAttempts >= MAX_ATTEMPTS) {
            socket?.disconnect();
            socket = null;
        }
    });

    socket.on('connect_error', () => {
        connectionAttempts++;
        if (connectionAttempts >= MAX_ATTEMPTS) {
            socket?.disconnect();
            socket = null;
        }
    });
};

//connectSocket();

export { socket, isConnection };