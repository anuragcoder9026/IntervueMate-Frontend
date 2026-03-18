import React, { useState } from 'react';
import { X, Search, UserPlus, UserMinus, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { followUser, unfollowUser } from '../../store/authSlice';
import { toast } from 'react-toastify';

const FollowModal = ({ isOpen, onClose, title, users = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [actionLoading, setActionLoading] = useState(null);

    const filteredUsers = users.filter(user => 
        user && typeof user === 'object' && (
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.userId?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleFollowToggle = async (e, targetUser) => {
        e.stopPropagation();
        setActionLoading(targetUser._id);
        const isFollowing = currentUser?.following?.some(id => (id._id || id).toString() === targetUser._id.toString());
        
        try {
            if (isFollowing) {
                await dispatch(unfollowUser(targetUser._id)).unwrap();
                toast.success(`Unfollowed ${targetUser.name}`);
            } else {
                await dispatch(followUser(targetUser._id)).unwrap();
                toast.success(`Following ${targetUser.name}`);
            }
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to perform action');
        } finally {
            setActionLoading(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-white/[0.01]">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-blue transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-bg-primary/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredUsers.length > 0 ? (
                        <div className="divide-y divide-white/[0.03]">
                            {filteredUsers.map((item) => {
                                const isFollowing = currentUser?.following?.some(id => (id._id || id).toString() === item._id.toString());
                                const isSelf = currentUser?.userId === item.userId || currentUser?.id === item._id;

                                return (
                                    <div 
                                        key={item._id}
                                        className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                        onClick={() => {
                                            navigate(`/profile/${item.name.replace(/\s+/g, '-').toLowerCase()}-${item.userId || item._id}`);
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative shrink-0">
                                                <img 
                                                    src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                                                    alt={item.name}
                                                    className="w-11 h-11 rounded-full object-cover border-2 border-white/5 group-hover:border-accent-blue/30 transition-all shadow-lg"
                                                />
                                                <div className="absolute inset-0 rounded-full border border-white/10"></div>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-white truncate flex items-center gap-1 group-hover:text-accent-blue transition-colors">
                                                    {item.name}
                                                </h4>
                                                <p className="text-[11px] text-text-secondary truncate font-medium">
                                                    {item.headline || `@${item.userId || 'user'}`}
                                                </p>
                                            </div>
                                        </div>

                                        {!isSelf && (
                                            <button 
                                                onClick={(e) => handleFollowToggle(e, item)}
                                                disabled={actionLoading === item._id}
                                                className={`shrink-0 p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-[11px] font-bold active:scale-95 ${
                                                    isFollowing 
                                                    ? 'border-white/10 text-text-secondary hover:text-red-400 hover:border-red-400/30' 
                                                    : 'border-accent-blue/30 text-accent-blue hover:bg-accent-blue hover:text-white shadow-lg shadow-accent-blue/5'
                                                }`}
                                            >
                                                {actionLoading === item._id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : isFollowing ? (
                                                    <>
                                                        <UserMinus size={14} className="hidden sm:inline" />
                                                        <span>Unfollow</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={14} className="hidden sm:inline" />
                                                        <span>Follow</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        
                                        {isSelf && (
                                            <div className="text-[10px] font-bold text-accent-blue/40 uppercase tracking-widest px-2 py-1 bg-accent-blue/5 rounded-lg border border-accent-blue/10">
                                                You
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 px-6 text-center select-none">
                            <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <Search size={28} className="text-text-secondary opacity-20" />
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">No users found</h4>
                            <p className="text-xs text-text-secondary max-w-[200px] mx-auto leading-relaxed">
                                {searchQuery ? `We couldn't find any matches for "${searchQuery}"` : "This list is currently empty"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Indicator */}
                <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center">
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        InterviewMate Network <div className="w-1 h-1 rounded-full bg-accent-blue"></div> {filteredUsers.length} Users
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FollowModal;
