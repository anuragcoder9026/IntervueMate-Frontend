import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, MessageSquare, Repeat, PenLine, MessageCircle, Send, Link } from 'lucide-react';
import LikesModal from './LikesModal';

const PostStatsAndActions = ({
    likesCount, isLiked, onLike,
    commentsCount, showComments, setShowComments,
    onRepostClick, onInstantRepost, isSubmittingRepost,
    postId, shareCount = 0
}) => {
    const navigate = useNavigate();
    const [isRepostMenuOpen, setIsRepostMenuOpen] = useState(false);
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
    const repostMenuRef = useRef(null);
    const shareMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (repostMenuRef.current && !repostMenuRef.current.contains(event.target)) {
                setIsRepostMenuOpen(false);
            }
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setIsShareMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const postUrl = `${window.location.origin}/post/${postId}`;
    const shareText = encodeURIComponent("Check out this interesting post on InterviewMate!");

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: <svg size={16} viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366] w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.55 4.197 1.592 6.015L0 24l6.149-1.612a12.01 12.01 0 005.895 1.528h.005c6.632 0 12.05-5.419 12.05-12.054 0-3.219-1.254-6.242-3.532-8.52z" /></svg>,
            onClick: () => window.open(`https://api.whatsapp.com/send?text=${shareText}%0A${postUrl}`, '_blank')
        },
        {
            name: 'Telegram',
            icon: <Send size={16} className="text-[#0088cc]" />,
            onClick: () => window.open(`https://t.me/share/url?url=${postUrl}&text=${shareText}`, '_blank')
        },
        {
            name: 'InterviewMate',
            icon: <div className="bg-accent-blue rounded-lg w-5 h-5 flex items-center justify-center"><Link size={12} className="text-white" /></div>,
            onClick: () => {
                navigate(`/messages?sharePostId=${postId}`);
            }
        }
    ];

    return (
        <>
            {/* Stats */}
            <div className="px-3 sm:px-4 py-2 flex justify-between items-center text-[10px] sm:text-[11px] text-text-secondary font-medium border-t border-border-primary/50">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-rose-500 transition-colors group/likes"
                    onClick={() => setIsLikesModalOpen(true)}
                >
                    <div className="flex -space-x-1 items-center">
                        <div className={`w-4 h-4 rounded-full ${isLiked ? 'bg-rose-500' : 'bg-accent-blue'} flex items-center justify-center p-0.5 border border-bg-secondary group-hover/likes:scale-110 transition-transform`}>
                            <Heart size={8} fill="white" className="text-white" />
                        </div>
                    </div>
                    <span className="group-hover/likes:underline">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </div>
                <div className="flex gap-2 sm:gap-3 shrink-0">
                    <span className="hover:text-accent-blue cursor-pointer" onClick={() => setShowComments(!showComments)}>{commentsCount} Comments</span>
                    <span>•</span>
                    <span className="hover:text-accent-blue cursor-pointer">{shareCount} {shareCount === 1 ? 'Share' : 'Shares'}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-1 px-2 sm:px-4 border-t border-border-primary/50 flex items-center justify-between gap-1">
                <button
                    onClick={onLike}
                    className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all active:scale-95 group/btn min-w-[60px] ${isLiked ? 'text-rose-500 bg-rose-500/5' : 'text-text-secondary hover:text-white hover:bg-bg-tertiary'}`}
                >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={`${isLiked ? 'text-rose-500' : 'group-hover/btn:text-rose-500'} transition-colors shrink-0`} />
                    <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all active:scale-95 group/btn min-w-[80px] ${showComments ? 'text-accent-blue bg-accent-blue/5' : 'text-text-secondary hover:text-white hover:bg-bg-tertiary'}`}
                >
                    <MessageSquare size={16} className={`${showComments ? 'text-accent-blue' : 'group-hover/btn:text-accent-blue'} transition-colors shrink-0`} />
                    <span className="hidden sm:inline">Comment</span>
                </button>
                <div className={`flex-1 relative ${isRepostMenuOpen ? 'z-[101]' : 'z-auto'}`} ref={repostMenuRef}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsRepostMenuOpen(prev => !prev);
                            setIsShareMenuOpen(false);
                        }}
                        type="button"
                        className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all active:scale-95 group/btn min-w-[70px] ${isRepostMenuOpen ? 'text-accent-blue bg-accent-blue/5' : 'text-text-secondary hover:text-white hover:bg-bg-tertiary'}`}
                    >
                        <Repeat size={16} className={`${isRepostMenuOpen ? 'text-accent-blue' : 'group-hover/btn:text-accent-blue'} transition-colors shrink-0`} />
                        <span className="hidden sm:inline">Repost</span>
                    </button>

                    {/* Repost Menu Section */}
                    {isRepostMenuOpen && (
                        <div className="absolute bottom-full right-0 mb-3 w-[220px] bg-bg-secondary border-2 border-accent-blue rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] p-1.5 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-150">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsRepostMenuOpen(false);
                                    onInstantRepost();
                                }}
                                disabled={isSubmittingRepost}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-bg-tertiary rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                                {isSubmittingRepost ? (
                                    <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                                ) : (
                                    <Repeat size={16} className="text-emerald-500" />
                                )}
                                <span>Repost Instantly</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsRepostMenuOpen(false);
                                    onRepostClick();
                                }}
                                disabled={isSubmittingRepost}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-bg-tertiary rounded-lg transition-colors font-medium mt-1 disabled:opacity-50"
                            >
                                <PenLine size={16} className="text-accent-blue" />
                                <span>Repost with thoughts</span>
                            </button>
                        </div>
                    )}
                </div>
                <div className={`flex-1 relative ${isShareMenuOpen ? 'z-[101]' : 'z-auto'}`} ref={shareMenuRef}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsShareMenuOpen(prev => !prev);
                            setIsRepostMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all active:scale-95 group/btn min-w-[70px] ${isShareMenuOpen ? 'text-emerald-500 bg-emerald-500/5' : 'text-text-secondary hover:text-white hover:bg-bg-tertiary'}`}
                    >
                        <Share2 size={16} className={`${isShareMenuOpen ? 'text-emerald-500' : 'group-hover/btn:text-emerald-500'} transition-colors shrink-0`} />
                        <span className="hidden sm:inline">Share</span>
                    </button>

                    {/* Share Menu */}
                    {isShareMenuOpen && (
                        <div className="absolute bottom-full right-0 mb-3 w-[200px] bg-bg-secondary border-2 border-emerald-500 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] p-1.5 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-150">
                            {shareOptions.map((option) => (
                                <button
                                    key={option.name}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsShareMenuOpen(false);
                                        option.onClick();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-bg-tertiary rounded-lg transition-colors font-medium"
                                >
                                    {option.icon}
                                    <span>{option.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <LikesModal
                isOpen={isLikesModalOpen}
                onClose={() => setIsLikesModalOpen(false)}
                postId={postId}
            />
        </>
    );
};

export default PostStatsAndActions;
