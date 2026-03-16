import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Shield, User, Loader2, Pin } from 'lucide-react';
import { getGroupMembers, getPinnedMessages } from '../../../store/groupSlice';
import { useSocket } from '../../../context/SocketContext';

const DiscussionRightSidebar = ({ onClose, discussion, onNavigateToMessage }) => {
    const dispatch = useDispatch();
    const { onlineUsers } = useSocket();
    const { currentGroup, groupAdmins, groupMembers, isMembersLoading, pinnedMessages, isPinnedMessagesLoading } = useSelector((state) => state.group);

    useEffect(() => {
        if (currentGroup?._id) {
            // Always fetch members for the current group to ensure data is fresh
            dispatch(getGroupMembers(currentGroup._id));

            // Pinned messages are discussion-specific, always fetch when discussion changes
            if (discussion?._id) {
                dispatch(getPinnedMessages({ groupId: currentGroup._id, discussionId: discussion._id }));
            }
        }
    }, [currentGroup?._id, discussion?._id, dispatch]);

    if (!currentGroup) return null;

    // Identify the discussion moderator (creator) - ONLY for actual user-created discussions
    const hasModerator = discussion?._id && (discussion?.createdBy || discussion?.creator);
    const moderatorId = hasModerator ? (discussion.createdBy?._id || discussion.createdBy || discussion.creator?._id || discussion.creator).toString() : null;

    // Find the moderator object in admins or members to get full user details
    const allUsers = [...(groupAdmins || []), ...(groupMembers || [])];

    // Normalize IDs for comparison and ensure we find the moderator
    let moderatorUser = null;
    if (moderatorId) {
        // Try to find in populated lists first (more detailed info)
        moderatorUser = allUsers.find(u => (u._id || u.id || '').toString() === moderatorId);

        // Fallback to the populated creator on the discussion itself if not found in members
        if (!moderatorUser && typeof (discussion.createdBy || discussion.creator) === 'object') {
            moderatorUser = discussion.createdBy || discussion.creator;
        }
    }

    // Filter others to avoid duplicates
    const admins = (groupAdmins || []).filter(a => (a._id || a.id || '').toString() !== moderatorId);
    const members = (groupMembers || []).filter(m => (m._id || m.id || '').toString() !== moderatorId);

    return (
        <div className="w-[320px] max-w-[85vw] bg-[#1E232E] border-l border-white/5 flex flex-col h-full shrink-0 text-gray-300 relative shadow-2xl lg:shadow-none pb-16 lg:pb-0">
            {/* Header for mobile */}
            <div className="h-12 border-b border-white/5 lg:hidden flex items-center justify-between px-4 shrink-0 bg-[#1E232E]/90 backdrop-blur-md sticky top-0 z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Group Members</span>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">

                {isMembersLoading || isPinnedMessagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-accent-blue" size={24} />
                    </div>
                ) : (
                    <>
                        {/* Pinned Messages Section */}
                        {discussion?._id && pinnedMessages && pinnedMessages.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <Pin size={14} className="text-amber-400 rotate-45" />
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                        Pinned Messages — {pinnedMessages.length}
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    {pinnedMessages.map((msg) => (
                                        <div
                                            key={msg._id}
                                            onClick={() => onNavigateToMessage(msg._id)}
                                            className="bg-white/5 border border-white/5 rounded-lg p-3 relative group/pinned cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <img
                                                    src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${msg.sender?.name}&background=random`}
                                                    className="w-5 h-5 rounded-full object-cover"
                                                    alt={msg.sender?.name}
                                                />
                                                <span className="text-[11px] font-bold text-gray-300">{msg.sender?.name}</span>
                                            </div>
                                            <p className="text-[12px] text-gray-400 line-clamp-3 leading-relaxed">
                                                {msg.text || (msg.type === 'media' ? '[Media Attachment]' : '[Code Snippet]')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Moderator Section */}
                        {moderatorUser && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide px-1">
                                    Discussion Moderator — 1
                                </h3>
                                <div className="space-y-1">
                                    <MemberItem
                                        user={moderatorUser}
                                        isAdmin={groupAdmins?.some(a => (a._id || a.id || '').toString() === moderatorId)}
                                        isModerator={true}
                                        onlineUsers={onlineUsers}
                                        groupCreatorId={currentGroup?.creator?._id || currentGroup?.creator}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Admins Section */}
                        {admins.length > 0 && (
                            <div className="pt-2">
                                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide px-1">
                                    Admins — {admins.length}
                                </h3>
                                <div className="space-y-1">
                                    {admins.map(admin => (
                                        <MemberItem
                                            key={admin._id}
                                            user={admin}
                                            isAdmin={true}
                                            onlineUsers={onlineUsers}
                                            groupCreatorId={currentGroup?.creator?._id || currentGroup?.creator}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Members Section */}
                        {members.length > 0 && (
                            <div className="pt-2">
                                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide px-1">
                                    Members — {members.length}
                                </h3>
                                <div className="space-y-1">
                                    {members.map(member => (
                                        <MemberItem
                                            key={member._id}
                                            user={member}
                                            isAdmin={false}
                                            onlineUsers={onlineUsers}
                                            groupCreatorId={currentGroup?.creator?._id || currentGroup?.creator}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!moderatorUser && admins.length === 0 && members.length === 0 && (
                            <div className="text-center py-8 text-gray-500 italic text-sm">
                                No members found
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

const MemberItem = ({ user, isAdmin, isModerator, onlineUsers, groupCreatorId }) => {
    if (!user) return null;

    const userIdStr = (user._id || user.id || '').toString();
    const isOnline = onlineUsers?.has(userIdStr) || user.isOnline;
    const isGroupCreator = groupCreatorId && groupCreatorId.toString() === userIdStr;

    return (
        <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all group">
            <div className="relative shrink-0">
                <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    className="w-10 h-10 rounded-full object-cover border border-white/5 group-hover:border-accent-blue/30 transition-colors"
                    alt={user.name}
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1E232E] ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-[13px] font-bold truncate group-hover:text-white transition-colors ${isAdmin || isGroupCreator ? 'text-rose-400' : (isModerator ? 'text-accent-blue' : 'text-gray-200')}`}>
                        {user.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                        {(isAdmin || isGroupCreator) && (
                            <span className="text-[8px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1 py-0.5 rounded font-black uppercase tracking-tighter" title="Group Admin">Admin</span>
                        )}
                        {isModerator && !isAdmin && !isGroupCreator && (
                            <span className="text-[8px] bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-1 py-0.5 rounded font-black uppercase tracking-tighter" title="Discussion Moderator">Mod</span>
                        )}
                    </div>
                </div>
                {user.headline ? (
                    <span className="text-[10px] text-gray-500 truncate leading-tight font-medium opacity-80 group-hover:opacity-100 transition-opacity">{user.headline}</span>
                ) : (
                    <span className="text-[10px] text-gray-600 truncate leading-tight font-medium opacity-60">Member since {new Date(user.joinedAt || user.createdAt).getFullYear()}</span>
                )}
            </div>
        </div>
    );
};

export default DiscussionRightSidebar;
