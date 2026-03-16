import { X, Heart, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { useState, useEffect } from 'react';
const LikesModal = ({ isOpen, onClose, postId }) => {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { onlineUsers } = useSocket();

    useEffect(() => {
        if (isOpen && postId) {
            const fetchLikes = async () => {
                try {
                    setLoading(true);
                    const res = await axios.get(`http://localhost:5000/api/posts/${postId}/likes`, {
                        withCredentials: true
                    });
                    if (res.data.success) {
                        setLikes(res.data.data);
                    }
                } catch (err) {
                    console.error('Error fetching likes:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchLikes();
        }
    }, [isOpen, postId]);

    // Handle backdrop click to close
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-bg-primary/95 border border-white/10 w-full max-w-md rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 font-outfit"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-500/0 via-rose-500/40 to-rose-500/0"></div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                            <Heart size={18} className="text-rose-500 fill-rose-500/20" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-none">Reactions</h3>
                            <p className="text-[11px] text-text-secondary mt-1 font-medium tracking-wide uppercase">All People who liked</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-text-secondary hover:text-white active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="relative w-12 h-12">
                                <div className="absolute inset-0 border-4 border-rose-500/10 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-rose-500 rounded-full animate-spin"></div>
                            </div>
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest animate-pulse">Gathering Hearts</span>
                        </div>
                    ) : likes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-4 text-text-secondary/20">
                                <Users size={32} />
                            </div>
                            <h4 className="text-white font-bold mb-1">No reactions yet</h4>
                            <p className="text-sm text-text-secondary">Be the first one to react to this post!</p>
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {likes.map((user, idx) => {
                                const isOnline = user.isOnline || onlineUsers?.has(user._id?.toString());
                                return (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between p-3.5 hover:bg-white/[0.03] rounded-[18px] transition-all group cursor-pointer border border-transparent hover:border-white/5"
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                        onClick={() => {
                                            const nameSlug = user.name.replace(/\s+/g, '').toLowerCase();
                                            navigate(`/profile/${nameSlug}-${user.userId}`);
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="relative shrink-0">
                                                <div className="absolute inset-0 bg-accent-blue/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <img
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white/5 relative z-10 group-hover:border-accent-blue/50 transition-colors"
                                                />
                                                {isOnline && (
                                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-bg-primary rounded-full z-20 shadow-lg"></div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-text-primary group-hover:text-white transition-colors leading-tight truncate">
                                                        {user.name}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-text-secondary line-clamp-1 font-medium opacity-80 mt-0.5 group-hover:opacity-100 transition-opacity">
                                                    {user.headline || 'InterviewMate Explorer'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <ChevronRight size={16} className="text-text-secondary ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">{likes.length} People</span>
                </div>
            </div>
        </div>
    );
};

export default LikesModal;
