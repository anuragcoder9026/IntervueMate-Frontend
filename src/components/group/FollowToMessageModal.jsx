import React, { useState } from 'react';
import { X, UserPlus, MessageSquare, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { followUser } from '../../store/authSlice';
import { toast } from 'react-toastify';

const FollowToMessageModal = ({ isOpen, onClose, member, onMessageReady }) => {
    const dispatch = useDispatch();
    const [isFollowing, setIsFollowing] = useState(false);
    const [hasFollowed, setHasFollowed] = useState(false);
    const [isStartingChat, setIsStartingChat] = useState(false);

    if (!isOpen || !member) return null;

    const handleFollow = async () => {
        setIsFollowing(true);
        try {
            await dispatch(followUser(member._id)).unwrap();
            setHasFollowed(true);
            toast.success(`You are now following ${member.name}`);
        } catch (err) {
            toast.error(err || 'Failed to follow user');
        } finally {
            setIsFollowing(false);
        }
    };

    const handleMessage = async () => {
        setIsStartingChat(true);
        try {
            await onMessageReady(member._id);
        } catch {
            // error handled in parent
        } finally {
            setIsStartingChat(false);
        }
    };

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
            setHasFollowed(false);
        }
    };

    const handleCloseClick = () => {
        onClose();
        setHasFollowed(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdrop}
            style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Card */}
            <div
                className="relative w-full max-w-sm bg-[#1a2235] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                {/* Close button */}
                <button
                    onClick={handleCloseClick}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-all"
                >
                    <X size={16} />
                </button>

                {/* Banner area */}
                <div className="h-20 bg-gradient-to-r from-accent-blue/30 via-purple-500/20 to-accent-blue/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a2235]"></div>
                </div>

                {/* Avatar */}
                <div className="flex justify-center -mt-10 relative z-10">
                    <div className="relative">
                        <img
                            src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                            alt={member.name}
                            className="w-20 h-20 rounded-full border-4 border-[#1a2235] object-cover shadow-lg"
                        />
                        {member.isOnline && (
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#1a2235] rounded-full"></div>
                        )}
                    </div>
                </div>

                {/* User info */}
                <div className="px-6 pt-3 pb-2 text-center">
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    {member.headline && (
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{member.headline}</p>
                    )}
                    {member.education?.length > 0 && member.education[0].school && (
                        <p className="text-[11px] text-text-secondary/70 mt-1">{member.education[0].school}</p>
                    )}
                </div>

                {/* Info message */}
                <div className="px-6 pb-4">
                    <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-center">
                        {hasFollowed ? (
                            <p className="text-xs text-emerald-400 font-medium">
                                ✓ You're now following {member.name.split(' ')[0]}. You can send them a message!
                            </p>
                        ) : (
                            <p className="text-xs text-text-secondary">
                                You need to follow <span className="text-white font-semibold">{member.name.split(' ')[0]}</span> before you can send them a message.
                            </p>
                        )}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="px-6 pb-6 flex gap-3">
                    {!hasFollowed ? (
                        <>
                            <button
                                onClick={handleFollow}
                                disabled={isFollowing}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-blue hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-accent-blue/20"
                            >
                                {isFollowing ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <UserPlus size={16} />
                                )}
                                {isFollowing ? 'Following...' : 'Follow'}
                            </button>
                            <button
                                disabled
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 text-text-secondary/40 text-sm font-bold rounded-xl cursor-not-allowed border border-white/5"
                            >
                                <MessageSquare size={16} />
                                Message
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleMessage}
                            disabled={isStartingChat}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-blue hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-accent-blue/20"
                        >
                            {isStartingChat ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <MessageSquare size={16} />
                            )}
                            {isStartingChat ? 'Opening...' : 'Send Message'}
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default FollowToMessageModal;
