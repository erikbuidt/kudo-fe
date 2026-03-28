import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '@/constants/config';
import { useQueryClient } from '@tanstack/react-query';
import { kudoKeys } from '@/hooks/useKudos';
import { notificationKeys } from '@/hooks/useNotifications';
import { reactionKeys } from '@/hooks/useReactions';
import { toast } from 'react-toastify';

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
    const queryClient = useQueryClient();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // Initialize socket with /notifications namespace
        const newSocket = io(`${config.BASE_URL}/notifications`, {
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
            toast.info(`🎉 New Kudo from ${newKudo.sender.username}!`, {
                position: "bottom-right",
                autoClose: 3000,
            });
        });

        // Listen for reaction updates
        newSocket.on('reaction_updated', (data) => {
            queryClient.invalidateQueries({ queryKey: reactionKeys.summary(data.kudo_id) });
        });

        // Listen for personal notifications
        newSocket.on('notification', (payload) => {
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
