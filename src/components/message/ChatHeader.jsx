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
        <div className="h-[60px] w-full px-1.5 sm:px-4 flex items-center justify-between [@media(max-width:405px)]:justify-start [@media(max-width:415px)]:gap-2 bg-[#111827] border-b border-[#1E293B] shrink-0 relative z-[60]">
            {/* Left Section: Back, Avatar, Name - Flexible width with truncation */}
            <div className="flex items-center gap-2 sm:gap-3 flex-initial min-w-0 mr-2">
                <button
                    className="md:hidden p-1 text-text-secondary hover:text-white hover:bg-white/5 rounded-full transition-colors shrink-0"
                    onClick={() => setIsMobileChatOpen(false)}
                >
                    <ChevronLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
                </button>
                <div className="relative shrink-0">
                    <img
                        src={otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${otherParticipant?.name || 'U'}&background=random`}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-white/5"
                        alt={otherParticipant?.name}
                    />
                    {isOtherOnline && <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 border-2 border-[#111827]" />}
                </div>
                <div className="flex flex-col min-w-0 ml-0.5">
                    <span className="text-xs sm:text-[15px] font-semibold text-white leading-tight truncate">
                        {otherParticipant?.name || 'Unknown'}
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-text-secondary leading-tight mt-0.5 truncate uppercase tracking-tight">
                        {isOtherTyping ? (
                            <span className="text-emerald-400 italic">typing...</span>
                        ) : isOtherOnline ? (
                            <span className="text-emerald-400">online</span>
                        ) : otherParticipant?.lastSeen ? (
                            `seen ${formatLastSeen(otherParticipant.lastSeen)}`
                        ) : (
                            'offline'
                        )}
                    </span>
                </div>
            </div>

            {/* Right Section: Action Icons - Ensured they don't hide or shrink */}
            <div className="flex items-center justify-end gap-3.5 sm:gap-1 text-text-secondary shrink-0 ml-auto [@media(max-width:415px)]:ml-0">
                <button
                    onClick={isBlocked ? undefined : () => startCall('video')}
                    className={`p-1.5 sm:p-2 rounded-lg transition-all shrink-0 ${isBlocked ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-white/5'}`}
                    disabled={isBlocked}
                    title={isBlocked ? "Cannot call blocked user" : "Start Video Call"}
                >
                    <Video size={16}/>
                </button>
                <button
                    onClick={isBlocked ? undefined : () => startCall('voice')}
                    className={`p-1.5 sm:p-2 rounded-lg transition-all shrink-0 ${isBlocked ? 'opacity-50 cursor-not-allowed text-red-100/50' : 'hover:text-white hover:bg-white/5'}`}
                    disabled={isBlocked}
                    title={isBlocked ? "Cannot call blocked user" : "Start Voice Call"}
                >
                    <Phone size={16} />
                </button>
                
                <button className="p-1.5 sm:p-2 hover:text-white hover:bg-white/5 rounded-lg transition-all hidden sm:flex shrink-0">
                    <Search size={16} />
                </button>

                <div className="relative shrink-0 flex items-center" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 sm:p-2 hover:text-white hover:bg-white/5 rounded-lg transition-all shrink-0"
                    >
                        <MoreVertical size={16} />
                    </button>
                    {showMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#1e293b] border border-[#334155] rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-150">
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
