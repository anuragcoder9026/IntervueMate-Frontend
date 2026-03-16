import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = `${import.meta.env.VITE_BACKEND_URI}`;

export const SocketProvider = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const socketRef = useRef(null);

    useEffect(() => {
        if (user && !socketRef.current) {
            const newSocket = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
            });

            newSocket.on('connect', () => {
                console.log('🔌 Socket connected:', newSocket.id);
            });

            newSocket.on('online_users', (users) => {
                setOnlineUsers(new Set(users));
            });

            newSocket.on('user_online', (userId) => {
                setOnlineUsers(prev => new Set([...prev, userId]));
            });

            newSocket.on('user_offline', (userId) => {
                setOnlineUsers(prev => {
                    const updated = new Set(prev);
                    updated.delete(userId);
                    return updated;
                });
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

            socketRef.current = newSocket;
            setSocket(newSocket);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        };
    }, [user]);

    // Disconnect when user logs out
    useEffect(() => {
        if (!user && socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setOnlineUsers(new Set());
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
