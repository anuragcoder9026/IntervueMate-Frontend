import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, Clock, Globe, Users, MoreHorizontal, Bookmark, Link2, UserPlus, EyeOff, Flag, Trash2, UserMinus, Plus, Check, ShieldBan, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { followUser, unfollowUser, blockUser, unblockUser } from '../../store/authSlice';
import { useSocket } from '../../context/SocketContext';

const PostHeader = ({ author, role, time, audience, onDelete, isOwner, postId, isSaved, onSave, isSaving }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { onlineUsers } = useSocket();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);
    const dropdownRef = useRef(null);

    const authorId = author?._id || author;
    const authorIdStr = authorId?.toString();
    const isFollowing = user?.following?.some(id => (id._id || id)?.toString() === authorIdStr);
    const isBlocked = user?.blockedUsers?.some(id => (id._id || id)?.toString() === authorIdStr);
    const isOnline = author?.isOnline || onlineUsers?.has(authorIdStr);

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await dispatch(unfollowUser(authorId)).unwrap();
            } else {
                await dispatch(followUser(authorId)).unwrap();
            }
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to perform action');
        }
    };

    const handleBlockClick = async () => {
        setShowDropdown(false);
        if (isBlocked) {
            try {
                await dispatch(unblockUser(authorId)).unwrap();
                toast.success(`Unblocked ${authorName}`);
            } catch (err) {
                toast.error(typeof err === 'string' ? err : 'Failed to unblock user');
            }
        } else {
            setIsBlockConfirmOpen(true);
        }
    };

    const confirmBlockUser = async () => {
        setIsBlockConfirmOpen(false);
        try {
            await dispatch(blockUser(authorId)).unwrap();
            toast.success(`Blocked ${authorName}`);
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to block user');
        }
    };

    const authorName = author?.name || author || 'User';
    const authorAvatar = author?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=random`;
    const authorRole = author?.role;

    const postSlug = `${authorName.replace(/\s+/g, '').toLowerCase()}-${postId}`;

    const handleAuthorClick = () => {
        const handle = author?.userId;
        if (handle) {
            const nameSlug = authorName.replace(/\s+/g, '').toLowerCase();
            navigate(`/profile/${nameSlug}-${handle}`);
        } else {
            navigate('/profile');
        }
    };

    const handlePostClick = () => {
        navigate(`/post/${postSlug}`);
    };

    const handleCopyLink = () => {
        const fullLink = `${window.location.origin}/post/${postSlug}`;
        navigator.clipboard.writeText(fullLink)
            .then(() => {
                toast.success('Link copied to clipboard!');
                setShowDropdown(false);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast.error('Failed to copy link');
            });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <React.Fragment>
            <div className="p-3 sm:p-4 flex justify-between items-start gap-3">
                <div className="flex gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="relative shrink-0 cursor-pointer" onClick={handleAuthorClick}>
                        <img
                            src={authorAvatar}
                            className="w-10 h-10 rounded-full object-cover"
                            alt={authorName}
                        />
                        {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg-primary" title="Online" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0 font-outfit">
                            <h4
                                onClick={handleAuthorClick}
                                className="text-sm font-bold text-text-primary hover:text-accent-blue cursor-pointer truncate"
                            >
                                {authorName}
                            </h4>
                            <span className="text-[10px] text-text-secondary font-medium shrink-0">• 1st</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-text-secondary mt-0.5">
                            <span className="hover:underline cursor-pointer truncate max-w-full block">{authorRole}</span>
                            <span className="shrink-0">•</span>
                            <div
                                onClick={handlePostClick}
                                className="flex items-center gap-0.5 text-[10px] uppercase font-bold tracking-tight shrink-0 cursor-pointer hover:text-white transition-colors"
                            >
                                <Clock size={10} />
                                {time}
                            </div>
                            <span className="shrink-0">•</span>
                            <div
                                className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${audience === 'Anyone' ? 'text-text-secondary' : 'text-accent-blue bg-accent-blue/5 border border-accent-blue/10'
                                    }`}
                            >
                                {audience === 'Anyone' ? <Globe size={10} /> : <Users size={10} />}
                                <span className="truncate max-w-[100px] sm:max-w-[120px]">{audience}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {!isOwner && user && (
                        <button
                            onClick={handleFollowToggle}
                            className={`flex items-center gap-1 text-[13px] font-bold transition-all px-2 py-1 rounded hover:bg-bg-tertiary ${isFollowing ? 'text-text-secondary' : 'text-accent-blue'
                                }`}
                        >
                            {isFollowing ? <><Check size={14} /> <span>Following</span></> : <><Plus size={14} /> <span>Follow</span></>}
                        </button>
                    )}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-text-secondary hover:text-white p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute top-full right-0 mt-1 w-60 bg-bg-secondary border border-border-primary rounded-xl shadow-xl z-50 overflow-hidden py-1 animation-scale-in origin-top-right">
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (isSaving) return;
                                        onSave();
                                        setShowDropdown(false);
                                    }}
                                    disabled={isSaving}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSaving ? (
                                        <Loader2 size={16} className="animate-spin text-amber-500" />
                                    ) : (
                                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-amber-500" : "text-text-secondary"} />
                                    )}
                                    <div className="flex flex-col">
                                        <span className={`font-semibold ${isSaved ? "text-amber-500" : ""}`}>
                                            {isSaving ? (isSaved ? 'Removing...' : 'Saving...') : (isSaved ? 'Saved' : 'Save')}
                                        </span>
                                        <span className="text-[10px] text-text-secondary">
                                            {isSaving ? 'Processing...' : (isSaved ? 'Remove from saved items' : 'Save for later')}
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left"
                                >
                                    <Link2 size={16} className="text-text-secondary" />
                                    <span className="font-semibold">Copy link to post</span>
                                </button>

                                {!isOwner && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleFollowToggle();
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left"
                                        >
                                            {isFollowing ? <UserMinus size={16} className="text-text-secondary" /> : <UserPlus size={16} className="text-text-secondary" />}
                                            <span className="font-semibold">{isFollowing ? 'Unfollow' : 'Follow'} {authorName}</span>
                                        </button>
                                        <button
                                            onClick={handleBlockClick}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left"
                                        >
                                            {isBlocked ? (
                                                <><UserMinus size={16} className="text-text-secondary" /> <span className="font-semibold">Unblock {authorName}</span></>
                                            ) : (
                                                <><ShieldBan size={16} className="text-red-400" /> <span className="font-semibold text-red-400">Block {authorName}</span></>
                                            )}
                                        </button>
                                    </>
                                )}

                                <div className="h-px bg-border-primary/50 my-1 mx-2"></div>

                                {isOwner ? (
                                    <button
                                        onClick={() => {
                                            onDelete();
                                            setShowDropdown(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/10 transition-colors text-left"
                                    >
                                        <Trash2 size={16} />
                                        <span className="font-semibold">Delete Post</span>
                                    </button>
                                ) : (
                                    <>
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left">
                                            <EyeOff size={16} className="text-text-secondary" />
                                            <span className="font-semibold">I don't want to see this</span>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-red-400 hover:bg-red-400/10 transition-colors text-left">
                                            <Flag size={16} />
                                            <span className="font-semibold">Report post</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                            <p className="text-sm text-text-secondary">Are you sure you want to block {authorName}? You will not be able to message them or see their posts.</p>
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
        </React.Fragment>
    );
};

export default PostHeader;
