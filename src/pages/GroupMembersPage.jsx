import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import GroupLeftSidebar from '../components/GroupLeftSidebar';
import GroupRightSidebar from '../components/GroupRightSidebar';
import ConnectionRow from '../components/friends/ConnectionRow';
import { Search, Users, Shield, UserCheck } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGroup, getGroupMembers } from '../store/groupSlice';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import FollowToMessageModal from '../components/group/FollowToMessageModal';

const GroupMembersPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { socket, onlineUsers } = useSocket() || {};

    const { currentGroup, groupAdmins, groupMembers, isMembersLoading, isError, message } = useSelector((state) => state.group);
    const { user: currentUser } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [followModalMember, setFollowModalMember] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(getGroup(id));
            dispatch(getGroupMembers(id));
        }
    }, [dispatch, id]);

    const isFollowingUser = (userId) => {
        return currentUser?.following?.some(fId => (fId._id || fId).toString() === userId.toString());
    };

    const startConversation = async (userId) => {
        try {
            const res = await api.post('/messages/conversations', { targetUserId: userId });
            if (res.data.success) {
                navigate(`/messages/${res.data.data._id}`);
            }
        } catch (err) {
            console.error('Message start error:', err);
            toast.error('Failed to start conversation');
        }
    };

    const handleMessageClick = async (userId) => {
        if (isFollowingUser(userId)) {
            startConversation(userId);
        } else {
            // Check if a conversation already exists (other user may have initiated it)
            try {
                const res = await api.get('/messages/conversations');
                if (res.data.success) {
                    const existing = res.data.data.find(conv => {
                        const u1 = conv.user1?._id || conv.user1;
                        const u2 = conv.user2?._id || conv.user2;
                        return u1 === userId || u2 === userId;
                    });
                    if (existing) {
                        navigate(`/messages/${existing._id}`);
                        return;
                    }
                }
            } catch (err) {
                // If check fails, fall through to follow modal
            }

            // No existing conversation and not following — show follow modal
            const allMembers = [...(groupAdmins || []), ...(groupMembers || [])];
            const member = allMembers.find(m => m._id === userId);
            if (member) {
                setFollowModalMember({ ...member, isOnline: isUserOnline(member) });
            }
        }
    };

    const isUserOnline = (user) => {
        return user.isOnline || (onlineUsers && onlineUsers.has(user._id?.toString()));
    };

    const sortMembers = (members) => {
        return [...members].sort((a, b) => {
            const aOnline = isUserOnline(a);
            const bOnline = isUserOnline(b);
            if (aOnline && !bOnline) return -1;
            if (!aOnline && bOnline) return 1;
            return 0;
        });
    };

    // Calculate actual counts
    const onlineCount = (groupMembers?.filter(isUserOnline).length || 0) + (groupAdmins?.filter(isUserOnline).length || 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newMembersCount =
        (groupMembers?.filter(m => m.joinedAt && new Date(m.joinedAt) > oneWeekAgo).length || 0) +
        (groupAdmins?.filter(a => a.createdAt && new Date(a.createdAt) > oneWeekAgo).length || 0);

    const groupInfo = currentGroup ? {
        name: currentGroup.name,
        description: currentGroup.description,
        privacy: currentGroup.privacy || 'public',
        members: (currentGroup.memberCount || currentGroup.members?.length || 0) >= 1000 ? ((currentGroup.memberCount || currentGroup.members?.length || 0) / 1000).toFixed(1) + 'k' : (currentGroup.memberCount || currentGroup.members?.length || 0),
        online: onlineCount,
        newMembers: newMembersCount,
        coverImage: currentGroup.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
        logo: currentGroup.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentGroup.name)}&background=047857&color=fff`
    } : null;

    if (!groupInfo) {
        return (
            <div className="bg-[#131821] min-h-screen text-white flex flex-col items-center justify-center">
                <div className="flex flex-col items-center text-center px-4">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Users size={40} className="text-white/20" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Group Not Found</h1>
                    <p className="text-text-secondary text-sm max-w-sm mb-8">
                        The group you're looking for doesn't exist or you don't have access to its members.
                    </p>
                    <button
                        onClick={() => navigate('/groups')}
                        className="text-accent-blue font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Go Back to Groups
                    </button>
                </div>
            </div>
        );
    }

    const filterUsers = (users) => {
        if (!searchQuery) return users;
        const q = searchQuery.toLowerCase();
        return users.filter(user =>
            user.name?.toLowerCase().includes(q) ||
            user.headline?.toLowerCase().includes(q) ||
            user.education?.some(edu => edu.school?.toLowerCase().includes(q))
        );
    };

    const filteredAdmins = sortMembers(filterUsers(groupAdmins || []));
    const filteredMembers = sortMembers(filterUsers(groupMembers || []));

    const mapUserToRow = (user) => ({
        userId: user._id,
        profileId: user.userId,
        name: user.name,
        headline: user.headline,
        isOnline: isUserOnline(user),
        university: user.education?.length > 0 ? user.education[0].school : 'InterviewMate User',
        connectedDate: user.joinedAt ? formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true }).replace('about ', '') : (user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }).replace('about ', '') : ''),
        image: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
        onMessageClick: currentUser?._id !== user._id ? handleMessageClick : undefined
    });

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <Navbar isGroupMode={true} groupName={groupInfo.name} groupId={id} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8 items-start h-full">

                    {/* Left Sidebar */}
                    <div className="w-full lg:w-64 lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 z-20 pb-4 lg:pb-8">
                        <GroupLeftSidebar groupInfo={groupInfo} activeTab="Members" />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full max-w-2xl space-y-6 lg:h-full lg:overflow-y-auto no-scrollbar pb-8">
                        {/* Header Stats */}
                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                        <Users size={24} className="text-accent-blue" />
                                        Members
                                    </h2>
                                    <p className="text-xs text-text-secondary mt-1">Found {groupInfo.members} total members in this community</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white">{groupInfo.online}</p>
                                        <p className="text-[10px] uppercase font-black text-emerald-400 tracking-widest">Online</p>
                                    </div>
                                    <div className="w-px h-8 bg-border-primary"></div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white">{groupInfo.newMembers}</p>
                                        <p className="text-[10px] uppercase font-black text-accent-blue tracking-widest">New</p>
                                    </div>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search size={18} className="text-text-secondary group-focus-within:text-accent-blue transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search members by name, headline or university..."
                                    className="w-full bg-bg-primary border border-border-primary rounded-xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-accent-blue/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Members Categories */}
                        <div className="space-y-6">
                            {isMembersLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Admins & Moderators */}
                                    {(filteredAdmins.length > 0 || searchQuery !== '') && (
                                        <section>
                                            <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-4 px-1 flex items-center gap-2">
                                                <Shield size={12} className="text-amber-500" />
                                                Admins
                                            </h3>
                                            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4 space-y-2">
                                                {filteredAdmins.length > 0 ? (
                                                    filteredAdmins.map((member) => (
                                                        <div key={member._id} className="relative">
                                                            <ConnectionRow {...mapUserToRow(member)} />
                                                            <div className="absolute top-4 right-16 hidden sm:block">
                                                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black uppercase rounded">Admin</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-text-secondary p-4 text-center italic">No admins found matching your search.</p>
                                                )}
                                            </div>
                                        </section>
                                    )}

                                    {/* All Members */}
                                    {(filteredMembers.length > 0 || searchQuery !== '') && (
                                        <section>
                                            <h3 className="text-[10px] font-black uppercase text-text-secondary tracking-widest mb-4 px-1 flex items-center gap-2">
                                                <UserCheck size={12} className="text-accent-blue" />
                                                Members
                                            </h3>
                                            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4 space-y-2">
                                                {filteredMembers.length > 0 ? (
                                                    filteredMembers.map((member) => (
                                                        <ConnectionRow key={member._id} {...mapUserToRow(member)} />
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-text-secondary p-4 text-center italic">No members found matching your search.</p>
                                                )}
                                            </div>
                                        </section>
                                    )}

                                    {!isMembersLoading && filteredAdmins.length === 0 && filteredMembers.length === 0 && (
                                        <p className="text-center text-text-secondary text-sm my-10">Nobody found with that search query.</p>
                                    )}

                                    {(!searchQuery && filteredMembers.length >= 20) && (
                                        <button className="w-full py-4 text-sm font-bold text-accent-blue hover:text-white hover:bg-bg-secondary border border-dashed border-border-primary rounded-2xl transition-all">
                                            Load More Members
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden xl:block w-[320px] lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 pb-8">
                        <GroupRightSidebar />
                    </div>
                </div>
            </div>

            {/* Follow-to-Message Modal */}
            <FollowToMessageModal
                isOpen={!!followModalMember}
                onClose={() => setFollowModalMember(null)}
                member={followModalMember}
                onMessageReady={startConversation}
            />
        </div>
    );
};

export default GroupMembersPage;

