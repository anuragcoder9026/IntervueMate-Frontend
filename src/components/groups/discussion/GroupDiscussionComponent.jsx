import React, { useState, useEffect } from 'react';
import DiscussionLeftSidebar from './DiscussionLeftSidebar';
import DiscussionChatArea from './DiscussionChatArea';
import DiscussionRightSidebar from './DiscussionRightSidebar';
import AnnouncementsArea from './AnnouncementsArea';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGroup, getGroupDiscussions, reset } from '../../../store/groupSlice';
import { Loader2, AlertCircle } from 'lucide-react';

const GroupDiscussionComponent = ({ isAdminMode = false }) => {
    const { id, discussionSlug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentGroup, discussions, isLoading, isError, message, isDiscussionsLoading } = useSelector(state => state.group);
    const { user } = useSelector(state => state.auth);

    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [discussionError, setDiscussionError] = useState(null);
    const [navigatedMessageId, setNavigatedMessageId] = useState(null);

    // Redirect admins from public discussion to admin discussion
    useEffect(() => {
        if (!isAdminMode && currentGroup && user) {
            const isAdmin = currentGroup.admins?.some(adminId =>
                adminId === user._id || adminId === user.id ||
                (typeof adminId === 'object' && adminId._id === user._id)
            );

            if (isAdmin) {
                const discussionPath = discussionSlug ? `/discussion/${discussionSlug}/messages` : '';
                navigate(`/admin/groups/${id}${discussionPath}`, { replace: true });
            }
        }
    }, [isAdminMode, currentGroup, user, id, discussionSlug, navigate]);

    const slugify = (text, channelId) => {
        const slug = text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
        return channelId ? `${slug}-${channelId}` : slug;
    };

    useEffect(() => {
        // Only fetch group if not loaded or if the ID has changed
        // We check against both _id and groupId (for slug cases)
        const isCorrectGroup = currentGroup && (
            currentGroup._id === id ||
            currentGroup.groupId === id ||
            id.includes(currentGroup.groupId)
        );

        if (!isCorrectGroup) {
            dispatch(getGroup(id));
        }

        // Discussions should be fetched for the specific group context
        dispatch(getGroupDiscussions(id));

        // Note: Removed dispatch(reset()) to prevent clearing state on tab switches
    }, [id, dispatch]);

    // Sync current channel with URL slug
    useEffect(() => {
        // Wait for data to actually be in state
        if (isLoading || isDiscussionsLoading || !currentGroup || !discussions) return;

        if (discussionSlug) {
            // Handle special slugs
            if (discussionSlug === 'announcements' || discussionSlug === 'rules') {
                if (!currentChannel || currentChannel.name !== discussionSlug) {
                    setCurrentChannel({ name: discussionSlug });
                    setDiscussionError(null);
                }
                return;
            }

            // Find matching discussion by ID (last part of slug)
            const idFromSlug = discussionSlug.split('-').pop();
            const found = discussions.find(d => d._id === idFromSlug);

            if (found) {
                // Found in this group - only update if different
                if (!currentChannel || currentChannel._id !== found._id) {
                    setCurrentChannel(found);
                    setDiscussionError(null);
                }
            } else if (!isDiscussionsLoading) {
                // If it looks like a MongoID but not in this group, it's a mismatch/not found
                if (idFromSlug && idFromSlug.match(/^[0-9a-fA-F]{24}$/)) {
                    if (discussionError !== 'Discussion Not Found') {
                        setDiscussionError('Discussion Not Found');
                        setCurrentChannel(null);
                    }
                } else if (discussions.length > 0) {
                    // Invalid slug or random text, redirect to announcements
                    const targetPath = isAdminMode
                        ? `/admin/groups/${id}/discussion/announcements/messages`
                        : `/groups/${id}/discussion/announcements/messages`;
                    navigate(targetPath, { replace: true });
                }
            }
        } else if (discussions.length > 0) {
            // No slug provided, redirect to announcements by default
            const targetPath = isAdminMode
                ? `/admin/groups/${id}/discussion/announcements/messages`
                : `/groups/${id}/discussion/announcements/messages`;
            navigate(targetPath, { replace: true });
        }
    }, [discussionSlug, discussions, id, navigate, isLoading, isDiscussionsLoading, currentGroup?._id, isAdminMode, currentChannel?._id, discussionError]);

    if ((isLoading || isDiscussionsLoading || !currentGroup) && !isError) {
        return (
            <div className={`flex items-center justify-center ${isAdminMode ? 'h-[600px]' : 'h-screen bg-[#1E232E]'}`}>
                <Loader2 className="animate-spin text-accent-blue" size={48} />
            </div>
        );
    }

    if (discussionError) {
        return (
            <div className={`flex flex-col items-center justify-center text-center p-6 ${isAdminMode ? 'h-[600px] border border-white/5 rounded-2xl bg-[#111721]' : 'flex-1 bg-[#1E232E]'}`}>
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="text-red-500" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Discussion Not Found</h1>
                <p className="text-gray-400 max-w-md mb-8">The discussion you are looking for does not exist in this group.</p>
                <div className="flex gap-4">
                    <button onClick={() => navigate(`/groups/${id}${isAdminMode ? '/admin' : ''}`)} className="px-6 py-2.5 bg-accent-blue text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                        Go back
                    </button>
                    <button onClick={() => setDiscussionError(null)} className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                        Try Default Channel
                    </button>
                </div>
            </div>
        );
    }

    if (!currentGroup) return null;

    return (
        <div className={`w-full flex flex-col ${isAdminMode ? 'h-[calc(100vh-180px)] rounded-2xl overflow-hidden border border-white/5' : 'h-screen'} bg-[#1E232E] font-inter overflow-hidden relative`}>
            {/* Main layout matching the Discord-like structure */}
            <div className="flex flex-1 overflow-hidden relative transition-all duration-300">
                {/* Left Channels Sidebar */}
                <div className={`
                        fixed inset-y-0 left-0 z-[60] transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shrink-0
                        ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}>
                    <DiscussionLeftSidebar
                        onClose={() => setIsLeftSidebarOpen(false)}
                        currentChannel={currentChannel}
                        onChannelChange={(discussion) => {
                            setNavigatedMessageId(null);
                            let path = '';
                            if (discussion.name === 'announcements' || discussion.name === 'rules') {
                                path = isAdminMode
                                    ? `/admin/groups/${id}/discussion/${discussion.name}/messages`
                                    : `/groups/${id}/discussion/${discussion.name}/messages`;
                            } else {
                                const slug = slugify(discussion.name, discussion._id);
                                path = isAdminMode
                                    ? `/admin/groups/${id}/discussion/${slug}/messages`
                                    : `/groups/${id}/discussion/${slug}/messages`;
                            }
                            navigate(path);
                            if (!isAdminMode) setIsLeftSidebarOpen(false);
                        }}
                    />
                </div>

                {/* Mobile Left Sidebar Overlay Backdrop */}
                {isLeftSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-[55] md:hidden backdrop-blur-sm"
                        onClick={() => setIsLeftSidebarOpen(false)}
                    />
                )}

                {/* Central content area - Conditional switching */}
                <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
                    {(!currentChannel || currentChannel.name === 'announcements' || currentChannel.name === 'rules') ? (
                        (discussionSlug && discussionSlug !== 'announcements' && discussionSlug !== 'rules' && !currentChannel) ? (
                            <div className="flex-1 flex items-center justify-center bg-[#1E232E]">
                                <Loader2 className="animate-spin text-accent-blue" size={32} />
                            </div>
                        ) : (
                            <AnnouncementsArea
                                channelName={currentChannel?.name || 'welcome'}
                                onToggleLeft={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                                onToggleRight={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                                isAdminMode={isAdminMode}
                                isAdmin={isAdminMode || currentGroup?.admins?.some(admin =>
                                    (admin._id || admin) === user?._id || (admin._id || admin) === user?.id ||
                                    (typeof admin === 'object' && (admin._id === user?._id || admin._id === user?.id))
                                ) || currentGroup?.creator === user?._id || currentGroup?.creator === user?.id}
                                rules={currentGroup?.rules || []}
                                announcements={currentGroup?.announcements || []}
                                groupId={currentGroup?._id}
                            />
                        )
                    ) : (
                        <DiscussionChatArea
                            discussion={currentChannel}
                            onToggleLeft={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                            onToggleRight={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                            isLeftOpen={isLeftSidebarOpen}
                            isRightOpen={isRightSidebarOpen}
                            navigatedMessageId={navigatedMessageId}
                            isAdminMode={isAdminMode}
                        />
                    )}
                </div>

                {/* Right Members Sidebar - Desktop: fixed, Mobile: Overlay */}
                <div className={`
                        ${isAdminMode ? 'absolute' : 'fixed'} inset-y-0 right-0 z-[60] transform transition-transform duration-300 ease-in-out shrink-0
                        ${!isAdminMode ? 'lg:relative lg:translate-x-0' : ''}
                        ${isRightSidebarOpen ? 'translate-x-0' : `translate-x-full ${!isAdminMode ? 'lg:translate-x-0' : ''}`}
                    `}>
                    <DiscussionRightSidebar
                        onClose={() => setIsRightSidebarOpen(false)}
                        discussion={currentChannel}
                        onNavigateToMessage={(id) => setNavigatedMessageId({ id, timestamp: Date.now() })}
                    />
                </div>

                {/* Mobile Right Sidebar Overlay Backdrop */}
                {isRightSidebarOpen && (
                    <div
                        className={`${isAdminMode ? 'absolute' : 'fixed'} inset-0 bg-black/60 z-[55] backdrop-blur-sm ${!isAdminMode ? 'lg:hidden' : ''}`}
                        onClick={() => setIsRightSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default GroupDiscussionComponent;
