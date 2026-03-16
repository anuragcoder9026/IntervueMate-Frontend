import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, MoreHorizontal, UserPlus, UserMinus, ShieldOff, Shield, ShieldBan } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { followUser, unfollowUser, blockUser, unblockUser } from '../../store/authSlice';
import { toast } from 'react-toastify';

const ConnectionRow = ({ userId, profileId, name, headline, university, connectedDate, image, actionButtons, showActionsForSelf = false, onMessageClick, isOnline }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);
    const menuRef = useRef(null);

    const handleProfileClick = () => {
        const idToUse = profileId || userId;
        if (idToUse) {
            const nameSlug = name ? name.replace(/\s+/g, '').toLowerCase() : 'user';
            navigate(`/profile/${nameSlug}-${idToUse}`);
        }
    };

    const showActions = showActionsForSelf || user?._id !== userId;

    const isFollowing = user?.following?.some(fId => (fId._id || fId).toString() === userId?.toString());
    const isBlocked = user?.blockedUsers?.some(bId => (bId._id || bId).toString() === userId?.toString());

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleFollow = async () => {
        setMenuOpen(false);
        try {
            await dispatch(followUser(userId)).unwrap();
            toast.success(`Following ${name}`);
        } catch (err) {
            if (err?.includes?.('blocked')) {
                toast.error(err);
            } else {
                toast.error(err || 'Failed to follow');
            }
        }
    };

    const handleUnfollow = async () => {
        setMenuOpen(false);
        try {
            await dispatch(unfollowUser(userId)).unwrap();
            toast.success(`Unfollowed ${name}`);
        } catch (err) {
            toast.error(err || 'Failed to unfollow');
        }
    };

    const handleBlock = async () => {
        setMenuOpen(false);
        setIsBlockConfirmOpen(true);
    };

    const confirmBlockUser = async () => {
        setIsBlockConfirmOpen(false);
        try {
            await dispatch(blockUser(userId)).unwrap();
            toast.success(`${name} has been blocked`);
        } catch (err) {
            toast.error(err || 'Failed to block user');
        }
    };

    const handleUnblock = async () => {
        setMenuOpen(false);
        try {
            await dispatch(unblockUser(userId)).unwrap();
            toast.success(`${name} has been unblocked`);
        } catch (err) {
            toast.error(err || 'Failed to unblock user');
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border-primary/50 last:border-0 group transition-all">
            <div className="flex gap-3 flex-1 overflow-hidden">
                <div className="relative shrink-0 cursor-pointer" onClick={handleProfileClick}>
                    <img
                        src={image}
                        alt={name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-border-primary group-hover:border-accent-blue/50 transition-all object-cover"
                    />
                    {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-bg-primary rounded-full"></div>
                    )}
                </div>
                <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5" onClick={handleProfileClick}>
                        <h4 className="font-bold text-sm text-text-primary group-hover:text-white transition-colors cursor-pointer truncate">{name}</h4>
                        {name === "Divyanshu Varshney" && <CheckCircle2 size={14} className="text-accent-blue shrink-0" />}
                    </div>
                    <p className="text-[11px] text-text-secondary leading-tight line-clamp-2">
                        {university} {headline && `|| ${headline}`}
                    </p>
                    <p className="text-[9px] text-text-secondary/60 pt-1">Connected on {connectedDate}</p>
                </div>
            </div>
            {showActions && <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-0 border-border-primary/30">
                {actionButtons ? actionButtons : (
                    <>
                        <button
                            onClick={onMessageClick ? () => onMessageClick(userId) : undefined}
                            className="flex-1 sm:flex-none px-4 py-1.5 border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white rounded-full text-[11px] font-bold transition-all active:scale-95 text-center"
                        >
                            Message
                        </button>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-1.5 text-text-secondary hover:text-white hover:bg-bg-tertiary rounded-lg transition-colors shrink-0"
                            >
                                <MoreHorizontal size={18} />
                            </button>
                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a2235] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden" style={{ animation: 'menuFadeIn 0.15s ease-out' }}>
                                    {/* Follow / Unfollow */}
                                    {isFollowing ? (
                                        <button
                                            onClick={handleUnfollow}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all text-left"
                                        >
                                            <UserMinus size={14} />
                                            Unfollow {name.split(' ')[0]}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleFollow}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-text-secondary hover:text-accent-blue hover:bg-white/5 transition-all text-left"
                                        >
                                            <UserPlus size={14} />
                                            Follow {name.split(' ')[0]}
                                        </button>
                                    )}

                                    <div className="h-px bg-white/5 mx-3 my-1"></div>

                                    {/* Block / Unblock */}
                                    {isBlocked ? (
                                        <button
                                            onClick={handleUnblock}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-text-secondary hover:text-emerald-400 hover:bg-white/5 transition-all text-left"
                                        >
                                            <Shield size={14} />
                                            Unblock {name.split(' ')[0]}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleBlock}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left"
                                        >
                                            <ShieldOff size={14} />
                                            Block {name.split(' ')[0]}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>}

            <style>{`
                @keyframes menuFadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Block Confirmation Modal */}
            {isBlockConfirmOpen && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBlockConfirmOpen(false)}></div>
                    <div className="relative bg-[#1E293B] border border-border-primary rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animation-scale-in">
                        <div className="p-5 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <ShieldBan size={24} className="text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Block User</h3>
                            <p className="text-sm text-text-secondary">Are you sure you want to block {name}? You will not be able to message them or see their posts.</p>
                        </div>
                        <div className="flex border-t border-border-primary">
                            <button
                                onClick={() => setIsBlockConfirmOpen(false)}
                                className="flex-1 py-3 text-sm font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBlockUser}
                                className="flex-1 py-3 text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-colors border-l border-border-primary"
                            >
                                Block
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectionRow;
