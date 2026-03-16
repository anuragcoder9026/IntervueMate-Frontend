import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Video, Phone, Search, MoreVertical, Volume2, VolumeX } from 'lucide-react';

const formatLastSeen = (date) => {
    if (!date) return '';
    const now = new Date();
    const lastSeen = new Date(date);
    const diffInSeconds = Math.floor((now - lastSeen) / 1000);

    if (diffInSeconds < 60) return 'just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return lastSeen.toLocaleDateString();
};

const ChatHeader = ({ otherParticipant, isOtherOnline, isOtherTyping, setIsMobileChatOpen, startCall, isBlocked }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const [soundEnabled, setSoundEnabled] = useState(
        localStorage.getItem('interviewmate_messaging_sound_enabled') !== 'false'
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        localStorage.setItem('interviewmate_messaging_sound_enabled', newState);
        setShowMenu(false);
    };

    return (
        <div className="h-[60px] px-3 md:px-5 flex items-center justify-between bg-[#111827] border-b border-[#1E293B] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    className="md:hidden p-1.5 mr-0.5 text-text-secondary hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    onClick={() => setIsMobileChatOpen(false)}
                >
                    <ChevronLeft size={22} />
                </button>
                <div className="relative shrink-0">
                    <img
                        src={otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${otherParticipant?.name || 'U'}&background=random`}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={otherParticipant?.name}
                    />
                    {isOtherOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#111827]" />}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-semibold text-white leading-tight truncate">{otherParticipant?.name || 'Unknown'}</span>
                    <span className="text-[11px] text-text-secondary leading-tight mt-0.5 truncate">
                        {isOtherTyping ? (
                            <span className="text-emerald-400 italic">typing...</span>
                        ) : isOtherOnline ? (
                            <span className="text-emerald-400">online</span>
                        ) : otherParticipant?.lastSeen ? (
                            `Last seen ${formatLastSeen(otherParticipant.lastSeen)}`
                        ) : (
                            'offline'
                        )}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-1 text-text-secondary shrink-0">
                <button
                    onClick={isBlocked ? undefined : () => startCall('video')}
                    className={`p-2 rounded-lg transition-all ${isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-white/5'}`}
                    disabled={isBlocked}
                    title={isBlocked ? "Cannot call blocked user" : "Start Video Call"}
                >
                    <Video size={20} />
                </button>
                <button
                    onClick={isBlocked ? undefined : () => startCall('voice')}
                    className={`p-2 rounded-lg transition-all ${isBlocked ? 'opacity-50 cursor-not-allowed text-red-400/50' : 'hover:text-white hover:bg-white/5'}`}
                    disabled={isBlocked}
                    title={isBlocked ? "Cannot call blocked user" : "Start Voice Call"}
                >
                    <Phone size={20} />
                </button>
                <button className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Search size={20} /></button>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <MoreVertical size={20} />
                    </button>
                    {showMenu && (
                        <div
                            className="absolute top-full right-0 mt-2 w-48 bg-[#1e293b] border border-[#334155] rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                            style={{ animation: 'fadeIn 0.15s ease-out' }}
                        >
                            <button
                                onClick={toggleSound}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors text-left"
                            >
                                {soundEnabled ? (
                                    <><VolumeX size={16} /> Mute Sounds</>
                                ) : (
                                    <><Volume2 size={16} className="text-accent-blue" /> <span className="text-white">Enable Sounds</span></>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
