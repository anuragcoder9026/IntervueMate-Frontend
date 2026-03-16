import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

const useSessionSocket = (eventId, options = { isWatcher: false, initialMicMuted: false, initialVideoOff: false }) => {
    const { socket } = useSocket();
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [sessionStatus, setSessionStatus] = useState('scheduled');
    const [whiteboardHistory, setWhiteboardHistory] = useState([]);
    const [whiteboardMaximized, setWhiteboardMaximized] = useState(false);

    useEffect(() => {
        if (!socket || !eventId) return;

        // Join the session
        socket.emit('join_session', { 
            eventId, 
            isWatcher: options.isWatcher,
            micMuted: options.initialMicMuted,
            videoOff: options.initialVideoOff
        });

        // Listeners
        socket.on('session_participants', (data) => {
            // Mark the screen sharing user from DB state
            const screenSharingUserId = data.screenSharingUser ? String(data.screenSharingUser) : null;
            const participantsWithScreenShare = data.participants.map(p => ({
                ...p,
                isSharingScreen: screenSharingUserId ? String(p._id) === screenSharingUserId : (p.isSharingScreen || false)
            }));
            setParticipants(participantsWithScreenShare);
            if (data.whiteboardMaximized !== undefined) {
                setWhiteboardMaximized(!!data.whiteboardMaximized);
            }
            if (data.whiteboardHistory) {
                setWhiteboardHistory(data.whiteboardHistory);
            }
            if (data.messages) {
                setMessages(data.messages.map(m => ({
                    ...m,
                    sender: { ...m.sender, _id: String(m.sender._id) }
                })));
            }
        });

        socket.on('user_joined_session', (data) => {
            const userId = String(data.user._id);
            setParticipants((prev) => {
                if (prev.find(p => String(p._id) === userId)) return prev;
                return [...prev, { ...data.user, _id: userId }];
            });
        });

        socket.on('user_left_session', (data) => {
            const userId = String(data.userId);
            setParticipants((prev) => prev.filter(p => String(p._id) !== userId));
        });

        socket.on('receive_session_message', (message) => {
            setMessages((prev) => [...prev, { 
                ...message, 
                sender: { ...message.sender, _id: String(message.sender._id) } 
            }]);
        });

        socket.on('user_media_status_updated', (data) => {
            const userId = String(data.userId);
            setParticipants((prev) => prev.map(p => 
                String(p._id) === userId ? { ...p, micMuted: data.micMuted, videoOff: data.videoOff } : p
            ));
        });

        socket.on('session_screen_share', (data) => {
            const userId = String(data.userId);
            setParticipants((prev) => prev.map(p => {
                if (data.isSharing) {
                    // When someone starts sharing, they become the SOLE sharer
                    return { ...p, isSharingScreen: String(p._id) === userId };
                }
                // When someone stops, only clear that person
                return String(p._id) === userId ? { ...p, isSharingScreen: false } : p;
            }));
        });

        socket.on('event_status_updated', (data) => {
            if (data.eventId === eventId) {
                setSessionStatus(data.status);
            }
        });

        socket.on('whiteboard_maximized_status', ({ maximized }) => {
            setWhiteboardMaximized(maximized);
        });

        socket.on('session_ended', () => {
            // Signal to the room page that it should redirect
            setSessionStatus('completed');
        });

        return () => {
            socket.emit('leave_session', { eventId });
            socket.off('user_joined_session');
            socket.off('user_left_session');
            socket.off('receive_session_message');
            socket.off('user_media_status_updated');
            socket.off('event_status_updated');
            socket.off('whiteboard_maximized_status');
            socket.off('session_ended');
            socket.off('session_screen_share');
        };
    }, [socket, eventId]);

    const sendMessage = useCallback((text) => {
        if (socket && eventId) {
            socket.emit('send_session_message', { eventId, text });
        }
    }, [socket, eventId]);

    const updateMediaStatus = useCallback((micMuted, videoOff) => {
        if (socket && eventId) {
            socket.emit('update_session_media_status', { eventId, micMuted, videoOff });
        }
    }, [socket, eventId]);

    const startSession = useCallback(async () => {
        if (eventId) {
            try {
                const { data } = await api.put(`/events/${eventId}/start`);
                return data.success;
            } catch (err) {
                console.error('Failed to start session via API:', err);
                return false;
            }
        }
    }, [eventId]);

    const endSession = useCallback(async () => {
        if (eventId) {
            try {
                const { data } = await api.put(`/events/${eventId}/end`);
                if (data.success) {
                    // Notify everyone in the room via socket
                    if (socket) {
                        socket.emit('end_session', { eventId });
                    }
                }
                return data.success;
            } catch (err) {
                console.error('Failed to end session via API:', err);
                return false;
            }
        }
    }, [eventId, socket]);

    const toggleWhiteboard = useCallback((maximized) => {
        if (socket && eventId) {
            socket.emit('whiteboard_toggle_maximized', { eventId, maximized });
        }
    }, [socket, eventId]);

    return {
        participants,
        messages,
        sessionStatus,
        whiteboardHistory,
        whiteboardMaximized,
        setParticipants,
        sendMessage,
        updateMediaStatus,
        startSession,
        endSession,
        toggleWhiteboard
    };
};

export default useSessionSocket;
