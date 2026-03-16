import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroup, getGroupPosts, joinGroup, getGroupMembers } from '../store/groupSlice';
import { createPost } from '../store/postSlice';
import Navbar from '../components/Navbar';
import { useSocket } from '../context/SocketContext';
import GroupLeftSidebar from '../components/GroupLeftSidebar';
import GroupRightSidebar from '../components/GroupRightSidebar';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/feed/CreatePostModal';
import { Image, Paperclip, BarChart2, CheckCircle, Save, Download, FileText, Video, Share2, Users, Globe, Link2, MoreHorizontal, MessageSquare, ThumbsUp, Sparkles, Link, ChevronDown, Lock, UserPlus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GroupFeedPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentGroup, groupPosts, isPostsLoading, isLoading: isGroupLoading, isError, message } = useSelector((state) => state.group);
    const { isCreating: isPostCreating } = useSelector((state) => state.post);
    const { user } = useSelector((state) => state.auth);
    const { onlineUsers } = useSocket() || {};
    const [isJoining, setIsJoining] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    // Fetch group and redirect admin to admin page
    useEffect(() => {
        if (id) {
            dispatch(getGroup(id));
            dispatch(getGroupPosts(id));
            dispatch(getGroupMembers(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentGroup && user) {
            const userId = user._id || user.id;
            const isAdmin = currentGroup.admins?.some(a => (a._id || a).toString() === userId);
            if (isAdmin) {
                navigate(`/admin/groups/${id}`, { replace: true });
            }
        }
    }, [currentGroup, user, id, navigate]);

    const getOnlineCount = () => {
        if (!currentGroup || !onlineUsers) return 0;
        const onlineSet = new Set();

        // Combine admin IDs and member IDs
        const adminIds = (currentGroup.admins || []).map(a => (a._id || a).toString());
        const memberIds = (currentGroup.members || []).map(m => (m.user?._id || m.user || m).toString());

        [...adminIds, ...memberIds].forEach(id => {
            if (onlineUsers.has(id)) {
                onlineSet.add(id);
            }
        });

        return onlineSet.size;
    };

    const groupInfo = currentGroup ? {
        name: currentGroup.name,
        description: currentGroup.description,
        privacy: currentGroup.privacy || 'public',
        members: (currentGroup.memberCount || currentGroup.members?.length || 0) >= 1000 ? ((currentGroup.memberCount || currentGroup.members?.length || 0) / 1000).toFixed(1) + 'k' : (currentGroup.memberCount || currentGroup.members?.length || 0),
        online: getOnlineCount(),
        coverImage: currentGroup.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
        logo: currentGroup.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentGroup.name)}&background=047857&color=fff`
    } : null;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreatePost = async (content, attachments = [], tags = [], audience = null) => {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('groupId', currentGroup._id);

        if (tags.length > 0) {
            formData.append('tags', JSON.stringify(tags));
        }

        if (audience) {
            formData.append('audience', audience.name || audience);
        }

        attachments.forEach(file => {
            if (file.file) {
                formData.append('files', file.file);
            }
        });

        try {
            const result = await dispatch(createPost(formData)).unwrap();
            if (result) {
                setIsModalOpen(false);
                toast.success('Post shared with the community!');
            }
        } catch (err) {
            toast.error(err || 'Could not create post. Please try again.');
        }
    };

    // Show loading spinner while fetching
    if (isGroupLoading) {
        return (
            <div className="bg-bg-primary min-h-screen text-text-primary flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-text-secondary font-medium tracking-wide">Loading community...</p>
                </div>
            </div>
        );
    }

    // Show "Not a Member" page when user hasn't joined the group
    if (isError && message?.notMember) {
        const notMemberGroup = message.group;
        const isPrivate = notMemberGroup?.privacy === 'private';
        const alreadyRequested = message.hasRequested || requestSent;

        const handleJoinGroup = async () => {
            if (isJoining || alreadyRequested) return;
            setIsJoining(true);
            try {
                await dispatch(joinGroup(id)).unwrap();
                if (isPrivate) {
                    setRequestSent(true);
                    toast.success('Join request sent successfully!');
                } else {
                    toast.success('You have joined the group!');
                    // Navigate to reload the group as a member
                    window.location.reload();
                }
            } catch (err) {
                toast.error(err || 'Failed to join group');
            } finally {
                setIsJoining(false);
            }
        };

        return (
            <div className="bg-[#131821] min-h-screen text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
                    {/* Group Cover Preview */}
                    <div className="relative w-full max-w-lg rounded-2xl overflow-hidden mb-8 shadow-2xl border border-border-primary">
                        <div className="h-40 overflow-hidden">
                            <img
                                src={notMemberGroup?.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'}
                                className="w-full h-full object-cover"
                                alt="Group"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#131821] via-[#131821]/60 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-4 left-5 right-5 flex items-end gap-4">
                            <div className="w-16 h-16 rounded-xl bg-bg-secondary border-2 border-border-primary overflow-hidden shadow-lg shrink-0">
                                <img
                                    src={notMemberGroup?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(notMemberGroup?.name || 'G')}&background=047857&color=fff`}
                                    className="w-full h-full object-cover"
                                    alt="Logo"
                                />
                            </div>
                            <div className="pb-0.5 min-w-0">
                                <h2 className="text-lg font-bold text-white truncate drop-shadow-md">{notMemberGroup?.name}</h2>
                                <div className="flex items-center gap-3 text-xs text-white/70 mt-0.5">
                                    {isPrivate ? (
                                        <span className="flex items-center gap-1"><Lock size={10} /> Private</span>
                                    ) : (
                                        <span className="flex items-center gap-1"><Globe size={10} /> Public</span>
                                    )}
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Users size={10} /> {notMemberGroup?.memberCount || 0} members</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="text-center max-w-md">
                        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
                            <UserPlus size={28} className="text-accent-blue/70" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">You're Not a Member</h1>
                        <p className="text-text-secondary text-sm leading-relaxed mb-2">
                            {notMemberGroup?.description?.slice(0, 120)}{notMemberGroup?.description?.length > 120 ? '...' : ''}
                        </p>
                        <p className="text-text-secondary text-xs mb-8">
                            {isPrivate
                                ? 'This is a private group. Send a request to the admins to join.'
                                : 'Join this group to view posts, participate in discussions, and connect with members.'}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            {alreadyRequested ? (
                                <div className="px-8 py-3 bg-white/10 text-text-secondary rounded-xl font-bold text-sm flex items-center gap-2 cursor-default">
                                    <CheckCircle size={16} />
                                    Requested
                                </div>
                            ) : (
                                <button
                                    onClick={handleJoinGroup}
                                    disabled={isJoining}
                                    className="px-8 py-3 bg-accent-blue hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-accent-blue/20 active:scale-95 disabled:opacity-50"
                                >
                                    {isJoining ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <UserPlus size={16} />
                                    )}
                                    {isJoining ? 'Processing...' : (isPrivate ? 'Request to Join' : 'Join Group')}
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/groups')}
                                className="px-8 py-3 bg-bg-secondary border border-border-primary text-text-primary hover:text-white hover:border-white/10 rounded-xl font-bold text-sm transition-all active:scale-95"
                            >
                                Discover Groups
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show "Group Not Found" when fetch failed or no group data
    if (!groupInfo || isError) {
        return (
            <div className="bg-[#131821] min-h-screen text-white flex flex-col items-center justify-center">
                <div className="flex flex-col items-center text-center px-4">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Users size={40} className="text-white/20" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Group Not Found</h1>
                    <p className="text-text-secondary text-sm max-w-sm mb-8">
                        The group you're looking for doesn't exist or may have been removed.
                    </p>
                    <button
                        onClick={() => navigate('/feed')}
                        className="text-accent-blue font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Go Back to Feed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary overflow-hidden">
            <Navbar isGroupMode={true} groupName={groupInfo.name} groupId={id} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8 items-start h-full">

                    {/* Left Sidebar - Now Responsive (Horizontal on Mobile) */}
                    <div className="w-full lg:w-64 lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 z-20 pb-4 lg:pb-8">
                        <GroupLeftSidebar groupInfo={groupInfo} activeTab="Feed" />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full max-w-2xl space-y-6 lg:h-full lg:overflow-y-auto no-scrollbar pb-8">
                        {/* Group Banner & Header */}
                        <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden shadow-sm shadow-black/20">
                            <div className="relative h-48 overflow-hidden group">
                                <img
                                    src={groupInfo.coverImage}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt="Group Cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent"></div>

                                {/* Overlaid Logo & Info in Banner */}
                                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                                    <div className="flex items-end gap-4">
                                        <div className="p-1.5 bg-bg-secondary rounded-2xl shadow-xl hidden sm:block">
                                            <img src={groupInfo.logo} className="w-20 h-20 rounded-xl" alt="Logo" />
                                        </div>
                                        <div className="pb-1">
                                            <h1 className="text-2xl font-bold font-outfit text-white drop-shadow-md">
                                                {groupInfo.name}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-bold text-white/80 drop-shadow-md">
                                                <span className="flex items-center gap-1.5"><Globe size={12} className="opacity-70" />{groupInfo?.privacy}</span>
                                                <span className="opacity-50">•</span>
                                                <span className="flex items-center gap-1.5 font-black text-white">{groupInfo.members} Members</span>
                                                <span className="opacity-50">•</span>
                                                <span className="flex items-center gap-1.5 text-emerald-400">
                                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                                    {groupInfo.online} Online
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2.5 bg-accent-blue hover:bg-blue-600 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg active:scale-95">
                                        <CheckCircle size={16} /> Joined
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Create Post Card */}
                        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 shadow-sm">
                            <div className="flex gap-4">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Me')}&background=random`}
                                    className="w-10 h-10 rounded-full object-cover"
                                    alt="Me"
                                />
                                <div className="flex-1 relative flex items-center group">
                                    <input
                                        type="text"
                                        readOnly
                                        onClick={() => setIsModalOpen(true)}
                                        placeholder={`Share something with ${groupInfo.name}...`}
                                        className="w-full bg-bg-primary text-text-primary text-sm font-medium px-5 py-3.5 rounded-full border border-border-primary hover:border-accent-blue/50 focus:outline-none cursor-text transition-all placeholder:text-text-secondary pr-10 shadow-inner"
                                    />
                                    <button className="absolute right-4 text-accent-blue opacity-50 transition-opacity hover:opacity-100 hover:scale-110 active:scale-95 pointer-events-none">
                                        <Sparkles size={16} />
                                    </button>
                                </div>
                            </div>


                            <div className="mt-4 flex justify-between sm:justify-start items-center gap-1 sm:gap-6 ml-2">
                                <button className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white transition-colors group">
                                    <Image size={18} className="text-accent-blue group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">Media</span>
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white transition-colors group">
                                    <FileText size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">File</span>
                                </button>
                                <button className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white transition-colors group">
                                    <Link size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">Link</span>
                                </button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center justify-between border-b border-border-primary/50">
                            <div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-px">
                                <button className="pb-3 border-b-2 border-accent-blue text-white text-[11px] sm:text-sm font-bold px-1 sm:px-2 shrink-0">All Posts</button>
                            </div>
                            <div className="pb-3 text-[10px] sm:text-xs font-black uppercase text-text-secondary flex items-center gap-1.5 shrink-0 ml-4 whitespace-nowrap">
                                <span className="hidden xs:inline">SORT BY:</span>
                                <span className="text-white normal-case font-bold cursor-pointer hover:text-accent-blue flex items-center gap-1 group">
                                    Recent
                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Feed Posts */}
                        <div className="space-y-4">
                            {isPostsLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-10 h-10 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-4 text-text-secondary font-medium italic">Loading community posts...</p>
                                </div>
                            ) : groupPosts && groupPosts.length > 0 ? (
                                groupPosts.map(post => (
                                    <PostCard
                                        key={post._id}
                                        _id={post._id}
                                        author={post.author}
                                        createdAt={post.createdAt}
                                        content={post.content}
                                        images={post.images}
                                        files={post.files}
                                        tags={post.tags}
                                        likes={post.likes}
                                        comments={post.comments}
                                        commentLoading={post.commentLoading}
                                        audience={post.audience}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-bg-secondary border border-border-primary rounded-xl">
                                    <Users size={48} className="mx-auto text-text-secondary opacity-20 mb-4" />
                                    <p className="text-text-secondary font-medium italic">No posts yet. Be the first to share something!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden xl:block w-[320px] lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 pb-8">
                        <GroupRightSidebar />
                    </div>
                </div>
            </div>

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPost={handleCreatePost}
                isLoading={isPostCreating}
            />
        </div>
    );
};

export default GroupFeedPage;
