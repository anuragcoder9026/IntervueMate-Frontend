import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

import ChatSidebar from '../components/message/ChatSidebar';
import ChatWindow from '../components/message/ChatWindow';
import FullscreenImageModal from '../components/message/FullscreenImageModal';
import MessageSettings from '../components/message/MessageSettings';
import { useCall } from '../context/CallContext';

// Subtle pattern for chat background
const chatBgStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a2332' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    backgroundColor: '#111827', // Matched to sidebar for seamless look
};

const messageSendSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
messageSendSound.volume = 0.5;
const messageReceiveSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
messageReceiveSound.volume = 0.5;

const MessagesPage = () => {
    const { conversationId: urlConversationId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { socket, onlineUsers } = useSocket() || {};
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(360);
    const [isResizing, setIsResizing] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [galleryData, setGalleryData] = useState(null);
    const [downloadingFiles, setDownloadingFiles] = useState({});
    const [downloadedFiles, setDownloadedFiles] = useState({});
    const [abortControllers, setAbortControllers] = useState({});

    // Data state
    const [conversations, setConversations] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [searchParams] = useSearchParams();
    const sharePostId = searchParams.get('sharePostId');
    const [selectedShareIds, setSelectedShareIds] = useState([]);

    // Typing indicator
    const [typingUsers, setTypingUsers] = useState({});
    const typingTimeoutRef = useRef(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Use global call state
    const {
        callStatus,
        startCall,
    } = useCall();

    // Track activity on messaging page
    useEffect(() => {
        if (socket && user) {
            socket.emit('enter_messaging');
            return () => {
                socket.emit('leave_messaging');
            };
        }
    }, [socket, user]);

    // Resizer logic
    const startResizing = useCallback((e) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e) => {
        if (isResizing) {
            let newWidth = e.clientX;
            if (newWidth < 280) newWidth = 280;
            if (newWidth > 500) newWidth = 500;
            setSidebarWidth(newWidth);
        }
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, resize, stopResizing]);

    // ---- CLICK OUTSIDE EMOJI PICKER ----
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    // ---- FETCH CONVERSATIONS + FOLLOWING USERS ----
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [convRes, followingRes] = await Promise.all([
                    api.get('/messages/conversations'),
                    api.get('/messages/following')
                ]);
                setConversations(convRes.data.data);
                setFollowingUsers(followingRes.data.data || []);
            } catch (err) {
                console.error('Failed to load data:', err);
            } finally {
                setLoadingConversations(false);
            }
        };
        fetchData();
    }, []);

    // ---- HANDLE URL CONVERSATION ID ----
    useEffect(() => {
        if (!loadingConversations && urlConversationId && conversations) {
            const conv = conversations.find(c => c._id === urlConversationId);
            if (conv && (!activeConversation || activeConversation._id !== urlConversationId)) {
                setActiveConversation(conv);
                setIsMobileChatOpen(true);
            }
        }
    }, [urlConversationId, conversations, loadingConversations, activeConversation]);

    // ---- FETCH MESSAGES when active conversation changes ----
    useEffect(() => {
        if (!activeConversation) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                const res = await api.get(`/messages/${activeConversation._id}`);
                setMessages(res.data.data);
            } catch (err) {
                console.error('Failed to load messages:', err);
                toast.error('Failed to load messages');
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchMessages();

        // Mark as read
        if (socket) {
            socket.emit('mark_read', { conversationId: activeConversation._id });
        }
    }, [activeConversation?._id]);

    // ---- SOCKET EVENT LISTENERS ----
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (msg) => {
            const myId = user?._id || user?.id;
            const senderId = msg.sender?._id || msg.sender;
            if (senderId !== myId) {
                if (localStorage.getItem('interviewmate_messaging_sound_enabled') !== 'false') {
                    messageReceiveSound.currentTime = 0;
                    messageReceiveSound.play().catch(() => { });
                }
            }

            if (activeConversation && msg.conversationId === activeConversation._id) {
                setMessages(prev => {
                    const exists = prev.some(m => m._id === msg._id || (msg.tempId && m.tempId === msg.tempId));
                    if (exists) {
                        return prev.map(m => (m.tempId && m.tempId === msg.tempId) ? msg : m);
                    }
                    return [...prev, msg];
                });
                socket.emit('mark_read', { conversationId: msg.conversationId });
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        };

        const handleConversationUpdated = (updatedConv) => {
            setConversations(prev => {
                const exists = prev.some(c => c._id === updatedConv._id);
                let updated;
                if (exists) {
                    updated = prev.map(c => c._id === updatedConv._id ? updatedConv : c);
                } else {
                    updated = [updatedConv, ...prev];
                }
                return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            });
        };

        const handleUserTyping = ({ conversationId, userId, userName }) => {
            setTypingUsers(prev => ({ ...prev, [conversationId]: { userId, userName } }));
        };

        const handleUserStopTyping = ({ conversationId }) => {
            setTypingUsers(prev => { const u = { ...prev }; delete u[conversationId]; return u; });
        };

        const handleMessageStatusUpdate = ({ messageId, conversationId, status }) => {
            if (activeConversation && conversationId === activeConversation._id) {
                setMessages(prev => prev.map(msg =>
                    msg._id === messageId ? { ...msg, status } : msg
                ));
            }
        };

        const handleMessagesRead = ({ conversationId }) => {
            if (activeConversation && conversationId === activeConversation._id) {
                setMessages(prev => prev.map(msg => {
                    if (isMyMessage(msg) && msg.status !== 'read') {
                        return { ...msg, status: 'read' };
                    }
                    return msg;
                }));
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('conversation_updated', handleConversationUpdated);
        socket.on('user_typing', handleUserTyping);
        socket.on('user_stop_typing', handleUserStopTyping);
        socket.on('messages_read', handleMessagesRead);
        socket.on('message_status_update', handleMessageStatusUpdate);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('conversation_updated', handleConversationUpdated);
            socket.off('user_typing', handleUserTyping);
            socket.off('user_stop_typing', handleUserStopTyping);
            socket.off('messages_read', handleMessagesRead);
            socket.off('message_status_update', handleMessageStatusUpdate);
        };
    }, [socket, activeConversation?._id, user?._id]); // Removed callStatus from deps to avoid re-binding triggers

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [messages.length]);

    // ---- SEND MESSAGE ----
    const checkBlocked = () => {
        if (!activeConversation || !user) return false;
        const other = getOtherParticipant(activeConversation);
        if (!other) return false;
        const otherId = other._id;
        const myBlockedUsers = user.blockedUsers || [];
        const myBlockedBy = user.blockedBy || [];
        return myBlockedUsers.some(id => (id._id || id).toString() === otherId) ||
            myBlockedBy.some(id => (id._id || id).toString() === otherId);
    };

    const handleSend = async (directFile = null) => {
        if (checkBlocked()) {
            toast.error('This conversation is blocked.');
            return;
        }
        if ((!messageInput.trim() && selectedFiles.length === 0 && !directFile) || !activeConversation || !socket) return;

        const tempId = `temp_${Date.now()}`;
        const text = messageInput.trim();
        const myId = user?._id || user?.id;

        // Play sending sound
        if (localStorage.getItem('interviewmate_messaging_sound_enabled') !== 'false') {
            messageSendSound.currentTime = 0;
            messageSendSound.play().catch(() => { });
        }

        // Merge direct file if any
        let filesToUpload = [...selectedFiles];
        if (directFile) {
            filesToUpload.push({
                file: directFile,
                previewUrl: URL.createObjectURL(directFile),
                type: 'audio'
            });
        }

        if (filesToUpload.length === 0 && !text) return;

        // Step 1: Optimistic UI
        const optimisticMsg = {
            _id: tempId,
            tempId,
            conversationId: activeConversation._id,
            sender: { _id: myId, name: user.name, avatar: user.avatar },
            receiver: getOtherParticipant(activeConversation)?._id,
            type: filesToUpload.length > 0 ? 'media' : 'text',
            text,
            media: filesToUpload.map(f => ({ url: f.previewUrl, type: f.type, name: f.file.name })),
            status: 'sending',
            createdAt: new Date().toISOString(),
            sending: true,
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setMessageInput('');
        const filesToSend = [...filesToUpload];
        setSelectedFiles([]);

        let uploadedMedia = [];

        // Step 2: Upload files if any
        if (filesToSend.length > 0) {
            const formData = new FormData();
            filesToSend.forEach(f => formData.append('files', f.file));

            try {
                const uploadToast = toast.loading(`Uploading ${filesToSend.length} ${filesToSend.length === 1 ? 'file' : 'files'}...`);
                const res = await api.post('/messages/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.dismiss(uploadToast);
                uploadedMedia = res.data.data.map(item => ({
                    url: item.url,
                    type: item.type,
                    name: item.name
                }));
            } catch (err) {
                console.error('Upload error:', err);
                toast.error('Failed to upload files');
                setMessages(prev => prev.filter(m => m._id !== tempId));
                return;
            }
        }

        // Step 3: Send via Socket
        const recipientId = getOtherParticipant(activeConversation)?._id;
        socket.emit('send_message', {
            conversationId: activeConversation._id,
            text,
            type: uploadedMedia.length > 0 ? 'media' : 'text',
            media: uploadedMedia,
            tempId
        });
        socket.emit('stop_typing', { conversationId: activeConversation._id, recipientId });

        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    // ---- TYPING ----
    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
        if (!socket || !activeConversation) return;
        const recipientId = getOtherParticipant(activeConversation)?._id;
        socket.emit('typing', { conversationId: activeConversation._id, recipientId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { conversationId: activeConversation._id, recipientId });
        }, 2000);
    };

    const onEmojiClick = (emojiObject) => {
        setMessageInput(prev => prev + emojiObject.emoji);
        inputRef.current?.focus();
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
        const validFiles = files.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`File ${file.name} is too large. Max limit is 100MB.`);
                return false;
            }
            return true;
        });

        if (!validFiles.length) return;
        setShowEmojiPicker(false);

        const newSelectedFiles = validFiles.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' :
                file.type.startsWith('audio/') ? 'audio' :
                    file.type.startsWith('video/') ? 'video' : 'file'
        }));

        setSelectedFiles(prev => [...prev, ...newSelectedFiles]);

        if (imageInputRef.current) imageInputRef.current.value = '';
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(prev => {
            const newArray = [...prev];
            URL.revokeObjectURL(newArray[index].previewUrl);
            newArray.splice(index, 1);
            return newArray;
        });
    };

    // ---- START CONVERSATION with a followed user ----
    const startConversation = async (targetUserId) => {
        try {
            const res = await api.post('/messages/conversations', { targetUserId });
            const conv = res.data.data;
            setActiveConversation(conv);
            setIsMobileChatOpen(true);
            setConversations(prev => {
                if (prev.some(c => c._id === conv._id)) return prev;
                return [conv, ...prev];
            });
            navigate(`/messages/${conv._id}`, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to start conversation');
        }
    };

    // ---- DELETE CONVERSATION ----
    const handleDeleteConversation = async (conversationId) => {
        try {
            await api.delete(`/messages/conversations/${conversationId}`);
            setConversations(prev => prev.filter(c => c._id !== conversationId));
            if (activeConversation?._id === conversationId) {
                setActiveConversation(null);
                setIsMobileChatOpen(false);
                navigate('/messages', { replace: true });
            }
            toast.success('Conversation deleted');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to delete conversation');
        }
    };

    // ---- SHARE LOGIC ----
    const toggleShareSelection = (id) => {
        setSelectedShareIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleShareSend = async () => {
        if (selectedShareIds.length === 0) return;
        const postUrl = `${window.location.origin}/post/${sharePostId}`;
        const messageText = `Check out this post: ${postUrl}`;

        const toastId = toast.loading(`Sharing with ${selectedShareIds.length} user(s)...`);

        try {
            for (const id of selectedShareIds) {
                let convId = id;
                // Check if this is a user ID (from following) or conversation ID
                const isConversation = conversations.some(c => c._id === id);

                if (!isConversation) {
                    // Create conversation first
                    const res = await api.post('/messages/conversations', { targetUserId: id });
                    convId = res.data.data._id;
                }

                socket.emit('send_message', {
                    conversationId: convId,
                    text: messageText,
                    type: 'text'
                });
            }

            // Increment share count in DB
            try {
                await api.put(`/posts/${sharePostId}/share`, { count: selectedShareIds.length });
            } catch (err) {
                console.error('Failed to increment share count:', err);
            }

            toast.update(toastId, {
                render: `Successfully shared with ${selectedShareIds.length} user(s)!`,
                type: 'success',
                isLoading: false,
                autoClose: 3000
            });

            // Redirect back to normal messages
            navigate('/messages', { replace: true });
            setSelectedShareIds([]);
        } catch (err) {
            console.error('Share error:', err);
            toast.update(toastId, {
                render: 'Failed to share with some users',
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    // ---- HANDLERS ----
    const handleDownload = async (mediaItem) => {
        try {
            const controller = new AbortController();
            setAbortControllers(prev => ({ ...prev, [mediaItem.url]: controller }));
            setDownloadingFiles(prev => ({ ...prev, [mediaItem.url]: true }));

            const response = await fetch(mediaItem.url, { signal: controller.signal });
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = mediaItem.name || 'download';
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            setDownloadedFiles(prev => ({ ...prev, [mediaItem.url]: true }));
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Download cancelled');
            } else {
                console.error('Download failed:', error);
                toast.error('Failed to download file');
            }
        } finally {
            setDownloadingFiles(prev => ({ ...prev, [mediaItem.url]: false }));
            setAbortControllers(prev => {
                const newObj = { ...prev };
                delete newObj[mediaItem.url];
                return newObj;
            });
        }
    };

    const cancelDownload = (mediaItem) => {
        if (abortControllers[mediaItem.url]) {
            abortControllers[mediaItem.url].abort();
        }
    };

    const handleCallStart = (type) => {
        if (!activeConversation) return;
        const targetUser = getOtherParticipant(activeConversation);
        if (targetUser) {
            startCall(targetUser, type, activeConversation._id);
        }
    };

    // ---- HELPERS ----
    const getOtherParticipant = (conv) => {
        if (!conv) return null;
        const myId = user?._id || user?.id;
        if (conv.user1?._id === myId || conv.user1 === myId) return conv.user2;
        return conv.user1;
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatMessageTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const isMyMessage = (msg) => {
        const myId = user?._id || user?.id;
        const senderId = msg.sender?._id || msg.sender;
        return senderId === myId;
    };

    const getMessageStatus = (msg) => {
        if (msg.sending) return 'sending';
        if (!isMyMessage(msg)) return null;
        return msg.status || 'sent';
    };

    const otherParticipant = activeConversation ? getOtherParticipant(activeConversation) : null;
    const isOtherOnline = otherParticipant && onlineUsers?.has(otherParticipant._id);
    const isOtherTyping = activeConversation && typingUsers[activeConversation._id];
    const isSettingsPage = urlConversationId === 'settings';

    // Block status check
    const isConversationBlocked = (() => {
        if (!otherParticipant || !user) return false;
        const otherId = otherParticipant._id;
        const myBlockedUsers = user.blockedUsers || [];
        const myBlockedBy = user.blockedBy || [];
        return myBlockedUsers.some(id => (id._id || id).toString() === otherId) ||
            myBlockedBy.some(id => (id._id || id).toString() === otherId);
    })();

    return (
        <div className="flex flex-col h-screen bg-bg-primary font-inter overflow-hidden text-text-primary pb-12 lg:pb-0">
            <Navbar />
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                <ChatSidebar
                    user={user}
                    conversations={conversations}
                    followingUsers={followingUsers}
                    activeConversation={activeConversation}
                    setActiveConversation={setActiveConversation}
                    onlineUsers={onlineUsers}
                    typingUsers={typingUsers}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    loadingConversations={loadingConversations}
                    startConversation={startConversation}
                    setIsMobileChatOpen={setIsMobileChatOpen}
                    sidebarWidth={sidebarWidth}
                    startResizing={startResizing}
                    isResizing={isResizing}
                    getOtherParticipant={getOtherParticipant}
                    formatTime={formatTime}
                    isMobileChatOpen={isMobileChatOpen}
                    handleDeleteConversation={handleDeleteConversation}
                    // Share props
                    isShareMode={!!sharePostId}
                    selectedShareIds={selectedShareIds}
                    toggleShareSelection={toggleShareSelection}
                    handleShareSend={handleShareSend}
                />

                {isSettingsPage ? (
                    <MessageSettings />
                ) : (
                    <ChatWindow
                        user={user}
                        activeConversation={activeConversation}
                        messages={messages}
                        loadingMessages={loadingMessages}
                        otherParticipant={otherParticipant}
                        isOtherOnline={isOtherOnline}
                        isOtherTyping={isOtherTyping}
                        setIsMobileChatOpen={setIsMobileChatOpen}
                        handleSend={handleSend}
                        messageInput={messageInput}
                        handleInputChange={handleInputChange}
                        handleKeyDown={handleKeyDown}
                        showEmojiPicker={showEmojiPicker}
                        setShowEmojiPicker={setShowEmojiPicker}
                        onEmojiClick={onEmojiClick}
                        selectedFiles={selectedFiles}
                        removeSelectedFile={removeSelectedFile}
                        handleFileSelect={handleFileSelect}
                        imageInputRef={imageInputRef}
                        fileInputRef={fileInputRef}
                        inputRef={inputRef}
                        emojiPickerRef={emojiPickerRef}
                        messagesEndRef={messagesEndRef}
                        chatContainerRef={chatContainerRef}
                        chatBgStyle={chatBgStyle}
                        formatMessageTime={formatMessageTime}
                        isMyMessage={isMyMessage}
                        getMessageStatus={getMessageStatus}
                        setGalleryData={setGalleryData}
                        handleDownload={handleDownload}
                        cancelDownload={cancelDownload}
                        downloadingFiles={downloadingFiles}
                        downloadedFiles={downloadedFiles}
                        isBlocked={isConversationBlocked}
                        startCall={handleCallStart}
                    />
                )}
            </div>

            <FullscreenImageModal
                galleryData={galleryData}
                setGalleryData={setGalleryData}
            />
        </div>
    );
};

export default MessagesPage;
