import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '@/constants/config';
import { useQueryClient } from '@tanstack/react-query';
import { kudoKeys } from '@/hooks/useKudos';
import { notificationKeys } from '@/hooks/useNotifications';
import { reactionKeys } from '@/hooks/useReactions';
import { userKeys } from '@/hooks/useUsers';
import { UserContext } from './UserContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { me } = useContext(UserContext)
    const queryClient = useQueryClient();

    // Use a ref to keep track of 'me' without re-triggering the useEffect
    const meRef = React.useRef(me);
    useEffect(() => {
        meRef.current = me;
    }, [me]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Initialize socket with /notifications namespace
        const socketUrl = config.BASE_URL.startsWith('http')
            ? `${config.BASE_URL}/notifications`
            : '/notifications';

        const newSocket = io(socketUrl, {
            auth: { token },
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to WebSocket');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from WebSocket');
        });

        // Listen for new kudos (public feed)
        newSocket.on('kudo_created', (newKudo) => {
            // Invalidate kudos query to fetch fresh data or we could prepend
            queryClient.invalidateQueries({ queryKey: kudoKeys.feed() });

            const currentMe = meRef.current;
            console.log('Kudo created received. receiver:', newKudo.receiver.id, 'current user:', currentMe?.id);
            if (newKudo.receiver.id === currentMe?.id) {
                console.log('User is the receiver, invalidating me query');
                queryClient.invalidateQueries({ queryKey: userKeys.me });
            }
        });

        // Listen for reaction updates
        newSocket.on('reaction_updated', (data) => {
            queryClient.invalidateQueries({ queryKey: reactionKeys.summary(data.kudo_id) });
        });

        // Listen for personal notifications
        newSocket.on('notification', () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });

        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [queryClient]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
