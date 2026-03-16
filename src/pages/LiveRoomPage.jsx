import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MousePointer2, ShieldCheck, ShieldAlert, PhoneOff, ArrowLeft, MonitorUp } from 'lucide-react';
import RoomHeader from '../components/liveroom/RoomHeader';
import RoomControls from '../components/liveroom/RoomControls';
import SidePanel from '../components/liveroom/SidePanel';
import VideoTile from '../components/liveroom/VideoTile';
import Whiteboard from '../components/liveroom/Whiteboard';
import useSessionSocket from '../hooks/useSessionSocket';
import useWebRTC from '../hooks/useWebRTC';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

const LiveRoomPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(state => state.auth);
    
    // Get eventId from query params
    const searchParams = new URLSearchParams(location.search);
    const eventId = searchParams.get('id');

    const [event, setEvent] = useState(null);
    const [groupAdmins, setGroupAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    // Get preferences from query params (from JoinPreviewPage)
    const [isMuted, setIsMuted] = useState(searchParams.get('muted') === 'true');
    const [isVideoOff, setIsVideoOff] = useState(searchParams.get('videoOff') === 'true');
    const [activePanel, setActivePanel] = useState('chat'); // 'chat', 'participants', or null
    const [viewMode, setViewMode] = useState('speaker'); // 'speaker' or 'grid'
    const [isEnding, setIsEnding] = useState(false);
    const [showResumePrompt, setShowResumePrompt] = useState(searchParams.get('sharing') === 'true');
    const [forceExited, setForceExited] = useState(false);
    const [forceExitedBy, setForceExitedBy] = useState('');

    // Emoji reactions & hand raises
    const [emojiReactions, setEmojiReactions] = useState([]);
    const [handRaises, setHandRaises] = useState([]);
    const reactionIdRef = useRef(0);

    const { 
        participants, 
        messages, 
        sessionStatus, 
        whiteboardHistory,
        whiteboardMaximized,
        sendMessage, 
        updateMediaStatus,
        startSession,
        endSession,
        toggleWhiteboard
    } = useSessionSocket(eventId, { 
        isWatcher: false,
        initialMicMuted: isMuted,
        initialVideoOff: isVideoOff
    });

    const { socket } = useSocket();
    const { localStream, remoteStreams, isScreenSharing, toggleScreenShare } = useWebRTC(socket, user, eventId, participants, isMuted, isVideoOff);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;
            try {
                const { data } = await api.get(`/events/${eventId}`);
                if (data.success) {
                    setEvent(data.data);
                    // Fetch group admins if it's a group event
                    if (data.data.groupId) {
                        const groupRes = await api.get(`/groups/${data.data.groupId}`);
                        if (groupRes.data.success) {
                            setGroupAdmins(groupRes.data.data.admins || []);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch event or group:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        updateMediaStatus(isMuted, isVideoOff);
    }, [isMuted, isVideoOff, updateMediaStatus]);

    // Sync mute, video, and screen sharing state to URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        params.set('muted', isMuted);
        params.set('videoOff', isVideoOff);
        
        // Only overwrite sharing if we are actively sharing or if the user dismissed the resume prompt
        // This prevents the URL from instantly clearing `sharing=true` on refresh before the user clicks Resume
        if (isScreenSharing || !showResumePrompt) {
            params.set('sharing', isScreenSharing);
        }
        
        const newUrl = `${location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [isMuted, isVideoOff, isScreenSharing, showResumePrompt, location.pathname, location.search]);

    // Update view mode when whiteboard is maximized
    useEffect(() => {
        if (whiteboardMaximized) {
            setViewMode('speaker');
        }
    }, [whiteboardMaximized]);

    const handleToggleWhiteboard = () => {
        const isHost = user?._id === event?.creator?._id || user?._id === event?.creator;
        if (!isHost) return;
        toggleWhiteboard(!whiteboardMaximized);
    };

    const effectiveSessionStatus = (sessionStatus === 'scheduled' && event?.status) ? event.status : sessionStatus;

    // Handle session end redirect
    useEffect(() => {
        if (effectiveSessionStatus === 'completed') {
            setIsEnding(true);
            // No auto-redirect, let users use the 'Back to Events' button
        }
    }, [effectiveSessionStatus]);

    const handleLeave = () => {
        navigate('/events');
    };

    // Force exit listener
    useEffect(() => {
        if (!socket) return;
        const handleForceExited = ({ by }) => {
            setForceExited(true);
            setForceExitedBy(by || 'Host');
        };
        socket.on('force_exited', handleForceExited);
        return () => socket.off('force_exited', handleForceExited);
    }, [socket]);

    // Force exit handler (for admin/creator to invoke)
    const handleForceExit = useCallback((targetUserId) => {
        if (socket && eventId) {
            socket.emit('force_exit_user', { eventId, targetUserId });
        }
    }, [socket, eventId]);

    // Emoji reaction handler
    const handleEmojiReaction = useCallback((emoji) => {
        if (socket && eventId) {
            socket.emit('session_emoji_reaction', { eventId, emoji });
        }
    }, [socket, eventId]);

    // Raise hand handler
    const handleRaiseHand = useCallback(() => {
        if (socket && eventId) {
            socket.emit('session_raise_hand', { eventId });
        }
    }, [socket, eventId]);

    // Listen for emoji reactions and hand raises
    useEffect(() => {
        if (!socket) return;

        const handleReaction = (data) => {
            const id = ++reactionIdRef.current;
            // Always position at horizontal middle
            const reaction = { ...data, id, x: 50 };
            setEmojiReactions(prev => [...prev, reaction]);
            setTimeout(() => {
                setEmojiReactions(prev => prev.filter(r => r.id !== id));
            }, 3000);
        };

        const handleHand = (data) => {
            const id = ++reactionIdRef.current;
            const hand = { ...data, id };
            setHandRaises(prev => [...prev, hand]);
            setTimeout(() => {
                setHandRaises(prev => prev.filter(h => h.id !== id));
            }, 2500);
        };

        socket.on('session_emoji_reaction', handleReaction);
        socket.on('session_raise_hand', handleHand);

        return () => {
            socket.off('session_emoji_reaction', handleReaction);
            socket.off('session_raise_hand', handleHand);
        };
    }, [socket]);

    if (loading) {
        return (
            <div className="h-screen w-full bg-[#0A0F1A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-blue"></div>
            </div>
        );
    }

    // Combine unique participants. Ensure current user is in the list and unique.
    const allParticipants = participants.filter(p => String(p._id) !== String(user?._id));
    // Add current user with their latest local status
    if (user) {
        allParticipants.push({ 
            ...user, 
            _id: String(user._id),
            micMuted: isMuted, 
            videoOff: isVideoOff,
            isSharingScreen: isScreenSharing
        });
    }

    // Sort to keep order consistent (e.g. Host first, then others by name)
    allParticipants.sort((a, b) => {
        const aIsHost = String(a._id) === String(event?.creator?._id || event?.creator);
        const bIsHost = String(b._id) === String(event?.creator?._id || event?.creator);
        if (aIsHost) return -1;
        if (bIsHost) return 1;
        return (a.name || '').localeCompare(b.name || '');
    });

    const screenSharer = allParticipants.find(p => p.isSharingScreen);
    const mainParticipant = screenSharer || allParticipants[0];
    const sideParticipants = allParticipants.filter(p => !mainParticipant || p._id !== mainParticipant._id);

    // Determine if current user can manage (force exit) other participants
    const isCreator = String(user?._id) === String(event?.creator?._id || event?.creator);
    const isAdmin = groupAdmins.some(adminId => String(adminId) === String(user?._id));
    const canManage = isCreator || isAdmin;
    return (
        <div className="h-screen w-full bg-[#0A0F1A] text-white flex flex-col font-inter overflow-hidden relative">
            <RoomHeader 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
                title={event?.title} 
            />

            {/* Screen Share Resume Prompt */}
            {showResumePrompt && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111827] border border-accent-blue/30 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-w-md w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-accent-blue/20 text-accent-blue rounded-full flex items-center justify-center mb-6">
                            <MonitorUp size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Resume Session Share?</h2>
                        <p className="text-text-secondary text-sm mb-8">
                            You were sharing your screen before refreshing the page. Would you like to resume sharing?
                        </p>
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => {
                                    setShowResumePrompt(false);
                                    if (socket && eventId) {
                                        // Broadcast stop to clear the database since we chose not to resume
                                        socket.emit('session_screen_share', { eventId, isSharing: false });
                                    }
                                }}
                                className="flex-1 py-3 px-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowResumePrompt(false);
                                    toggleScreenShare(); // Must be user-initiated to pass browser getDisplayMedia block!
                                }}
                                className="flex-1 py-3 px-4 rounded-xl font-bold bg-accent-blue hover:bg-accent-blue-hover text-white transition-all shadow-lg shadow-accent-blue/20"
                            >
                                Resume Share
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden relative pb-20 lg:pb-0">
                {/* Video Area */}
                <div className="flex-1 p-2 sm:p-4 h-full min-w-0 flex flex-col w-full">
                    {viewMode === 'speaker' ? (
                        <div className="flex-1 flex flex-col md:flex-row gap-2 sm:gap-4 h-full min-h-0 min-w-0 justify-start overflow-y-auto md:overflow-hidden custom-scrollbar pb-28 md:pb-0">
                            {/* Main Speaker View (First Participant or Host) */}
                            <div className="w-full md:flex-1 min-h-0 min-w-0 relative flex flex-col justify-center shrink-0">
                                <div className={`w-full h-[40vh] sm:h-[50vh] ${activePanel ? 'lg:h-[60vh]' : 'md:h-full'} max-h-full transition-all duration-300`}>
                                    {screenSharer ? (
                                        <div className="w-full h-full relative">
                                            <VideoTile 
                                                name={screenSharer.name} 
                                                isHost={screenSharer._id === String(event?.creator?._id || event?.creator)}
                                                type="main" 
                                                micMuted={screenSharer.micMuted}
                                                videoOff={screenSharer.videoOff}
                                                avatar={screenSharer.avatar}
                                                isMe={screenSharer._id === String(user?._id)}
                                                stream={screenSharer._id === String(user?._id) ? localStream : remoteStreams[screenSharer._id]}
                                                isScreenSharing={true}
                                                canManage={canManage}
                                                onForceExit={() => handleForceExit(screenSharer._id)}
                                            />
                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent-blue/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 animate-pulse z-10 text-center">
                                                <span className="opacity-90">{screenSharer._id === String(user?._id) ? "You are presenting" : `${screenSharer.name} is presenting`}</span>
                                            </div>
                                        </div>
                                    ) : whiteboardMaximized ? (
                                        <Whiteboard 
                                            socket={socket} 
                                            eventId={eventId} 
                                            isMaximized={true}
                                            currentUserId={user?._id}
                                            initialHistory={whiteboardHistory}
                                            canClear={
                                                String(user?._id) === String(event?.creator?._id || event?.creator) || 
                                                groupAdmins.some(adminId => String(adminId) === String(user?._id))
                                            }
                                        />
                                    ) : mainParticipant ? (
                                        <div className="w-full h-full relative">
                                            <VideoTile 
                                                name={mainParticipant.name} 
                                                isHost={mainParticipant._id === String(event?.creator?._id || event?.creator)}
                                                type="main" 
                                                micMuted={mainParticipant.micMuted}
                                                videoOff={mainParticipant.videoOff}
                                                avatar={mainParticipant.avatar}
                                                isMe={mainParticipant._id === String(user?._id)}
                                                stream={mainParticipant._id === String(user?._id) ? localStream : remoteStreams[mainParticipant._id]}
                                                isScreenSharing={mainParticipant.isSharingScreen}
                                                canManage={canManage}
                                                onForceExit={() => handleForceExit(mainParticipant._id)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full bg-[#1E2636] rounded-2xl flex items-center justify-center border border-white/5">
                                            <span className="text-white/20 uppercase font-black tracking-widest text-xs">Waiting for feed</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Side Tiles (Speaker Mode) */}
                            <div className="w-full md:w-64 md:h-full shrink-0 grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-2 md:gap-4 md:overflow-y-auto no-scrollbar md:custom-scrollbar auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-auto">
                                {(user?._id === event?.creator?._id || user?._id === event?.creator) && !whiteboardMaximized && (
                                    <div 
                                        className="w-full h-full md:h-40 shrink-0 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                        onClick={handleToggleWhiteboard}
                                    >
                                        <Whiteboard 
                                            socket={socket} 
                                            eventId={eventId} 
                                            isMaximized={false}
                                            currentUserId={user?._id}
                                            initialHistory={whiteboardHistory}
                                            canClear={
                                                String(user?._id) === String(event?.creator?._id || event?.creator) || 
                                                groupAdmins.some(adminId => String(adminId) === String(user?._id))
                                            }
                                        />
                                    </div>
                                )}
                                {whiteboardMaximized && (user?._id === event?.creator?._id || user?._id === event?.creator) && (
                                    <div 
                                        className="w-full h-full md:h-40 shrink-0 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                                        onClick={handleToggleWhiteboard}
                                    >
                                        <div className="h-full bg-[#1C2738] rounded-2xl border border-accent-blue/30 flex items-center justify-center flex-col gap-2">
                                            <MousePointer2 size={24} className="text-accent-blue" />
                                            <span className="text-[10px] font-black uppercase text-accent-blue">Minimize Board</span>
                                        </div>
                                    </div>
                                )}
                                {sideParticipants.map((p) => (
                                    <div key={p._id} className="w-full h-full md:h-40 shrink-0">
                                        <VideoTile 
                                            name={p.name} 
                                            micMuted={p.micMuted} 
                                            videoOff={p.videoOff}
                                            avatar={p.avatar}
                                            isMe={p._id === String(user?._id)}
                                            isHost={p._id === String(event?.creator?._id || event?.creator)}
                                            stream={p._id === String(user?._id) ? localStream : remoteStreams[p._id]}
                                            isScreenSharing={p.isSharingScreen}
                                            canManage={canManage}
                                            onForceExit={() => handleForceExit(p._id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 overflow-y-auto custom-scrollbar pb-4 h-full auto-rows-[minmax(140px,1fr)] lg:auto-rows-fr">
                            {allParticipants.map((p) => (
                                <VideoTile 
                                    key={p._id}
                                    name={p.name} 
                                    micMuted={p.micMuted} 
                                    videoOff={p.videoOff}
                                    avatar={p.avatar}
                                    isMe={p._id === String(user?._id)}
                                    isHost={p._id === String(event?.creator?._id || event?.creator)}
                                    stream={p._id === String(user?._id) ? localStream : remoteStreams[p._id]}
                                    isScreenSharing={p.isSharingScreen}
                                    canManage={canManage}
                                    onForceExit={() => handleForceExit(p._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <SidePanel
                    activePanel={activePanel}
                    onClose={() => setActivePanel(null)}
                    messages={messages}
                    sendMessage={sendMessage}
                    participants={allParticipants}
                    currentUser={user}
                    hostId={event?.creator?._id || event?.creator}
                />
            </div>

            <RoomControls
                isMuted={isMuted} setIsMuted={setIsMuted}
                isVideoOff={isVideoOff} setIsVideoOff={setIsVideoOff}
                activePanel={activePanel} setActivePanel={setActivePanel}
                onLeave={handleLeave}
                isHost={user?._id === event?.creator?._id || user?._id === event?.creator}
                sessionStatus={effectiveSessionStatus}
                onStartSession={startSession}
                onEndSession={endSession}
                onEmojiReaction={handleEmojiReaction}
                onRaiseHand={handleRaiseHand}
                isScreenSharing={isScreenSharing}
                toggleScreenShare={toggleScreenShare}
            />

            {/* Emoji Reaction Animations */}
            <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
                {emojiReactions.map((r) => (
                    <div
                        key={r.id}
                        className="absolute bottom-20 -translate-x-1/2 animate-emoji-float"
                        style={{ left: `${r.x}%` }}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-4xl sm:text-5xl drop-shadow-lg">{r.emoji}</span>
                            <span className="text-[10px] font-bold text-white bg-[#111827]/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap">{r.name}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hand Raise Notifications */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
                {handRaises.map((h) => (
                    <div
                        key={h.id}
                        className="flex items-center gap-3 bg-[#111827]/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/10 animate-in slide-in-from-top-3 duration-300"
                    >
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center shrink-0">
                            {h.avatar ? (
                                <img src={h.avatar} alt={h.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-amber-400 font-black text-sm">{h.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">{h.name}</span>
                            <span className="text-[10px] text-amber-400">raised hand ✋</span>
                        </div>
                        <span className="text-2xl ml-1 animate-wave">✋</span>
                    </div>
                ))}
            </div>

            {/* Session Ending Page */}
            {isEnding && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0F1A] border-t-4 border-red-500 animate-in fade-in duration-700">
                    <button 
                        onClick={() => navigate('/events')}
                        className="absolute top-8 left-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10"
                    >
                        <ArrowLeft size={18} />
                        <span className="font-bold text-sm tracking-tight">Back to Events</span>
                    </button>

                    <div className="relative flex items-center justify-center mb-10">
                        <div className="absolute w-40 h-40 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="relative w-28 h-28 bg-gradient-to-br from-red-500 to-red-700 rounded-[36px] flex items-center justify-center shadow-2xl shadow-red-500/40">
                            <PhoneOff size={44} className="text-white" />
                        </div>
                    </div>
                    
                    <div className="text-center max-w-xl px-6">
                        <h2 className="text-5xl font-black text-white mb-4 tracking-tight animate-in slide-in-from-bottom-4 duration-500">
                            Session Ended
                        </h2>
                        <p className="text-text-secondary text-xl mb-12 animate-in slide-in-from-bottom-6 duration-700">
                            The live session has concluded. Thank you for participating!
                        </p>

                        <button 
                            onClick={() => navigate('/events')}
                            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 active:scale-95"
                        >
                            Back to Lobby
                        </button>
                    </div>

                    <div className="absolute bottom-12 flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
                    </div>
                </div>
            )}

            {/* Force Exited Page */}
            {forceExited && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A0F1A] animate-in fade-in duration-500">
                    <div className="relative flex items-center justify-center mb-10">
                        <div className="absolute w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="relative w-28 h-28 bg-gradient-to-br from-orange-500 to-red-600 rounded-[36px] flex items-center justify-center shadow-2xl shadow-orange-500/40">
                            <ShieldAlert size={44} className="text-white" />
                        </div>
                    </div>
                    
                    <div className="text-center max-w-xl px-6">
                        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight animate-in slide-in-from-bottom-4 duration-500">
                            You've Been Removed
                        </h2>
                        <p className="text-text-secondary text-lg sm:text-xl mb-4 animate-in slide-in-from-bottom-6 duration-700">
                            You have been removed from this session by <span className="text-orange-400 font-bold">{forceExitedBy}</span>.
                        </p>
                        <p className="text-text-secondary/60 text-sm mb-12 animate-in slide-in-from-bottom-8 duration-900">
                            If you believe this was a mistake, please contact the session organizer.
                        </p>

                        <button 
                            onClick={() => navigate('/events')}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                        >
                            Back to Events
                        </button>
                    </div>

                    <div className="absolute bottom-12 flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveRoomPage;
