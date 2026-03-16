import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPost, reset } from '../store/postSlice';
import { joinGroup } from '../store/groupSlice';
import Navbar from '../components/Navbar';
import MainLeftSidebar from '../components/MainLeftSidebar';
import MainRightSidebar from '../components/MainRightSidebar';
import AboutGroupSection from '../components/AboutGroupSection';
import PostCard from '../components/PostCard';
import { Loader2, ArrowLeft, Users, Globe, Lock, UserPlus, CheckCircle, Globe2 } from 'lucide-react';
import { toast } from 'react-toastify';

const SinglePostPage = () => {
    const { userNameAndId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Extract postId from the end of the slug: username-postid
    const postId = userNameAndId?.split('-').pop();

    const { currentPost, isLoading, isError, message } = useSelector((state) => state.post);
    const { user } = useSelector((state) => state.auth);
    const [isJoining, setIsJoining] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        if (postId) {
            dispatch(getPost(postId));
        }
        return () => {
            dispatch(reset());
        };
    }, [dispatch, postId]);

    // Check membership helper
    const checkMembership = (post) => {
        if (!post?.groupId || !user) return false;
        const group = post.groupId;
        const userId = user._id || user.id;

        const isMember = group.members?.some(m => (m.user?._id || m.user || m).toString() === userId.toString());
        const isAdmin = group.admins?.some(a => (a._id || a || a.toString()) === userId.toString());

        return isMember || isAdmin;
    };

    if (isLoading) {
        return (
            <div className="bg-bg-primary h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 size={40} className="text-accent-blue animate-spin" />
                        <p className="text-text-secondary font-medium animate-pulse">Fetching discussion...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || (!currentPost && !isLoading)) {
        return (
            <div className="bg-bg-primary h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-4 text-center">
                    <div className="max-w-md">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ArrowLeft size={30} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Post not found</h2>
                        <p className="text-text-secondary mb-8">This post might have been deleted or the link is broken.</p>
                        <button
                            onClick={() => navigate('/feed')}
                            className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-accent-blue/20"
                        >
                            Back to Feed
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const hasGroupId = !!currentPost.groupId;
    const group = currentPost.groupId;
    const isMember = checkMembership(currentPost);

    // Join Group Handler
    const handleJoinGroup = async () => {
        if (isJoining || requestSent) return;
        setIsJoining(true);
        try {
            await dispatch(joinGroup(group._id)).unwrap();
            if (group.privacy === 'private') {
                setRequestSent(true);
                toast.success('Join request sent successfully!');
            } else {
                toast.success('You have joined the group!');
                // Refresh data
                dispatch(getPost(postId));
            }
        } catch (err) {
            toast.error(err || 'Failed to join group');
        } finally {
            setIsJoining(false);
        }
    };

    // If post belongs to a group but user is not a member
    if (hasGroupId && !isMember) {
        const isPrivate = group.privacy === 'private';
        const userId = user?._id || user?.id;
        const alreadyRequested = group.joinRequests?.some(r => (r.user?._id || r.user || r).toString() === userId?.toString()) || requestSent;

        return (
            <div className="bg-[#131821] min-h-screen text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
                    <div className="relative w-full max-w-lg rounded-2xl overflow-hidden mb-8 shadow-2xl border border-border-primary">
                        <div className="h-40 overflow-hidden">
                            <img
                                src={group.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'}
                                className="w-full h-full object-cover"
                                alt="Group"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#131821] via-[#131821]/60 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-4 left-5 right-5 flex items-end gap-4">
                            <div className="w-16 h-16 rounded-xl bg-bg-secondary border-2 border-border-primary overflow-hidden shadow-lg shrink-0">
                                <img
                                    src={group.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name || 'G')}&background=047857&color=fff`}
                                    className="w-full h-full object-cover"
                                    alt="Logo"
                                />
                            </div>
                            <div className="pb-0.5 min-w-0">
                                <h2 className="text-lg font-bold text-white truncate drop-shadow-md">{group.name}</h2>
                                <div className="flex items-center gap-3 text-xs text-white/70 mt-0.5">
                                    {isPrivate ? (
                                        <span className="flex items-center gap-1"><Lock size={10} /> Private</span>
                                    ) : (
                                        <span className="flex items-center gap-1"><Globe size={10} /> Public</span>
                                    )}
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Users size={10} /> {(group.memberCount || group.members?.length || 0)} members</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center max-w-md">
                        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
                            <UserPlus size={28} className="text-accent-blue/70" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Member Only Post</h1>
                        <p className="text-text-secondary text-sm leading-relaxed mb-2 italic">
                            {group.description?.slice(0, 120)}{group.description?.length > 120 ? '...' : ''}
                        </p>
                        <p className="text-text-secondary text-xs mb-8">
                            {isPrivate
                                ? 'This post is from a private group. Send a request to join the community to view it.'
                                : 'Join this community to view this post, participate in discussions, and connect with members.'}
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

    return (
        <div className="bg-bg-primary h-screen flex flex-col overflow-hidden">
            <Navbar />

            <main className="max-w-[1440px] mx-auto w-full flex-1 overflow-y-auto lg:overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col lg:flex-row lg:gap-8 gap-1 items-start lg:h-full">

                    {/* Left Sidebar */}
                    <div className="hidden lg:block w-72 lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 pb-10">
                        {isMember ? <AboutGroupSection group={group} /> : <MainLeftSidebar />}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full max-w-3xl lg:h-full lg:overflow-y-auto no-scrollbar pb-10 pt-2 lg:pt-0">
                        {/* Group Banner & Header (if group member) */}
                        {isMember && group && (
                            <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden shadow-sm shadow-black/20 mb-6 group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={group.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt="Group Cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent"></div>

                                    {/* Overlaid Logo & Info in Banner */}
                                    <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                                        <div className="flex items-end gap-4">
                                            <div className="p-1.5 bg-bg-secondary rounded-2xl shadow-xl hidden sm:block">
                                                <img
                                                    src={group.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name || 'G')}&background=047857&color=fff`}
                                                    className="w-20 h-20 rounded-xl"
                                                    alt="Logo"
                                                />
                                            </div>
                                            <div className="pb-1">
                                                <h1 className="text-2xl font-bold font-outfit text-white drop-shadow-md truncate max-w-[200px] sm:max-w-none">
                                                    {group.name}
                                                </h1>
                                                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-bold text-white/80 drop-shadow-md">
                                                    <span className="flex items-center gap-1.5 capitalize"><Globe2 size={12} className="opacity-70" />{group.privacy}</span>
                                                    <span className="opacity-50">•</span>
                                                    <span className="flex items-center gap-1.5 font-black text-white">{(group.members?.length || group.memberCount || 0)} Members</span>
                                                    <span className="opacity-50">•</span>
                                                    <span className="flex items-center gap-1.5 text-emerald-400">
                                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                                        {Math.floor(Math.random() * 20) + 5} Online
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
                        )}

                        {/* Mobile Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="lg:hidden flex items-center gap-2 text-text-secondary hover:text-white mb-4 font-bold text-xs bg-white/5 w-fit px-3 py-1.5 rounded-full transition-colors"
                        >
                            <ArrowLeft size={14} /> Back
                        </button>

                        <div className="animate-fade-in">
                            <PostCard {...currentPost} isSinglePostView={true} />
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden xl:block w-[320px] lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 pb-10">
                        <MainRightSidebar />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SinglePostPage;

