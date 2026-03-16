import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, X, Loader2, MessageSquare, Settings, UserMinus, ShieldBan, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { blockUser, unblockUser } from '../../store/authSlice';

const ChatSidebar = ({
    user,
    conversations,
    followingUsers,
    activeConversation,
    setActiveConversation,
    onlineUsers,
    typingUsers,
    searchQuery,
    setSearchQuery,
    loadingConversations,
    startConversation,
    setIsMobileChatOpen,
    sidebarWidth,
    startResizing,
    isResizing,
    getOtherParticipant,
    formatTime,
    isMobileChatOpen,
    handleDeleteConversation,
    isShareMode,
    selectedShareIds,
    toggleShareSelection,
    handleShareSend
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [deleteModalConvId, setDeleteModalConvId] = useState(null);
    const [blockModalUserId, setBlockModalUserId] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdownId && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdownId]);

    const handleBlockToggle = (e, targetUserId, isBlocked) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        if (isBlocked) {
            dispatch(unblockUser(targetUserId));
        } else {
            setBlockModalUserId(targetUserId);
        }
    };

    const confirmBlockUser = () => {
        if (blockModalUserId) {
            dispatch(blockUser(blockModalUserId));
        }
        setBlockModalUserId(null);
    };

    const onDeleteConversationClick = (e, convId) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        setDeleteModalConvId(convId);
    };

    const confirmDeleteConversation = () => {
        if (handleDeleteConversation && deleteModalConvId) {
            handleDeleteConversation(deleteModalConvId);
        }
        setDeleteModalConvId(null);
    };

    // Build sidebar items: conversations first, then followed users without conversations
    const conversationUserIds = new Set();
    conversations.forEach(conv => {
        const other = getOtherParticipant(conv);
        if (other?._id) conversationUserIds.add(other._id);
    });

    const followingWithoutConv = followingUsers.filter(fu => !conversationUserIds.has(fu._id));

    // Filter by search
    const filteredConversations = conversations.filter(conv => {
        if (!searchQuery) return true;
        const other = getOtherParticipant(conv);
        return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const filteredFollowing = followingWithoutConv.filter(fu => {
        if (!searchQuery) return true;
        return fu.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className={`w-full md:w-[var(--sidebar-width)] relative bg-[#111827] flex-col shrink-0 ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}`} style={{ '--sidebar-width': `${sidebarWidth}px` }}>
            {/* Resizer */}
            <div className="absolute top-0 right-[-6px] w-3 h-full cursor-col-resize hidden md:flex justify-center z-30 group" onMouseDown={startResizing}>
                <div className={`w-[2px] h-full transition-colors ${isResizing ? 'bg-accent-blue' : 'bg-transparent group-hover:bg-accent-blue/50'}`} />
            </div>

            {/* Header */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-white tracking-tight">{isShareMode ? 'Share Post' : 'Chats'}</h2>
                    {isShareMode ? (
                        <button
                            onClick={() => navigate('/messages', { replace: true })}
                            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                    ) : (
                        <button className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <MoreVertical size={18} />
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/70" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search chats"
                        className="w-full bg-[#1C2436] text-sm text-gray-300 placeholder-text-secondary/60 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent-blue/40 border border-transparent transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/70 hover:text-white">
                            <X size={15} />
                        </button>
                    )}
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loadingConversations ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="animate-spin text-accent-blue" />
                    </div>
                ) : (
                    <>
                        {/* Active conversations */}
                        {filteredConversations.map((conv) => {
                            const other = getOtherParticipant(conv);
                            const isActive = activeConversation?._id === conv._id;
                            const isOnline = other && onlineUsers?.has(other?._id);
                            const typing = typingUsers[conv._id];

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => {
                                        if (isShareMode) {
                                            toggleShareSelection(conv._id);
                                        } else {
                                            navigate(`/messages/${conv._id}`);
                                            setActiveConversation(conv);
                                            setIsMobileChatOpen(true);
                                        }
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-all relative group
                                    ${isActive && !isShareMode ? 'bg-[#1C2436]' : 'hover:bg-white/[0.03]'}
                                    ${isShareMode && selectedShareIds.includes(conv._id) ? 'bg-accent-blue/5' : ''}`}
                                >
                                    {isActive && !isShareMode && <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-accent-blue rounded-r-full" />}
                                    <div className="relative shrink-0">
                                        <img
                                            src={other?.avatar || `https://ui-avatars.com/api/?name=${other?.name || 'U'}&background=random`}
                                            className="w-[50px] h-[50px] rounded-full object-cover"
                                            alt={other?.name}
                                        />
                                        {isOnline && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111827]" />}
                                    </div>
                                    <div className="flex-1 min-w-0 border-b border-[#1E293B]/60 pb-3 group-last:border-b-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-[15px] truncate font-semibold text-white pr-2">{other?.name || 'Unknown'}</span>

                                            <div className="flex items-center gap-1 shrink-0 relative" ref={openDropdownId === conv._id ? dropdownRef : null}>
                                                {!isShareMode ? (
                                                    <>
                                                        <span className="text-[11px] text-text-secondary/70 mr-1">
                                                            {formatTime(conv.lastMessage?.timestamp || conv.updatedAt)}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdownId(openDropdownId === conv._id ? null : conv._id);
                                                            }}
                                                            className="p-1 hover:bg-white/10 rounded-md transition-colors text-text-secondary hover:text-white"
                                                        >
                                                            <MoreVertical size={14} />
                                                        </button>

                                                        {openDropdownId === conv._id && (
                                                            <div className="absolute top-full right-0 mt-1 w-48 bg-[#1E293B] border border-border-primary rounded-xl shadow-xl z-50 overflow-hidden py-1">
                                                                <button
                                                                    onClick={(e) => handleBlockToggle(e, other._id, user?.blockedUsers?.some(u => (u._id || u).toString() === other._id.toString()))}
                                                                    className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-white/5 transition-colors text-left"
                                                                >
                                                                    {user?.blockedUsers?.some(u => (u._id || u).toString() === other._id.toString()) ? (
                                                                        <><UserMinus size={14} /> <span className="font-medium">Unblock User</span></>
                                                                    ) : (
                                                                        <><ShieldBan size={14} className="text-red-400" /> <span className="font-medium text-red-400">Block User</span></>
                                                                    )}
                                                                </button>
                                                                <div className="h-px bg-white/5 my-1 mx-2"></div>
                                                                <button
                                                                    onClick={(e) => onDeleteConversationClick(e, conv._id)}
                                                                    className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-red-400 hover:bg-red-400/10 transition-colors text-left"
                                                                >
                                                                    <Trash2 size={14} />
                                                                    <span className="font-medium">Delete Chat</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${selectedShareIds.includes(conv._id) ? 'bg-accent-blue border-accent-blue' : 'border-white/20'}`}>
                                                        {selectedShareIds.includes(conv._id) && (
                                                            <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in duration-200" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[13px] truncate text-text-secondary/80 leading-tight pr-6">
                                            {typing
                                                ? <span className="text-emerald-400 italic">typing...</span>
                                                : conv.lastMessage?.text || 'No messages yet'
                                            }
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Following users without conversations */}
                        {filteredFollowing.length > 0 && (
                            <>
                                {filteredConversations.length > 0 && (
                                    <div className="px-4 py-2 mt-1">
                                        <p className="text-[11px] font-semibold text-text-secondary/60 uppercase tracking-wider">Following</p>
                                    </div>
                                )}
                                {filteredFollowing.map((fu) => {
                                    const isOnline = onlineUsers?.has(fu._id);
                                    return (
                                        <div
                                            key={fu._id}
                                            onClick={() => {
                                                if (isShareMode) {
                                                    toggleShareSelection(fu._id);
                                                } else {
                                                    startConversation(fu._id);
                                                }
                                            }}
                                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-all hover:bg-white/[0.03] group
                                            ${isShareMode && selectedShareIds.includes(fu._id) ? 'bg-accent-blue/5' : ''}`}
                                        >
                                            <div className="relative shrink-0">
                                                <img
                                                    src={fu.avatar || `https://ui-avatars.com/api/?name=${fu.name}&background=random`}
                                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                                    alt={fu.name}
                                                />
                                                {isOnline && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111827]" />}
                                            </div>
                                            <div className="flex-1 min-w-0 border-b border-[#1E293B]/60 pb-3 group-last:border-b-0 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[15px] truncate font-semibold text-white block">{fu.name}</span>
                                                    <p className="text-[13px] truncate text-text-secondary/50 leading-tight">
                                                        {fu.headline || 'Tap to start chatting'}
                                                    </p>
                                                </div>
                                                {isShareMode && (
                                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ml-4 ${selectedShareIds.includes(fu._id) ? 'bg-accent-blue border-accent-blue' : 'border-white/20'}`}>
                                                        {selectedShareIds.includes(fu._id) && (
                                                            <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in duration-200" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {filteredConversations.length === 0 && filteredFollowing.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                <MessageSquare size={48} className="text-text-secondary/30 mb-3" />
                                <p className="text-text-secondary text-sm">No chats yet</p>
                                <p className="text-text-secondary/50 text-xs mt-1">Follow users to start messaging them</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Sidebar Footer */}
            <div className={`p-4 border-t border-[#1E293B]/60 bg-[#111827]/80 backdrop-blur-md transition-all duration-300 ${isShareMode ? 'border-t-accent-blue/50' : ''}`}>
                {isShareMode ? (
                    <button
                        onClick={handleShareSend}
                        disabled={selectedShareIds.length === 0}
                        className="w-full py-3.5 bg-accent-blue hover:bg-accent-blue/90 disabled:bg-white/5 disabled:text-text-secondary/40 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-accent-blue/20 flex items-center justify-center gap-2"
                    >
                        Send Post ({selectedShareIds.length})
                    </button>
                ) : (
                    <div className="flex items-center justify-between group/footer">
                        <div className="flex items-center gap-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="relative shrink-0">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random`}
                                    className="w-[38px] h-[38px] rounded-full object-cover border border-white/10"
                                    alt={user?.name}
                                />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#111827]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-semibold text-white truncate">{user?.name || 'My Profile'}</h4>
                                <p className="text-[11px] text-text-secondary/60 truncate">{user?.email || 'Online'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/messages/settings')}
                            className={`p-2 rounded-lg transition-all ${window.location.pathname === '/messages/settings' ? 'text-accent-blue bg-accent-blue/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                            title="Settings"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalConvId && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalConvId(null)}></div>
                    <div className="relative bg-[#1E293B] border border-border-primary rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animation-scale-in">
                        <div className="p-5 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} className="text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Delete Conversation</h3>
                            <p className="text-sm text-text-secondary">Are you sure you want to delete this chat? This will permanently delete all messages for both users.</p>
                        </div>
                        <div className="flex border-t border-border-primary">
                            <button
                                onClick={() => setDeleteModalConvId(null)}
                                className="flex-1 py-3 text-sm font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteConversation}
                                className="flex-1 py-3 text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-colors border-l border-border-primary"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Confirmation Modal */}
            {blockModalUserId && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBlockModalUserId(null)}></div>
                    <div className="relative bg-[#1E293B] border border-border-primary rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animation-scale-in">
                        <div className="p-5 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                <ShieldBan size={24} className="text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Block User</h3>
                            <p className="text-sm text-text-secondary">Are you sure you want to block this user? You will not be able to message them or see their posts.</p>
                        </div>
                        <div className="flex border-t border-border-primary">
                            <button
                                onClick={() => setBlockModalUserId(null)}
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

export default ChatSidebar;
