// socket.ts
import { io, Socket } from 'socket.io-client';
import { getTokenFromStorage } from './token';

let socket: Socket;

const connectSocket = async () => {
    const token = await getTokenFromStorage();
    socket = io(process.env.EXPO_PUBLIC_API_SOCKET, {
        extraHeaders: {
            'Authorization': token,
        },
    });
};


connectSocket().then(() => {
    console.log('Socket connected');
});

export { socket };
