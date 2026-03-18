import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, deletePost, addComment, likeComment, addReply, getPostComments, repostPost, deleteRepost, toggleSavePost } from '../store/postSlice';
import { joinGroup } from '../store/groupSlice';
import RepostModal from './postcard/RepostModal';
import { Repeat, Users, UserPlus, FileText, CheckCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import PostHeader from './postcard/PostHeader';
import PostBody from './postcard/PostBody';
import PostImageCarousel from './postcard/PostImageCarousel';
import PostStatsAndActions from './postcard/PostStatsAndActions';
import PostComments from './postcard/PostComments';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({
    _id, author, createdAt, content, tags, image, images: initialImages,
    files, links, likes, comments = [], commentLoading, audience = 'Anyone', isSinglePostView = false,
    groupId, isRepost, repostUser, repostContent, originalPostId, shareCount = 0, isSaved: initialIsSaved
}) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isExpanded, setIsExpanded] = useState(isSinglePostView);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showComments, setShowComments] = useState(isSinglePostView);
    const [expandedReplies, setExpandedReplies] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
    const [isSubmittingRepost, setIsSubmittingRepost] = useState(false);
    const [isJoiningGroup, setIsJoiningGroup] = useState(false);
    const [isRepostMenuOpen, setIsRepostMenuOpen] = useState(false);
    const [isDeletingRepost, setIsDeletingRepost] = useState(false);
    const [justJoined, setJustJoined] = useState(false);
    const [justRequested, setJustRequested] = useState(false);
    const repostMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (repostMenuRef.current && !repostMenuRef.current.contains(event.target)) {
                setIsRepostMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRepost = async (repostText) => {
        setIsSubmittingRepost(true);
        try {
            await dispatch(repostPost({ postId: originalPostId || _id, repostContent: repostText })).unwrap();
            setIsRepostModalOpen(false);
        } catch (err) {
            toast.error(err || "Failed to repost");
        } finally {
            setIsSubmittingRepost(false);
        }
    };

    const handleDeleteRepost = async () => {
        setIsDeletingRepost(true);
        try {
            await dispatch(deleteRepost(_id)).unwrap();
            toast.success("Repost deleted successfully");
        } catch (err) {
            toast.error(err || "Failed to delete repost");
        } finally {
            setIsDeletingRepost(false);
            setIsRepostMenuOpen(false);
        }
    };

    const handleJoinGroup = async () => {
        if (!groupId?._id) return;
        setIsJoiningGroup(true);
        try {
            await dispatch(joinGroup(groupId._id)).unwrap();

            if (groupId.privacy === 'private') {
                setJustRequested(true);
                toast.success('Join request sent!');
            } else {
                setJustJoined(true);
                toast.success(`Successfully joined ${groupId.name}!`);
            }
        } catch (err) {
            toast.error(err || 'Failed to join group');
        } finally {
            setIsJoiningGroup(false);
        }
    };

    useEffect(() => {
        if (isSinglePostView) {
            dispatch(getPostComments(originalPostId || _id));
        }
    }, [isSinglePostView, _id, originalPostId, dispatch]);

    // Combine old 'image' prop with new 'images' prop for backward compatibility
    const allImages = initialImages ? [...initialImages] : (image ? [image] : []);

    // Check if we need to truncate
    const shouldTruncate = !isSinglePostView && content && content.length > 200;
    const displayText = (shouldTruncate && !isExpanded)
        ? content.slice(0, 200) + '...'
        : content;

    const formattedTime = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
            .replace('less than a minute ago', 'Just now')
            .replace('about ', '')
        : 'Just now';
    
    const [isSaving, setIsSaving] = useState(false);

    // Check if post is saved by user
    const isSaved = initialIsSaved || (user?.savedPosts?.some(
        sId => (sId._id || sId).toString() === (originalPostId || _id).toString()
    ));

    const handleLike = () => {
        dispatch(likePost(originalPostId || _id));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await dispatch(toggleSavePost(originalPostId || _id)).unwrap();
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            dispatch(deletePost(originalPostId || _id));
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        dispatch(addComment({ postId: originalPostId || _id, text: commentText }));
        setCommentText('');
    };

    const handleLikeComment = (commentId) => {
        dispatch(likeComment(commentId));
    };

    const handleReplySubmit = (e, commentId) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        dispatch(addReply({ commentId, text: replyText }));
        setReplyText('');
        setReplyingTo(null);
    };

    const handleToggleComments = () => {
        if (!showComments) {
            dispatch(getPostComments(originalPostId || _id));
        }
        setShowComments(!showComments);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const isGroupPost = !!groupId;
    const isMemberOfGroup = justJoined || (user && groupId?.members?.some(
        m => (m.user?._id || m.user || m)?.toString() === user._id?.toString()
    ));
    const isAdminOfGroup = user && groupId?.admins?.some(
        a => (a._id || a)?.toString() === user._id?.toString()
    );
    const hasRequested = justRequested || (user && groupId?.joinRequests?.some(
        m => (m.user?._id || m.user || m)?.toString() === user._id?.toString()
    ));
    const privacy = groupId?.privacy || 'public';
    const requiresJoin = isRepost && isGroupPost && !isMemberOfGroup && !isAdminOfGroup;

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-2xl shadow-sm hover:shadow-xl hover:border-white/5 transition-all group duration-300 w-full max-w-full relative">
            {isRepost && (
                <div className="flex flex-col justify-start px-5 py-3 border-b border-border-primary/30 text-text-secondary text-[11px] sm:text-xs font-bold bg-white/[0.02]">
                    {/* Repost Header section  */}
                    <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                            <img
                                src={repostUser?.avatar || `https://ui-avatars.com/api/?name=${repostUser?.name || 'Me'}&background=random`}
                                className="w-7 h-7 rounded-full"
                                alt="Me"
                            />
                            <div className="flex items-center gap-2">
                                <Repeat size={14} className="text-accent-blue" />
                                <span>{repostUser?.name || 'Someone'} reposted this</span>
                            </div>
                        </div>

                        {/* Three Dots Menu for Repost Owner */}
                        {((repostUser?._id || repostUser) === (user?._id || user?.id)) && (
                            <div className="relative" ref={repostMenuRef}>
                                <button
                                    onClick={() => setIsRepostMenuOpen(prev => !prev)}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-95"
                                >
                                    <MoreHorizontal size={16} className="text-text-secondary hover:text-white" />
                                </button>

                                {isRepostMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-40 bg-bg-secondary border border-border-primary shadow-xl rounded-xl p-1 z-50 animate-in fade-in zoom-in-95">
                                        <button
                                            onClick={handleDeleteRepost}
                                            disabled={isDeletingRepost}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {isDeletingRepost ? (
                                                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                                            ) : (
                                                <Trash2 size={14} />
                                            )}
                                            <span>Delete Repost</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {repostContent && <p className="text-white font-normal mt-2">{repostContent}</p>}
                </div>
            )}

            {requiresJoin ? (
                <div className="relative overflow-hidden rounded-b-2xl">
                    <div className="filter blur-md select-none pointer-events-none opacity-50">
                        <PostHeader
                            author={author}
                            role={author?.role || 'user'}
                            time={formattedTime}
                            audience={audience}
                            onDelete={handleDelete}
                            isOwner={user?._id === (author?._id || author)}
                            postId={originalPostId || _id}
                            isSaved={isSaved}
                            onSave={handleSave}
                            isSaving={isSaving}
                        />
                        <PostBody
                            displayText={displayText}
                            shouldTruncate={shouldTruncate}
                            isExpanded={false}
                            setIsExpanded={() => { }}
                            links={links}
                            files={files}
                            tags={tags}
                            isSinglePostView={false}
                        />
                    </div>

                    {/* Overlay for not joined group */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/40 p-6 text-center z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                            <Users size={24} className="text-accent-blue/80" />
                        </div>
                        <h4 className="text-white font-bold mb-1">Group Post</h4>
                        <p className="text-xs text-text-secondary max-w-xs mb-4">
                            This post belongs to <span className="text-white font-bold">{groupId.name}</span>.
                            {privacy === 'private' ? ' Request to join this private group to view the content.' : ' Join this public group to view the content.'}
                        </p>

                        {hasRequested ? (
                            <div className="px-5 py-2 bg-white/10 text-white rounded-lg font-bold text-xs flex items-center gap-2">
                                <CheckCircle size={14} /> Requested
                            </div>
                        ) : (
                            <button
                                onClick={handleJoinGroup}
                                disabled={isJoiningGroup}
                                className="px-5 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg font-bold text-xs transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {isJoiningGroup ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <UserPlus size={14} />
                                )}
                                {privacy === 'private' ? 'Request to Join' : 'Join Group'}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <PostHeader
                        author={author}
                        role={author?.role || 'user'}
                        time={formattedTime}
                        audience={audience}
                        onDelete={handleDelete}
                        isOwner={user?._id === (author?._id || author)}
                        postId={originalPostId || _id}
                        isSaved={isSaved}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />

                    <PostBody
                        displayText={displayText}
                        shouldTruncate={shouldTruncate}
                        isExpanded={isExpanded}
                        setIsExpanded={setIsExpanded}
                        links={links}
                        files={files}
                        tags={tags}
                        isSinglePostView={isSinglePostView}
                    />

                    <PostImageCarousel
                        allImages={allImages}
                        currentImageIndex={currentImageIndex}
                        prevImage={prevImage}
                        nextImage={nextImage}
                    />

                    <PostStatsAndActions
                        likesCount={likes?.length || 0}
                        isLiked={likes?.includes(user?._id)}
                        onLike={handleLike}
                        commentsCount={comments.length}
                        shareCount={shareCount}
                        showComments={showComments}
                        setShowComments={handleToggleComments}
                        onRepostClick={() => setIsRepostModalOpen(true)}
                        onInstantRepost={() => handleRepost('')}
                        isSubmittingRepost={isSubmittingRepost}
                        postId={originalPostId || _id}
                        isSaved={isSaved}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />

                    <PostComments
                        showComments={showComments}
                        comments={comments}
                        isLoading={commentLoading}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        handleCommentSubmit={handleCommentSubmit}
                        handleLikeComment={handleLikeComment}
                        handleReplySubmit={handleReplySubmit}
                        user={user}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        replyText={replyText}
                        setReplyText={setReplyText}
                        expandedReplies={expandedReplies}
                        setExpandedReplies={setExpandedReplies}
                        toggleReplies={toggleReplies}
                    />
                </>
            )}

            <RepostModal
                isOpen={isRepostModalOpen}
                onClose={() => setIsRepostModalOpen(false)}
                onRepost={handleRepost}
                isSubmitting={isSubmittingRepost}
            />
        </div>
    );
};

export default PostCard;
