import React, { useState, useRef, useEffect } from 'react';
import { Settings, Pencil, Mail, UserPlus, MoreHorizontal, MapPin, GraduationCap, Link as LinkIcon, Camera, Loader2, UserMinus, ShieldBan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, reset, followUser, unfollowUser, blockUser, unblockUser } from '../../store/authSlice';
import { toast } from 'react-toastify';
import EditProfileCardModal from './EditProfileCardModal';
import api from '../../utils/api';

const ProfileHeader = ({ displayUser, isOwnProfile }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isUpdating, user: currentUser } = useSelector((state) => state.auth);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const displayUserIdStr = displayUser?._id?.toString();
    const isFollowing = currentUser?.following?.some(id => (id._id || id).toString() === displayUserIdStr);
    const isBlocked = currentUser?.blockedUsers?.some(id => (id._id || id).toString() === displayUserIdStr);

    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
    const [messageFollowModalOpen, setMessageFollowModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showOptionsDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowOptionsDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showOptionsDropdown]);

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await dispatch(unfollowUser(displayUser._id)).unwrap();
            } else {
                await dispatch(followUser(displayUser._id)).unwrap();
            }
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to perform action');
        }
    };

    const handleBlockToggle = async () => {
        setShowOptionsDropdown(false);
        if (isBlocked) {
            try {
                await dispatch(unblockUser(displayUser._id)).unwrap();
                toast.success(`Unblocked ${displayUser.name}`);
            } catch (err) {
                toast.error(typeof err === 'string' ? err : 'Failed to unblock user');
            }
        } else {
            setBlockConfirmOpen(true);
        }
    };

    const confirmBlockUser = async () => {
        setBlockConfirmOpen(false);
        try {
            await dispatch(blockUser(displayUser._id)).unwrap();
            toast.success(`Blocked ${displayUser.name}`);
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to block user');
        }
    };

    const handleMessageClick = async () => {
        if (!isFollowing) {
            setMessageFollowModalOpen(true);
            return;
        }

        try {
            const res = await api.post('/messages/conversations', { targetUserId: displayUser._id });
            const convId = res.data.data?._id;
            navigate(`/messages/${convId}`);
        } catch (error) {
            toast.error('Failed to open message conversation');
        }
    };

    // Image Refs
    const bannerInputRef = useRef(null);
    const avatarInputRef = useRef(null);

    const bannerPreview = displayUser?.banner;
    const avatarPreview = displayUser?.avatar || `https://ui-avatars.com/api/?name=${displayUser?.name || 'User'}&background=random`;

    const handleBannerClick = () => isOwnProfile && bannerInputRef.current.click();
    const handleAvatarClick = () => isOwnProfile && avatarInputRef.current.click();

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                if (type === 'banner') {
                    dispatch(updateProfile({ banner: base64String }));
                } else {
                    dispatch(updateProfile({ avatar: base64String }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden shadow-sm relative">
            {/* Banner */}
            <div
                className={`h-32 sm:h-48 relative overflow-hidden group/banner ${!bannerPreview ? 'bg-gradient-to-r from-blue-900/80 to-indigo-900/80 bg-[#1e293b]' : ''
                    }`}
            >
                {bannerPreview && (
                    <img src={bannerPreview} className="w-full h-full object-cover" alt="Banner" />
                )}
                <input
                    type="file"
                    ref={bannerInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'banner')}
                />
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                    {isOwnProfile && (
                        <>
                            <button onClick={() => navigate('/settings')} className="p-2 bg-black/40 hover:bg-black/60 transition-colors rounded-full text-white backdrop-blur-sm shadow-lg">
                                <Settings size={16} />
                            </button>
                            <button
                                onClick={handleBannerClick}
                                disabled={isUpdating}
                                className="p-2 bg-black/40 hover:bg-black/60 transition-colors rounded-full text-white backdrop-blur-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Pencil size={16} />
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Avatar & Action Buttons Row */}
            <div className="px-5 sm:px-8 relative pt-4 pb-6">
                <div className="flex justify-between items-end -mt-20 sm:-mt-24 mb-4 relative z-10">
                    <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
                        <img
                            src={avatarPreview}
                            alt="Profile"
                            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-bg-secondary object-cover shadow-lg transition-all duration-300 ${isOwnProfile ? 'group-hover/avatar:brightness-75' : ''}`}
                        />
                        {isOwnProfile && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px] rounded-full">
                                <div className="bg-black/40 backdrop-blur-md rounded-full p-3 border border-white/20 shadow-xl">
                                    {isUpdating ? (
                                        <Loader2 size={24} className="text-white animate-spin" />
                                    ) : (
                                        <Camera size={24} className="text-white" />
                                    )}
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={avatarInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'avatar')}
                        />
                    </div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-4">
                        {!isOwnProfile && (
                            <>
                                <button onClick={handleMessageClick} className="flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full border border-accent-blue text-accent-blue font-bold text-xs sm:text-sm hover:bg-accent-blue/10 transition-colors">
                                    <Mail size={16} /> <span className="hidden sm:inline">Message</span>
                                </button>
                                <button
                                    onClick={handleFollowToggle}
                                    className={`flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-colors shadow-lg ${isFollowing
                                        ? 'bg-bg-tertiary text-text-secondary border border-border-primary hover:text-white'
                                        : 'bg-accent-blue text-white hover:bg-blue-600 shadow-accent-blue/20'
                                        }`}
                                >
                                    {isFollowing ? (
                                        <><span>Unfollow</span></>
                                    ) : (
                                        <><UserPlus size={16} /> <span className="hidden sm:inline">Follow</span></>
                                    )}
                                </button>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                                        className="p-1.5 sm:p-2 border border-border-primary rounded-full text-text-secondary hover:text-white hover:bg-bg-tertiary transition-all active:scale-95"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>

                                    {showOptionsDropdown && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#1E293B] border border-border-primary rounded-xl shadow-xl z-50 py-1 animation-scale-in origin-top-right">
                                            <button
                                                onClick={handleBlockToggle}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-white/5 transition-colors text-left"
                                            >
                                                {isBlocked ? (
                                                    <><UserMinus size={16} /> <span className="font-semibold">Unblock User</span></>
                                                ) : (
                                                    <><ShieldBan size={16} className="text-red-400" /> <span className="font-semibold text-red-400">Block User</span></>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {isOwnProfile && (
                            <button
                                onClick={() => {
                                    dispatch(reset());
                                    setIsEditModalOpen(true);
                                }}
                                className="p-1.5 sm:p-2 border border-border-primary rounded-full text-text-secondary hover:text-white hover:bg-bg-tertiary transition-all active:scale-95"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Info details */}
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{displayUser?.name}</h1>
                        <span className="text-sm font-medium text-text-secondary mt-1">@{displayUser?.userId}</span>
                        {displayUser?.role && (
                            <span className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm border ${displayUser.role === 'student' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                displayUser.role === 'professional' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                    'bg-white/5 border-white/10 text-white/50'
                                }`}>
                                {displayUser.role}
                            </span>
                        )}
                    </div>
                    <p className="text-sm sm:text-base text-white/90 font-medium mb-3">
                        {displayUser?.headline}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-text-secondary mb-4">
                        {displayUser?.location && (
                            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                                <MapPin size={14} /> {displayUser.location}
                            </div>
                        )}
                        {displayUser?.education && (
                            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                                <GraduationCap size={14} /> {displayUser.education}
                            </div>
                        )}
                        {displayUser?.website && (
                            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors text-accent-blue">
                                <LinkIcon size={14} /> {displayUser.website}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-text-secondary">
                        <span className="hover:text-white cursor-pointer transition-colors"><span className="text-accent-blue">{displayUser?.following?.length || 0}</span> Following</span>
                        <span className="hover:text-white cursor-pointer transition-colors"><span className="text-accent-blue">{displayUser?.followers?.length || 0}</span> Followers</span>
                    </div>
                </div>
            </div>

            {isOwnProfile && (
                <EditProfileCardModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={displayUser}
                />
            )}
            {/* Block Confirmation Modal */}
            {blockConfirmOpen && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBlockConfirmOpen(false)}></div>
                    <div className="relative bg-[#1E293B] border border-border-primary rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animation-scale-in">
                        <div className="p-5 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <ShieldBan size={24} className="text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Block User</h3>
                            <p className="text-sm text-text-secondary">Are you sure you want to block {displayUser?.name}? You will not be able to message them or see their posts.</p>
                        </div>
                        <div className="flex border-t border-border-primary">
                            <button
                                onClick={() => setBlockConfirmOpen(false)}
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

            {/* Follow To Message Modal */}
            {messageFollowModalOpen && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-all"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMessageFollowModalOpen(false)}></div>
                    <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl shadow-2xl w-full max-w-[380px] overflow-hidden animation-scale-in">
                        {/* Decorative Header */}
                        <div className="h-24 bg-gradient-to-r from-accent-blue/20 via-blue-500/10 to-purple-500/20 relative">
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                        </div>

                        <div className="px-6 pb-6 text-center relative">
                            {/* Overlapping Avatar with Icon Badge */}
                            <div className="flex justify-center -mt-12 mb-4 relative z-10">
                                <div className="relative">
                                    <img src={avatarPreview} className="w-24 h-24 rounded-full border-4 border-[#1E293B] object-cover bg-[#1E293B] shadow-lg" alt={displayUser?.name} />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-accent-blue rounded-full border-4 border-[#1E293B] flex items-center justify-center shadow-lg">
                                        <Mail size={12} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Connect to Message</h3>

                            <p className="text-[14px] text-text-secondary mb-6 leading-relaxed">
                                You need to follow <span className="font-semibold text-white">{displayUser?.name}</span> to start a conversation.
                            </p>

                            {/* Profile Snippet */}
                            <div className="bg-white/5 rounded-xl p-3 mb-6 flex items-center gap-3 text-left border border-white/5">
                                <div className="p-2 bg-accent-blue/10 rounded-lg shrink-0">
                                    <GraduationCap size={18} className="text-accent-blue" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-white text-[13px] truncate">{displayUser?.role || 'Professional'}</h4>
                                    <p className="text-[12px] text-text-secondary truncate">{displayUser?.college || 'User on InterviewMate'}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setMessageFollowModalOpen(false)}
                                    className="flex-1 py-2.5 text-[14px] font-semibold text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    Not Now
                                </button>
                                <button
                                    onClick={() => {
                                        handleFollowToggle();
                                        setMessageFollowModalOpen(false);
                                    }}
                                    className="flex-1 py-2.5 text-[14px] font-semibold text-white bg-accent-blue hover:bg-blue-600 shadow-lg shadow-accent-blue/25 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <UserPlus size={16} />
                                    Follow
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;
