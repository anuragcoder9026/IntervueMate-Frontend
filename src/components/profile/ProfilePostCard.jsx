import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Repeat, Send, MoreHorizontal, Clock, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ProfilePostCard = ({ post }) => {
    const navigate = useNavigate();
    
    // Deconstruct post data
    const { 
        _id, 
        author, 
        content, 
        images, 
        createdAt, 
        likes = [], 
        comments = [], 
        shareCount = 0,
        isRepost,
        repostUser,
        repostContent,
        originalPostId,
        audience
    } = post;

    const authorName = author?.name || 'User';
    const authorAvatar = author?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=random`;
    const authorRole = author?.role || 'Member';
    
    // Slug for navigation - must match SinglePostPage logic
    const postSlug = `${authorName.replace(/\s+/g, '').toLowerCase()}-${originalPostId || _id}`;

    const handleCardClick = () => {
        navigate(`/post/${postSlug}`);
    };

    const formattedTime = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
            .replace('about ', '')
            .replace('less than a minute ago', 'Just now')
        : 'Just now';

    return (
        <div 
            onClick={handleCardClick}
            className="group bg-bg-primary/40 hover:bg-bg-primary/60 border border-border-primary rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-0"
        >
            {/* Thumbnail/Image Preview (Left side on larger screens, Top on mobile) */}
            {(images && images.length > 0) && (
                <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-black/20">
                    <img 
                        src={images[0]} 
                        alt="Post preview" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                            1/{images.length}
                        </div>
                    )}
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                    {/* Repost Header */}
                    {isRepost && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary mb-2 bg-accent-blue/5 w-fit px-2 py-0.5 rounded-full border border-accent-blue/10">
                            <Repeat size={10} className="text-accent-blue" />
                            <span>{repostUser?.name || 'Someone'} reposted</span>
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Clock size={12} className="text-text-secondary" />
                            <span className="text-[11px] text-text-secondary font-medium">{formattedTime}</span>
                            <span className="text-text-secondary text-[10px]">•</span>
                            <span className="text-[11px] text-text-secondary font-medium flex items-center gap-1">
                                {audience === 'Anyone' ? <Globe size={10} /> : <ThumbsUp size={10} />}
                                {audience || 'Public'}
                            </span>
                        </div>
                        <button className="text-text-secondary hover:text-white transition-colors">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-accent-blue transition-colors">
                        {repostContent || content}
                    </h4>
                    
                    {repostContent && content && (
                        <div className="pl-3 border-l-2 border-border-primary mt-1 mb-2">
                            <p className="text-xs text-text-secondary line-clamp-2 italic">
                                Original: {content}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Stats & Actions */}
                <div className="mt-4 pt-3 border-t border-border-primary flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-text-secondary text-[11px] font-bold group-hover:text-white transition-colors">
                            <ThumbsUp size={14} className="group-hover:text-accent-blue transition-colors" />
                            <span>{likes.length}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-secondary text-[11px] font-bold group-hover:text-white transition-colors">
                            <MessageSquare size={14} className="group-hover:text-accent-blue transition-colors" />
                            <span>{comments.length}</span>
                        </div>
                        {shareCount > 0 && (
                            <div className="flex items-center gap-1.5 text-text-secondary text-[11px] font-bold group-hover:text-white transition-colors">
                                <Send size={14} className="group-hover:text-accent-blue transition-colors" />
                                <span>{shareCount}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="text-[10px] font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        View Full Post
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePostCard;
