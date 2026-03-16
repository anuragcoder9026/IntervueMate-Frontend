import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { likePost, deletePost, addComment, likeComment, addReply, getPostComments, repostPost } from '../../store/postSlice';
import { joinGroup } from '../../store/groupSlice';
import PostHeader from '../postcard/PostHeader';
import PostBody from '../postcard/PostBody';
import PostImageCarousel from '../postcard/PostImageCarousel';
import PostStatsAndActions from '../postcard/PostStatsAndActions';
import PostComments from '../postcard/PostComments';
import RepostModal from '../postcard/RepostModal';
import { formatDistanceToNow } from 'date-fns';
import DeleteConfirmModal from './DeleteConfirmModal';

const AdminPostCard = ({ _id, author, createdAt, content, tags, image, images: initialImages, files, links, likes, comments = [], commentLoading, audience = 'Anyone', onDeleteSuccess }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
    const [isSubmittingRepost, setIsSubmittingRepost] = useState(false);
    const [isJoiningGroup, setIsJoiningGroup] = useState(false);

    const handleRepost = async (repostText) => {
        setIsSubmittingRepost(true);
        try {
            await dispatch(repostPost({ postId: _id, repostContent: repostText })).unwrap();
            setIsRepostModalOpen(false);
        } catch (err) {
            toast.error(err || "Failed to repost");
        } finally {
            setIsSubmittingRepost(false);
        }
    };

    const handleJoinGroup = async () => {
        // Group admins don't need to join their own group, but for completeness:
        toast.info("You are already an admin of this group.");
    };

    const allImages = initialImages ? [...initialImages] : (image ? [image] : []);
    const shouldTruncate = content && content.length > 200;
    const displayText = (shouldTruncate && !isExpanded) ? content.slice(0, 200) + '...' : content;

    const formattedTime = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
            .replace('about ', '')
        : 'Just now';

    const handleLike = () => dispatch(likePost(_id));

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await dispatch(deletePost(_id)).unwrap();
            setIsDeleteModalOpen(false);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        } catch (err) {
            toast.error(err || 'Failed to delete post. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        dispatch(addComment({ postId: _id, text: commentText }));
        setCommentText('');
    };

    const handleLikeComment = (commentId) => dispatch(likeComment(commentId));

    const handleReplySubmit = (e, commentId) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        dispatch(addReply({ commentId, text: replyText }));
        setReplyText('');
        setReplyingTo(null);
    };

    const handleToggleComments = () => {
        if (!showComments) dispatch(getPostComments(_id));
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
        setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    // For AdminPostCard, isOwner is true for the sake of showing the Delete option in dropdown
    const isActuallyOwner = user?._id === author?._id || user?._id === author;

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-2xl shadow-sm hover:shadow-xl hover:border-white/5 transition-all group duration-300 w-full max-w-full relative">
            {/* Admin Badge Indicator */}
            <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>

            <PostHeader
                author={author}
                role={author?.role || 'user'}
                time={formattedTime}
                audience={audience}
                onDelete={handleDelete}
                // We force isOwner to true to show Delete Post in the dropdown menu
                isOwner={true}
            />

            <PostBody
                displayText={displayText}
                shouldTruncate={shouldTruncate}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                links={links}
                files={files}
                tags={tags}
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
                showComments={showComments}
                setShowComments={handleToggleComments}
                onRepostClick={() => setIsRepostModalOpen(true)}
                onInstantRepost={() => handleRepost('')}
                isSubmittingRepost={isSubmittingRepost}
                postId={_id}
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

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this community post? This action will permanently remove the post and all its comments."
                isLoading={isDeleting}
            />

            <RepostModal
                isOpen={isRepostModalOpen}
                onClose={() => setIsRepostModalOpen(false)}
                onRepost={handleRepost}
                isSubmitting={isSubmittingRepost}
            />
        </div>
    );
};

export default AdminPostCard;
