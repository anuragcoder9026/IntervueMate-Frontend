import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Hash, BellOff, Pin, Search, PlusCircle, Smile, ImageIcon, Code, Type, Menu, Users, Send, Loader2, X, ChevronLeft, ChevronRight, Maximize2, Play, Download, FileText, FileCode, File, Music, FileJson, FileArchive, Check, ChevronDown, Copy, Trash2, Circle, CheckCircle2 } from 'lucide-react';
import { useSocket } from '../../../context/SocketContext';
import { getDiscussionMessages, receiveGroupMessage, removeGroupMessagesLocally, togglePinGroupMessage, getPinnedMessages } from '../../../store/groupSlice';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../../../utils/api';
import EmojiPicker, { Theme } from 'emoji-picker-react';

const DiscussionChatArea = ({ discussion, onToggleLeft, onToggleRight, isLeftOpen, isRightOpen, navigatedMessageId, isAdminMode }) => {
    const dispatch = useDispatch();
    const { socket } = useSocket();
    const { user } = useSelector((state) => state.auth);
    const { currentDiscussionMessages, isMessagesLoading, currentGroup } = useSelector((state) => state.group);

    const [messageText, setMessageText] = useState('');
    const [inputMode, setInputMode] = useState('text'); // 'text' OR 'code'
    const [isUploading, setIsUploading] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [fileAccept, setFileAccept] = useState('*/*');
    const [downloadingFiles, setDownloadingFiles] = useState({});
    const [downloadedFiles, setDownloadedFiles] = useState({});
    const [showScrollBottom, setShowScrollBottom] = useState(false);
    const scrollContainerRef = useRef(null);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const emojiPickerRef = useRef(null);
    const deleteMenuRef = useRef(null);
    const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);

    // Lightbox state
    const [lightbox, setLightbox] = useState({ isOpen: false, images: [], currentIndex: 0 });
    const [copiedId, setCopiedId] = useState(null);
    const [selectedMessageIds, setSelectedMessageIds] = useState([]);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
        setShowScrollBottom(!isNearBottom);
    };

    useEffect(() => {
        if (discussion?._id && currentGroup?._id) {
            dispatch(getDiscussionMessages({ groupId: currentGroup._id, discussionId: discussion._id }));
        }
    }, [discussion?._id, currentGroup?._id, dispatch]);

    useEffect(() => {
        if (socket && discussion?._id) {
            socket.emit('join_discussion', discussion._id);

            const handleNewMessage = (msg) => {
                if (msg.discussionId === discussion._id) {
                    dispatch(receiveGroupMessage(msg));
                }
            };

            socket.on('receive_group_message', handleNewMessage);

            return () => {
                socket.emit('leave_discussion', discussion._id);
                socket.off('receive_group_message', handleNewMessage);
            };
        }
    }, [socket, discussion?._id, dispatch]);

    useEffect(() => {
        // Use auto for first load, smooth for subsequent messages
        const behavior = currentDiscussionMessages.length <= 50 ? "auto" : "smooth";
        scrollToBottom(behavior);
    }, [currentDiscussionMessages]);

    useEffect(() => {
        if (navigatedMessageId && navigatedMessageId.id) {
            const messageElement = document.getElementById(`message-${navigatedMessageId.id}`);
            if (messageElement) {
                messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setSelectedMessageIds([navigatedMessageId.id]);

                // Add a temporary highlight effect
                messageElement.classList.add('ring-2', 'ring-amber-400/50', 'ring-offset-2', 'ring-offset-[#171C26]');
                setTimeout(() => {
                    messageElement.classList.remove('ring-2', 'ring-amber-400/50', 'ring-offset-2', 'ring-offset-[#171C26]');
                }, 2000);
            }
        }
    }, [navigatedMessageId, currentDiscussionMessages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!messageText.trim() && pendingFiles.length === 0) return;
        if (!socket || !discussion?._id) return;

        let uploadedMedia = [];

        if (pendingFiles.length > 0) {
            setIsUploading(true);
            const formData = new FormData();
            pendingFiles.forEach(pf => {
                formData.append('files', pf.file);
            });

            try {
                const res = await api.post(`/groups/${currentGroup._id}/discussions/${discussion._id}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.data.success && res.data.files) {
                    uploadedMedia = res.data.files;
                }
            } catch (error) {
                console.error('File upload error:', error);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        const messageData = {
            discussionId: discussion._id,
            groupId: currentGroup._id,
            text: messageText,
            type: inputMode === 'code' ? 'code' : (uploadedMedia.length > 0 ? 'media' : 'text'),
            media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
            tempId: Date.now().toString()
        };

        socket.emit('send_group_message', messageData);
        setMessageText('');
        setInputMode('text');

        pendingFiles.forEach(pf => {
            if (pf.previewUrl) URL.revokeObjectURL(pf.previewUrl);
        });
        setPendingFiles([]);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        const newFiles = files.map(file => ({
            file,
            id: Date.now() + Math.random().toString(36).substring(7),
            type: file.type.split('/')[0],
            previewUrl: file.type.startsWith('image/') || file.type.startsWith('video/') ? URL.createObjectURL(file) : null
        }));

        setPendingFiles(prev => [...prev, ...newFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePendingFile = (id) => {
        setPendingFiles(prev => {
            const file = prev.find(f => f.id === id);
            if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
            return prev.filter(f => f.id !== id);
        });
    };

    const triggerFileSelect = (accept) => {
        setFileAccept(accept);
        setIsAttachmentMenuOpen(false);
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 0);
    };

    const openLightbox = (images, index) => {
        setLightbox({ isOpen: true, images, currentIndex: index });
    };

    const closeLightbox = () => {
        setLightbox({ ...lightbox, isOpen: false });
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setLightbox(prev => ({
            ...prev,
            currentIndex: (prev.currentIndex + 1) % prev.images.length
        }));
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setLightbox(prev => ({
            ...prev,
            currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
        }));
    };

    const getFileIcon = (fileName, size = 20) => {
        const ext = fileName?.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf': return <FileText size={size} className="text-red-400" />;
            case 'doc':
            case 'docx': return <FileText size={size} className="text-blue-400" />;
            case 'xls':
            case 'xlsx': return <FileText size={size} className="text-emerald-400" />;
            case 'ppt':
            case 'pptx': return <FileText size={size} className="text-orange-400" />;
            case 'zip':
            case 'rar':
            case '7z': return <FileArchive size={size} className="text-yellow-400" />;
            case 'mp3':
            case 'wav':
            case 'ogg': return <Music size={size} className="text-purple-400" />;
            case 'json': return <FileJson size={size} className="text-yellow-200" />;
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
            case 'py':
            case 'html':
            case 'css':
            case 'cpp':
            case 'c':
            case 'java': return <FileCode size={size} className="text-blue-300" />;
            default: return <File size={size} className="text-gray-400" />;
        }
    };

    const handleDownload = async (url, fileName) => {
        if (downloadingFiles[url]) return;
        setDownloadingFiles(prev => ({ ...prev, [url]: true }));
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            setDownloadedFiles(prev => ({ ...prev, [url]: true }));
        } catch (error) {
            console.error('Download failed:', error);
            window.open(url, '_blank');
        } finally {
            setDownloadingFiles(prev => ({ ...prev, [url]: false }));
        }
    };

    const handlePinMessage = async () => {
        if (selectedMessageIds.length !== 1) return;

        const msg = currentDiscussionMessages.find(m => (m._id || m.index) === selectedMessageIds[0]);
        const messageId = msg?._id;

        if (!messageId) {
            console.error('Cannot pin: Message ID not found');
            return;
        }

        try {
            await dispatch(togglePinGroupMessage({
                groupId: currentGroup._id,
                discussionId: discussion._id,
                messageId
            })).unwrap();

            // Refresh pinned messages
            dispatch(getPinnedMessages({
                groupId: currentGroup._id,
                discussionId: discussion._id
            }));

            setSelectedMessageIds([]);
        } catch (error) {
            console.error('Pin failed:', error);
        }
    };

    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    const attachmentMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
                setIsAttachmentMenuOpen(false);
            }
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setIsEmojiPickerOpen(false);
            }
            if (deleteMenuRef.current && !deleteMenuRef.current.contains(event.target)) {
                setIsDeleteMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEmojiClick = (emojiData) => {
        setMessageText(prev => prev + emojiData.emoji);
    };

    const handleCopyCode = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDeleteMessages = async (mode) => {
        if (selectedMessageIds.length === 0 || !currentGroup?._id || !discussion?._id) return;

        const idsToDelete = [...selectedMessageIds];
        try {
            // Optimistic update: remove from UI immediately
            dispatch(removeGroupMessagesLocally(idsToDelete));
            setSelectedMessageIds([]);
            setIsDeleteMenuOpen(false);

            // Perform a single batch API call
            await api.delete(`/groups/${currentGroup._id}/discussions/${discussion._id}/messages`, {
                data: { messageIds: idsToDelete, mode }
            });
        } catch (error) {
            console.error('Delete error:', error);
            // If failed, we might want to reload to be safe
            dispatch(getDiscussionMessages({ groupId: currentGroup._id, discussionId: discussion._id }));
        }
    };

    const toggleMessageSelection = (id) => {
        setSelectedMessageIds(prev =>
            prev.includes(id) ? prev.filter(currentId => currentId !== id) : [...prev, id]
        );
    };

    const isAdmin = currentGroup?.admins?.some(admin => (admin._id || admin) === user?._id) || (currentGroup?.creator?._id || currentGroup?.creator) === user?._id;
    const isModerator = (discussion?.creator?._id || discussion?.creator || discussion?.createdBy?._id || discussion?.createdBy) === user?._id;

    const canDeleteEveryone = () => {
        if (selectedMessageIds.length === 0) return false;

        if (isAdmin || isModerator) return true;

        // Check if all selected messages belong to the user
        return selectedMessageIds.every(id => {
            const msg = currentDiscussionMessages.find(m => (m._id || m.index) === id);
            return msg && (msg.sender?._id === user?._id || msg.sender === user?._id);
        });
    };

    if (!discussion) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#171C26] text-gray-500">
                <Hash size={48} className="mb-4 opacity-20" />
                <p>Select a channel to start discussing</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#171C26] h-full min-w-0 min-h-0 text-gray-200 relative">
            {/* Top Bar */}
            <div className="h-10 md:h-16 px-4 md:px-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#171C26] z-10">
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <button onClick={onToggleLeft} className="md:hidden text-gray-400 hover:text-white transition-colors p-1">
                        <Menu size={20} />
                    </button>
                    <Hash size={20} className="text-gray-400 shrink-0 hidden sm:block" />
                    <div className="min-w-0">
                        <h1 className="font-bold text-white text-[14px] sm:text-lg leading-tight truncate">{discussion.name}</h1>
                        <p className="hidden md:block text-[11px] sm:text-xs text-gray-400 truncate mt-0.5">
                            {discussion.category === 'general' ? 'General discussion for all members.' : 'Preparation and study related chat.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <button className="text-gray-400 hover:text-white hidden sm:block"><BellOff size={18} /></button>
                    {selectedMessageIds.length > 0 && (
                        <div className="relative" ref={deleteMenuRef}>
                            <button
                                className={`text-red-400 hover:text-red-300 transition-colors p-1 ${isDeleteMenuOpen ? 'bg-red-400/10 rounded-lg' : ''}`}
                                onClick={() => setIsDeleteMenuOpen(!isDeleteMenuOpen)}
                                title="Delete Options"
                            >
                                <Trash2 size={18} />
                            </button>

                            {isDeleteMenuOpen && (
                                <div className="absolute top-[calc(100%+10px)] right-0 w-48 bg-[#1E232E] border border-white/5 rounded-xl shadow-2xl p-1.5 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                                    {canDeleteEveryone() && (
                                        <button
                                            onClick={() => handleDeleteMessages('everyone')}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-all text-[13px] font-medium group"
                                        >
                                            <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                                            <span>Delete for Everyone</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteMessages('me')}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all text-[13px] font-medium group"
                                    >
                                        <Check size={14} className="group-hover:scale-110 transition-transform text-accent-blue" />
                                        <span>Delete for Me</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {selectedMessageIds.length === 1 && (isAdmin || isModerator) && (
                        <button
                            className="text-accent-blue hover:text-white transition-colors p-1"
                            onClick={handlePinMessage}
                            title="Pin Message"
                        >
                            <Pin size={18} />
                        </button>
                    )}
                    {selectedMessageIds.length > 0 && (
                        <button
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            onClick={() => setSelectedMessageIds([])}
                            title="Cancel Selection"
                        >
                            <X size={18} />
                        </button>
                    )}
                    <button onClick={onToggleRight} className={`${isAdminMode ? '' : 'lg:hidden'} text-gray-400 hover:text-white p-1`}><Users size={20} /></button>
                </div>
            </div>

            {/* Chat History */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 space-y-4 flex flex-col min-h-0 relative"
            >
                {isMessagesLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-accent-blue" size={32} />
                    </div>
                ) : (
                    <>
                        <div className="mt-auto py-8 text-center px-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-accent-blue">
                                <Hash size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 font-inter">Welcome to #{discussion.name}!</h2>
                            <p className="text-gray-400 text-sm max-w-md mx-auto">This is the start of the #{discussion.name} channel. Be kind and helpful to your fellow members.</p>
                        </div>

                        {currentDiscussionMessages.map((msg, index) => {
                            const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                            const id = msg._id || index;
                            const isSelected = selectedMessageIds.includes(id);
                            return (
                                <div
                                    key={id}
                                    id={`message-${id}`}
                                    onDoubleClick={() => !selectedMessageIds.length && toggleMessageSelection(id)}
                                    onClick={() => selectedMessageIds.length && toggleMessageSelection(id)}
                                    className={`group flex items-start gap-4 px-2 py-1 transition-all relative w-full ${isMe ? 'flex-row-reverse' : 'flex-row'} ${isSelected ? 'bg-accent-blue/5 rounded-xl border-y border-accent-blue/10 last:border-b-0 py-2' : ''} ${selectedMessageIds.length ? 'cursor-pointer hover:bg-white/5' : ''}`}
                                >
                                    {/* Multi-Selection Circle Checkbox (Always on Right) */}
                                    {selectedMessageIds.length > 0 && isMe && (
                                        <div className="shrink-0 flex items-center justify-center transition-all ml-0">
                                            {isSelected ? (
                                                <CheckCircle2 size={20} className="text-accent-blue fill-accent-blue/20" />
                                            ) : (
                                                <Circle size={20} className="text-gray-600 hover:text-gray-400" />
                                            )}
                                        </div>
                                    )}
                                    {/* Avatar */}
                                    <div className="shrink-0 mt-1">
                                        <img
                                            src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${msg.sender?.name || 'User'}&background=random`}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white/5 ring-2 ring-transparent group-hover:ring-accent-blue/20 transition-all"
                                            alt={msg.sender?.name}
                                        />
                                    </div>

                                    {/* Message Content Container */}
                                    <div className={`flex flex-col min-w-0 max-w-[75%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                        {/* Name and Time Header */}
                                        <div className={`flex items-center gap-2 mb-1 w-full px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {(() => {
                                                    const senderId = msg.sender?._id || msg.sender;
                                                    const groupAdminIds = currentGroup?.admins?.map(admin => admin._id || admin) || [];
                                                    const groupCreatorId = currentGroup?.creator?._id || currentGroup?.creator;

                                                    const isMsgAdmin = groupAdminIds.includes(senderId) || senderId === groupCreatorId;
                                                    const isMsgModerator = (discussion?.creator?._id || discussion?.creator || discussion?.createdBy?._id || discussion?.createdBy) === senderId;

                                                    return (
                                                        <>
                                                            <span className={`text-[13px] font-bold transition-colors cursor-pointer ${isMsgAdmin ? 'text-red-400 hover:text-red-300' :
                                                                (isMsgModerator ? 'text-accent-blue hover:text-blue-300' : 'text-white/80 hover:text-white')
                                                                }`}>
                                                                {isMe ? 'You' : msg.sender?.name}
                                                            </span>

                                                            {/* Role Badges */}
                                                            {isMsgAdmin && (
                                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.1)]">Admin</span>
                                                            )}
                                                            {isMsgModerator && !isMsgAdmin && (
                                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-blue/10 border border-accent-blue/20 text-accent-blue font-black uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.1)]">Moderator</span>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter opacity-70 flex items-center gap-1">
                                                {msg.isPinned && <Pin size={10} className="text-amber-400 rotate-45" />}
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className={`
                                            ${msg.type !== 'media' || msg.text ? 'px-4 py-2.5' : 'p-1'} 
                                            rounded-[1.25rem] text-[15px] leading-relaxed font-inter break-words shadow-lg transition-all min-w-[50px] max-w-full
                                            ${msg.type === 'code'
                                                ? 'bg-[#1E232E]/80 text-gray-200 rounded-tl-none border border-white/5 p-0 overflow-hidden w-full max-w-full'
                                                : (isMe
                                                    ? ((msg.type === 'media' && !msg.text) ? 'bg-transparent text-white rounded-tr-none shadow-none' : 'bg-accent-blue text-white rounded-tr-none shadow-blue-500/10')
                                                    : ((msg.type === 'media' && !msg.text) ? 'bg-transparent text-gray-200 rounded-tl-none shadow-none' : 'bg-[#2B313D] text-gray-200 rounded-tl-none border border-white/5 shadow-black/20 hover:bg-[#343b49]'))
                                            }
                                        `}>
                                            {msg.type === 'code' ? (
                                                <div className="text-left w-full max-w-[100%] overflow-hidden rounded-xl">
                                                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#1A1F29] border-b border-black/20">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Code size={10} /> CODE SNIPPET</span>
                                                        <button
                                                            onClick={() => handleCopyCode(msg.text, msg._id || index)}
                                                            className="text-gray-500 hover:text-white transition-colors p-1"
                                                            title="Copy Code"
                                                        >
                                                            {copiedId === (msg._id || index) ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                    <SyntaxHighlighter
                                                        language="javascript"
                                                        style={vscDarkPlus}
                                                        showLineNumbers={true}
                                                        customStyle={{ margin: 0, padding: '12px', fontSize: '13px', borderRadius: '0', background: 'transparent' }}
                                                        wrapLines={true}
                                                        wrapLongLines={true}
                                                    >
                                                        {msg.text}
                                                    </SyntaxHighlighter>
                                                </div>
                                            ) : msg.type === 'media' ? (
                                                <div className="flex flex-col gap-2 w-max max-w-full">
                                                    {msg.text && <p className="mb-1 text-white">{msg.text}</p>}
                                                    {(() => {
                                                        const imageFiles = msg.media?.filter(f => f.type === 'image') || [];
                                                        const otherFiles = msg.media?.filter(f => f.type !== 'image') || [];

                                                        const gridCols = imageFiles.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
                                                        const displayImages = imageFiles.slice(0, 4);
                                                        const remainingCount = imageFiles.length - 4;

                                                        return (
                                                            <>
                                                                {imageFiles.length > 0 && (
                                                                    <div className={`grid gap-1 overflow-hidden rounded-xl ${gridCols} w-full max-w-[400px]`}>
                                                                        {displayImages.map((file, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className="relative cursor-pointer group/img overflow-hidden aspect-square flex-1"
                                                                                onClick={() => openLightbox(imageFiles, i)}
                                                                            >
                                                                                <img
                                                                                    src={file.url}
                                                                                    alt={file.name}
                                                                                    className="w-full h-full object-cover border border-white/5 transition-transform duration-500 group-hover/img:scale-105"
                                                                                />
                                                                                {i === 3 && remainingCount > 0 && (
                                                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                                                                        <span className="text-2xl font-bold text-white">+{remainingCount}</span>
                                                                                    </div>
                                                                                )}
                                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                                    <Maximize2 size={24} className="text-white/80" />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {otherFiles.length > 0 && (
                                                                    <div className="flex flex-col gap-1 w-full min-w-[200px]">
                                                                        {otherFiles.map((file, i) => (
                                                                            <div key={i} className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                                                                {file.type === 'video' ? (
                                                                                    <div className="relative group/video aspect-video w-full max-w-[400px]">
                                                                                        <video src={file.url} className="w-full h-full object-cover rounded-lg bg-black" />
                                                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                                                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl">
                                                                                                <Play size={24} className="fill-white ml-1" />
                                                                                            </div>
                                                                                        </div>
                                                                                        {/* Show controls on hover or click? For now let's keep it as is, or add controls attribute to video */}
                                                                                        <video src={file.url} controls className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity" />
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex items-center gap-3 p-3 bg-[#1A1F29]/50 hover:bg-[#1A1F29] transition-all group/file relative">
                                                                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover/file:scale-105 transition-transform">
                                                                                            {getFileIcon(file.name)}
                                                                                        </div>
                                                                                        <div className="flex flex-col min-w-0 pr-10">
                                                                                            <span className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</span>
                                                                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{file.url.split('.').pop()} FILE</span>
                                                                                        </div>
                                                                                        <button
                                                                                            onClick={() => !downloadedFiles[file.url] && handleDownload(file.url, file.name)}
                                                                                            className={`
                                                                                                absolute right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all 
                                                                                                ${downloadedFiles[file.url]
                                                                                                    ? 'bg-emerald-500/10 text-emerald-400 border-none cursor-default'
                                                                                                    : 'bg-white/5 hover:bg-accent-blue/20 text-gray-400 hover:text-accent-blue border border-white/5 hover:border-accent-blue/30'}
                                                                                                ${downloadingFiles[file.url] ? 'bg-accent-blue/20 text-accent-blue border-accent-blue/30' : ''}
                                                                                            `}
                                                                                            title={downloadedFiles[file.url] ? "Downloaded" : "Download File"}
                                                                                            disabled={downloadingFiles[file.url]}
                                                                                        >
                                                                                            {downloadingFiles[file.url] ? (
                                                                                                <Loader2 size={16} className="animate-spin" />
                                                                                            ) : downloadedFiles[file.url] ? (
                                                                                                <Check size={16} />
                                                                                            ) : (
                                                                                                <Download size={16} />
                                                                                            )}
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )
                                                    })()}
                                                </div>
                                            ) : (
                                                (() => {
                                                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                                                    const parts = msg.text?.split(urlRegex) || [];
                                                    return parts.map((part, i) => {
                                                        if (part.match(urlRegex)) {
                                                            return (
                                                                <a
                                                                    key={i}
                                                                    href={part}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-white hover:underline break-all font-bold underline decoration-white/30"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    {part}
                                                                </a>
                                                            );
                                                        }
                                                        return part;
                                                    });
                                                })()
                                            )}
                                        </div>
                                    </div>

                                    {/* Checkbox for others (must be last in flex-row to be rightmost) */}
                                    {selectedMessageIds.length > 0 && !isMe && (
                                        <div className="shrink-0 flex items-center justify-center transition-all ml-auto">
                                            {isSelected ? (
                                                <CheckCircle2 size={20} className="text-accent-blue fill-accent-blue/20" />
                                            ) : (
                                                <Circle size={20} className="text-gray-600 hover:text-gray-400" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}

            </div>

            {/* Scroll to Bottom Button */}
            {showScrollBottom && (
                <button
                    onClick={() => scrollToBottom("smooth")}
                    className="absolute bottom-[100px] right-4 z-50 p-2.5 bg-accent-blue/90 hover:bg-accent-blue text-white rounded-full shadow-2xl shadow-blue-500/40 backdrop-blur-md border border-white/20 animate-in fade-in zoom-in slide-in-from-right-4 duration-300 group"
                    title="Scroll to bottom"
                >
                    <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                    {/* Potential New Message Indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1E232E] animate-pulse"></div>
                </button>
            )}

            {/* Input area */}
            <div className="px-4 pb-4 pt-2 shrink-0 bg-[#171C26] z-10 w-full relative">
                {/* Attachment Menu */}
                {isAttachmentMenuOpen && (
                    <div
                        ref={attachmentMenuRef}
                        className="absolute bottom-[calc(100%-8px)] left-8 mb-2 w-48 bg-[#1E232E] border border-white/5 rounded-xl shadow-2xl p-2 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200"
                    >
                        <div className="space-y-1">
                            <AttachmentOption icon={<ImageIcon size={16} className="text-emerald-400" />} label="Photos" onClick={() => triggerFileSelect('image/*')} />
                            <AttachmentOption icon={<Send size={16} className="text-blue-400" />} label="Videos" onClick={() => triggerFileSelect('video/*')} />
                            <AttachmentOption icon={<Type size={16} className="text-purple-400" />} label="Files" onClick={() => triggerFileSelect('.pdf,.doc,.docx,.txt,.csv')} />
                            <div className="h-px bg-white/5 my-1 mx-1"></div>
                            <AttachmentOption
                                icon={<Code size={16} className="text-amber-400" />}
                                label="Code Snippet"
                                onClick={() => {
                                    setInputMode('code');
                                    setIsAttachmentMenuOpen(false);
                                }}
                            />
                        </div>
                        {/* Triangle decorator */}
                        <div className="absolute -bottom-1 left-4 w-2 h-2 bg-[#1E232E] border-r border-b border-white/5 rotate-45"></div>
                    </div>
                )}

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept={fileAccept}
                    onChange={handleFileSelect}
                />

                {/* Pending Files Preview */}
                {pendingFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 p-2 bg-[#1E232E] rounded-xl border border-white/5 shadow-lg max-h-[150px] overflow-y-auto custom-scrollbar">
                        {pendingFiles.map(pf => (
                            <div key={pf.id} className="relative group/preview w-16 h-16 rounded-lg overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                                {pf.type === 'image' ? (
                                    <img src={pf.previewUrl} className="w-full h-full object-cover" alt="preview" />
                                ) : pf.type === 'video' ? (
                                    <div className="relative w-full h-full">
                                        <video src={pf.previewUrl} className="w-full h-full object-cover" muted playsInline />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white">
                                                <Play size={10} className="fill-white ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full bg-black/40">
                                        {getFileIcon(pf.file.name, 24)}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover/preview:opacity-100 hover:bg-red-500 transition-all z-10"
                                    onClick={() => removePendingFile(pf.id)}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={handleSendMessage}
                    className="bg-[#2B313D] rounded-xl flex items-end gap-3 px-4 py-3 relative shadow-inner focus-within:ring-1 ring-accent-blue/30 transition-all"
                >

                    <button
                        type="button"
                        className={`mb-1 text-gray-400 hover:text-white transition-colors ${isAttachmentMenuOpen ? 'text-white' : ''}`}
                        onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                    >
                        {isUploading ? <Loader2 size={20} className="animate-spin text-accent-blue" /> : <PlusCircle size={20} className={isAttachmentMenuOpen ? 'rotate-45 transition-transform' : 'transition-transform'} />}
                    </button>


                    <div className="flex-1 flex flex-col min-w-0">
                        {inputMode === 'code' && (
                            <div className="flex items-center gap-1.5 mb-1.5 px-2 py-0.5 bg-amber-400/10 border border-amber-400/20 rounded-md w-fit animate-in fade-in slide-in-from-left-2 duration-200">
                                <Code size={10} className="text-amber-400" />
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Code Mode</span>
                                <button type="button" onClick={() => setInputMode('text')} className="ml-1 text-amber-400/40 hover:text-amber-400 transition-colors">
                                    <X size={10} />
                                </button>
                            </div>
                        )}

                        {inputMode === 'code' ? (
                            <textarea
                                placeholder={`Paste your code snippet...`}
                                className="bg-transparent border-none focus:outline-none text-[14px] text-amber-200 placeholder:text-gray-500 font-mono w-full resize-none h-auto min-h-[100px] max-h-[500px] custom-scrollbar overflow-y-auto leading-relaxed py-1"
                                value={messageText}
                                rows={Math.min(20, Math.max(4, messageText.split('\n').length))}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                        ) : (
                            <input
                                type="text"
                                placeholder={`Message #${discussion.name}`}
                                className="bg-transparent border-none focus:outline-none text-[15px] text-gray-200 placeholder:text-gray-500 font-inter w-full py-0.5"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative" ref={emojiPickerRef}>
                            <button
                                type="button"
                                className={`text-gray-300 hover:text-white transition-colors hidden sm:block ${isEmojiPickerOpen ? 'text-white' : ''}`}
                                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                            >
                                <Smile size={20} />
                            </button>

                            {isEmojiPickerOpen && (
                                <div className="absolute bottom-full right-0 mb-4 z-[100] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <style>{`
                                        .EmojiPickerReact {
                                            --epr-scrollbar-color: #171C26 !important;
                                            --epr-scrollbar-track-color: #1E232E !important;
                                        }
                                        .EmojiPickerReact ::-webkit-scrollbar {
                                            width: 6px !important;
                                        }
                                        .EmojiPickerReact ::-webkit-scrollbar-track {
                                            background: #1E232E !important;
                                            border-radius: 10px !important;
                                        }
                                        .EmojiPickerReact ::-webkit-scrollbar-thumb {
                                            background: #2B313D !important;
                                            border-radius: 10px !important;
                                        }
                                        .EmojiPickerReact ::-webkit-scrollbar-thumb:hover {
                                            background: #3b82f6 !important;
                                        }
                                    `}</style>
                                    <EmojiPicker
                                        theme={Theme.DARK}
                                        onEmojiClick={handleEmojiClick}
                                        autoFocusSearch={false}
                                        width={320}
                                        height={400}
                                        lazyLoadEmojis={true}
                                        searchPlaceholder="Search emojis..."
                                        style={{
                                            '--epr-bg-color': '#1E232E',
                                            '--epr-category-label-bg-color': '#1E232E',
                                            '--epr-picker-border-color': 'rgba(255,255,255,0.05)',
                                            '--epr-search-input-bg-color': '#171C26',
                                            '--epr-search-input-border-color': 'rgba(255,255,255,0.1)',
                                            '--epr-hover-bg-color': 'rgba(255,255,255,0.05)',
                                            '--epr-focus-bg-color': 'rgba(255,255,255,0.1)',
                                            '--epr-highlight-color': '#3b82f6',
                                            '--epr-scrollbar-color': '#1E232E',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={(!messageText.trim() && pendingFiles.length === 0) || isUploading}
                            className="text-accent-blue hover:text-white disabled:text-gray-600 transition-colors p-1"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Lightbox Slider */}
            {lightbox.isOpen && (
                <div
                    className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-white z-10 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-400">Image {lightbox.currentIndex + 1} of {lightbox.images.length}</span>
                            <span className="text-xs text-gray-500 truncate max-w-[200px]">{lightbox.images[lightbox.currentIndex]?.name}</span>
                        </div>
                        <button
                            onClick={closeLightbox}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                        {lightbox.images.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-4 md:left-8 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 backdrop-blur-md z-10 group"
                            >
                                <ChevronLeft size={32} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                        )}

                        <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={lightbox.images[lightbox.currentIndex]?.url}
                                alt="Full size"
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300"
                            />
                        </div>

                        {lightbox.images.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-4 md:right-8 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 backdrop-blur-md z-10 group"
                            >
                                <ChevronRight size={32} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        )}
                    </div>

                    {/* Thumbnails Strip */}
                    {lightbox.images.length > 1 && (
                        <div className="absolute bottom-6 flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto max-w-[90%] custom-scrollbar">
                            {lightbox.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightbox({ ...lightbox, currentIndex: idx });
                                    }}
                                    className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${idx === lightbox.currentIndex ? 'border-accent-blue scale-110 shadow-lg shadow-accent-blue/20' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const AttachmentOption = ({ icon, label, onClick }) => (
    <button
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all text-[13px] font-medium group"
        onClick={onClick}
    >
        <span className="shrink-0 group-hover:scale-110 transition-transform">{icon}</span>
        <span>{label}</span>
    </button>
);

export default DiscussionChatArea;
