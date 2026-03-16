import React, { useState, useEffect } from 'react';
import { ChevronDown, Smile, CheckCircle, MoreHorizontal, ThumbsUp, Link2, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostComments = ({
    showComments,
    comments,
    commentText,
    setCommentText,
    handleCommentSubmit,
    replyingTo,
    setReplyingTo,
    replyText,
    setReplyText,
    handleReplySubmit,
    handleLikeComment,
    expandedReplies,
    setExpandedReplies,
    user,
    isLoading,
    toggleReplies
}) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => {
            if (activeDropdown) {
                setActiveDropdown(null);
            }
        };

        if (activeDropdown) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activeDropdown]);

    if (!showComments) return null;

    const renderComment = (comment) => {
        const authorName = comment.user?.name || comment.author || 'User';
        const authorAvatar = comment.user?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=random`;
        const authorRole = comment.user?.role === 'admin' ? 'Premium Member' : 'Software Professional';
        const formattedTime = comment.createdAt
            ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                .replace('less than a minute ago', 'Just now')
                .replace('about ', '')
            : comment.time || 'Just now';
        const commentId = comment._id || comment.id;

        return (
            <div key={commentId} className="relative">
                {/* Parent Comment */}
                <div className="flex gap-2.5 group/comment relative">
                    <div className="relative shrink-0 flex flex-col items-center w-10">
                        <img
                            src={authorAvatar}
                            className="w-10 h-10 rounded-full relative z-10 object-cover"
                            alt={authorName}
                        />
                        {/* Parent to First Reply Line segment */}
                        {((comment.replies && comment.replies.length > 0) || replyingTo === commentId) && (
                            <div className="absolute top-10 bottom-[-22px] left-[19.5px] w-[1px] bg-border-primary z-0"></div>
                        )}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1 flex-wrap min-w-0">
                                    <h5 className="text-[13px] sm:text-[14px] font-bold text-text-primary hover:text-accent-blue hover:underline cursor-pointer leading-none truncate max-w-full">
                                        {authorName}
                                    </h5>
                                    {comment.isVerified && <CheckCircle size={12} className="text-text-secondary -mt-0.5 shrink-0" />}
                                    {comment.connection && <span className="text-[11px] sm:text-[12px] text-text-secondary font-medium leading-none shrink-0">• {comment.connection}</span>}
                                </div>
                                <p className="text-[11px] sm:text-[12px] text-text-secondary mt-0.5 w-full truncate leading-normal">{authorRole}</p>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 text-text-secondary shrink-0">
                                <span className="text-[11px] sm:text-[12px]">{formattedTime}</span>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveDropdown(activeDropdown === `comment-${commentId}` ? null : `comment-${commentId}`);
                                        }}
                                        className="hover:bg-bg-tertiary p-1 rounded-full px-1.5 sm:px-2 -mr-1 sm:-mr-2 transition-colors"
                                    >
                                        <MoreHorizontal size={14} className="sm:hidden" />
                                        <MoreHorizontal size={16} className="hidden sm:block" />
                                    </button>

                                    {/* Comment Dropdown */}
                                    {activeDropdown === `comment-${commentId}` && (
                                        <div className="absolute top-full right-0 mt-1 w-60 bg-bg-secondary border border-border-primary rounded-xl shadow-xl z-50 overflow-hidden py-1 animation-scale-in origin-top-right">
                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left">
                                                <Link2 size={16} className="text-text-secondary" />
                                                <span className="font-semibold">Copy link to comment</span>
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left">
                                                <UserPlus size={16} className="text-text-secondary" />
                                                <span className="font-semibold">Follow {authorName}</span>
                                            </button>
                                            <div className="h-px bg-border-primary/50 my-1 mx-2"></div>
                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-red-400 hover:bg-red-400/10 transition-colors text-left">
                                                <Trash2 size={16} />
                                                <span className="font-semibold">Delete comment</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="text-[13px] sm:text-[14px] text-text-primary/95 leading-snug pt-1 whitespace-pre-wrap break-words">
                            {comment.text}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-[12px] font-semibold text-text-secondary">
                            <button
                                onClick={() => handleLikeComment(commentId)}
                                className={`hover:bg-bg-tertiary px-1 -ml-1 rounded transition-colors ${comment.likes?.includes(user?._id) ? 'text-accent-blue font-bold' : ''}`}
                            >
                                {comment.likes?.includes(user?._id) ? 'Liked' : 'Like'}
                            </button>
                            {comment.likes?.length > 0 && (
                                <span className="flex items-center gap-1 font-normal text-[12px] -ml-1">
                                    • <div className="bg-[#0a66c2] rounded-full p-0.5 ml-0.5"><ThumbsUp size={10} fill="white" className="text-white" /></div> {comment.likes.length}
                                </span>
                            )}
                            <span className="text-white/10 mx-[-2px]">|</span>
                            <button
                                className={`px-1 rounded transition-colors ${replyingTo === commentId ? 'bg-bg-tertiary text-white' : 'hover:bg-bg-tertiary'}`}
                                onClick={() => {
                                    setReplyingTo(replyingTo === commentId ? null : commentId);
                                    if (replyingTo !== commentId) {
                                        setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
                                        setReplyText('');
                                    }
                                }}
                            >
                                Reply
                            </button>
                            {comment.replies && comment.replies.length > 0 && (
                                <span
                                    className={`font-normal text-[12px] -ml-1 cursor-pointer transition-colors select-none ${expandedReplies[commentId] ? 'text-accent-blue hover:text-white' : 'hover:text-accent-blue'}`}
                                    onClick={() => toggleReplies(commentId)}
                                >
                                    • {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Replies */}
                {((comment.replies && comment.replies.length > 0) || replyingTo === commentId) && (
                    <div className="mt-4 space-y-4 relative">
                        {comment.replies && comment.replies.length > 0 && (expandedReplies[commentId] ? comment.replies : comment.replies.slice(0, 1)).map((reply, index, array) => {
                            const replyAuthorName = reply.user?.name || reply.author || 'User';
                            const replyAuthorAvatar = reply.user?.avatar || `https://ui-avatars.com/api/?name=${replyAuthorName}&background=random`;
                            const replyAuthorRole = reply.user?.role === 'admin' ? 'Premium Member' : 'Software Professional';
                            const replyFormattedTime = reply.createdAt
                                ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })
                                    .replace('less than a minute ago', 'Just now')
                                    .replace('about ', '')
                                : reply.time || 'Just now';
                            const replyId = reply._id || reply.id;

                            return (
                                <div key={replyId} className="flex gap-2.5 group/comment relative pl-[44px]">
                                    {/* Connecting curve */}
                                    <div className="absolute left-[19.5px] top-[-10px] w-[24px] h-[26px] border-b-[2px] border-l-[2px] border-border-primary rounded-bl-xl z-0 pointer-events-none"></div>

                                    {/* Connecting straight line to next reply (if not last) */}
                                    {(index !== array.length - 1 || replyingTo === commentId) && (
                                        <div className="absolute left-[19.5px] top-[16px] bottom-[-22px] w-[1px] bg-border-primary z-0"></div>
                                    )}

                                    <img
                                        src={replyAuthorAvatar}
                                        className="w-8 h-8 rounded-full shrink-0 relative z-10 object-cover"
                                        alt={replyAuthorName}
                                    />
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1 flex-wrap min-w-0">
                                                    <h5 className="text-[12px] sm:text-[13px] font-bold text-text-primary hover:text-accent-blue hover:underline cursor-pointer leading-none truncate max-w-full">
                                                        {replyAuthorName}
                                                    </h5>
                                                    {reply.isVerified && <CheckCircle size={10} className="text-text-secondary -mt-0.5 shrink-0" />}
                                                    {reply.connection && <span className="text-[11px] sm:text-[12px] text-text-secondary font-medium leading-none shrink-0">• {reply.connection}</span>}
                                                </div>
                                                <p className="text-[10px] sm:text-[11px] text-text-secondary mt-0.5 w-full truncate leading-normal">{replyAuthorRole}</p>
                                            </div>
                                            <div className="flex items-center gap-1 sm:gap-2 text-text-secondary shrink-0">
                                                <span className="text-[10px] sm:text-[12px]">{replyFormattedTime}</span>
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDropdown(activeDropdown === `reply-${replyId}` ? null : `reply-${replyId}`);
                                                        }}
                                                        className="hover:bg-bg-tertiary p-1 rounded-full px-1 sm:px-2 -mr-1 sm:-mr-2 transition-colors"
                                                    >
                                                        <MoreHorizontal size={12} className="sm:hidden" />
                                                        <MoreHorizontal size={14} className="hidden sm:block" />
                                                    </button>

                                                    {/* Reply Dropdown */}
                                                    {activeDropdown === `reply-${replyId}` && (
                                                        <div className="absolute top-full right-0 mt-1 w-60 bg-bg-secondary border border-border-primary rounded-xl shadow-xl z-50 overflow-hidden py-1 animation-scale-in origin-top-right">
                                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left">
                                                                <Link2 size={16} className="text-text-secondary" />
                                                                <span className="font-semibold">Copy link to reply</span>
                                                            </button>
                                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-text-primary hover:bg-bg-tertiary transition-colors text-left">
                                                                <UserPlus size={16} className="text-text-secondary" />
                                                                <span className="font-semibold">Follow {replyAuthorName}</span>
                                                            </button>
                                                            <div className="h-px bg-border-primary/50 my-1 mx-2"></div>
                                                            <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-red-400 hover:bg-red-400/10 transition-colors text-left">
                                                                <Trash2 size={16} />
                                                                <span className="font-semibold">Delete reply</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[12.5px] sm:text-[13.5px] text-text-primary/95 leading-snug pt-0.5 break-words">
                                            {reply.mention && <span className="text-accent-blue hover:underline font-bold px-1 py-0.5 rounded cursor-pointer mr-1">{reply.mention}</span>}
                                            {reply.text}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Reply Input Field */}
                        {replyingTo === commentId && (
                            <div className="flex gap-2.5 group/comment relative pl-[44px] animation-slide-down">
                                {/* Connecting curve */}
                                <div className="absolute left-[19.5px] top-[-10px] w-[24px] h-[26px] border-b-[2px] border-l-[2px] border-border-primary rounded-bl-xl z-0 pointer-events-none"></div>

                                <img
                                    src={user?.avatar || "https://ui-avatars.com/api/?name=You&background=random"}
                                    className="w-8 h-8 rounded-full shrink-0 relative z-10 object-cover"
                                    alt="You"
                                />
                                <div className="flex-1 min-w-0">
                                    <form
                                        onSubmit={(e) => handleReplySubmit(e, commentId)}
                                        className={`flex-1 flex flex-col min-w-0 bg-bg-primary border border-border-primary focus-within:border-white/20 transition-all shadow-inner ${replyText.trim() ? 'rounded-2xl' : 'rounded-full'}`}
                                    >
                                        <div className="relative flex items-center px-3 sm:px-4 min-h-[36px] sm:min-h-[40px]">
                                            <input
                                                type="text"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder={`Reply to ${authorName}...`}
                                                autoFocus
                                                className="flex-1 bg-transparent text-[12px] sm:text-[13px] text-text-primary focus:outline-none placeholder:text-text-secondary h-full py-1.5 min-w-0"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleReplySubmit(e, commentId);
                                                    }
                                                }}
                                            />
                                            {!replyText.trim() && (
                                                <div className="flex items-center shrink-0 ml-1 sm:ml-2">
                                                    <button type="button" className="text-text-secondary hover:text-white transition-colors p-1">
                                                        <Smile size={18} className="sm:w-[20px] sm:h-[20px]" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {replyText.trim() && (
                                            <div className="flex justify-between items-center px-2 sm:px-3 pb-2 pt-1 animation-slide-down">
                                                <div className="flex items-center gap-2">
                                                    <button type="button" className="text-text-secondary hover:text-white transition-colors p-1.5 rounded-full hover:bg-bg-tertiary">
                                                        <Smile size={18} className="sm:w-[20px] sm:h-[20px]" />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleReplySubmit(e, commentId)}
                                                    className="bg-accent-blue text-white font-bold text-[12px] sm:text-[13px] px-4 py-1.5 rounded-full hover:bg-accent-blue/80 transition-colors shadow-sm"
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        )}
                                    </form>

                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-border-primary/50 bg-[#0F1523]/20 animation-slide-down rounded-b-2xl">
            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 sm:gap-3 mb-4">
                <img
                    src={user?.avatar || "https://ui-avatars.com/api/?name=You&background=random"}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 object-cover"
                    alt="Me"
                />
                <div className={`flex-1 flex flex-col min-w-0 bg-bg-primary border border-border-primary focus-within:border-white/20 transition-all shadow-sm ${commentText.trim() ? 'rounded-2xl' : 'rounded-full'}`}>
                    <div className="relative flex items-center px-3 sm:px-4 min-h-[40px] sm:min-h-[46px]">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-transparent text-[13px] sm:text-sm text-text-primary focus:outline-none placeholder:text-text-secondary h-full py-2 min-w-0"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleCommentSubmit(e);
                                }
                            }}
                        />
                        {!commentText.trim() && (
                            <div className="flex items-center shrink-0 ml-1 sm:ml-2">
                                <button type="button" className="text-text-secondary hover:text-white transition-colors p-1">
                                    <Smile size={18} className="sm:w-[20px] sm:h-[20px]" />
                                </button>
                            </div>
                        )}
                    </div>
                    {commentText.trim() && (
                        <div className="flex justify-between items-center px-2 sm:px-3 pb-2 pt-1 animation-slide-down">
                            <div className="flex items-center gap-2">
                                <button type="button" className="text-text-secondary hover:text-white transition-colors p-1.5 rounded-full hover:bg-bg-tertiary">
                                    <Smile size={18} className="sm:w-[20px] sm:h-[20px]" />
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleCommentSubmit}
                                className="bg-accent-blue text-white font-bold text-[12px] sm:text-[13px] px-4 py-1.5 rounded-full hover:bg-accent-blue/80 transition-colors shadow-sm"
                            >
                                Comment
                            </button>
                        </div>
                    )}
                </div>
            </form>

            {/* Sort Header */}
            <div className="flex items-center text-[13px] font-bold text-text-secondary hover:text-white cursor-pointer mb-5 w-max group">
                Most relevant <ChevronDown size={14} className="ml-1 group-hover:text-white" />
            </div>

            {/* Comment List */}
            <div className="space-y-6 min-h-[50px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-2">
                        <Loader2 size={24} className="text-accent-blue animate-spin" />
                        <span className="text-[11px] font-bold text-text-secondary italic">Loading discussions...</span>
                    </div>
                ) : (
                    comments && comments.length > 0 ? (
                        comments.filter(c => typeof c === 'object' && (c._id || c.text)).map(renderComment)
                    ) : (
                        <div className="py-2 text-center">
                            <p className="text-[12px] font-medium text-text-secondary/60 italic">No comments yet. Start the conversation!</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default PostComments;
