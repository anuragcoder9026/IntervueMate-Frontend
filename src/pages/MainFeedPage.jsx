import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, createPost, reset } from '../store/postSlice';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import MainLeftSidebar from '../components/MainLeftSidebar';
import MainRightSidebar from '../components/MainRightSidebar';
import CreatePostModal from '../components/feed/CreatePostModal';
import { Image, Video, FileText, Send, Sparkles, Link, ChevronDown, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const MainFeedPage = () => {
    const dispatch = useDispatch();
    const { posts, isLoading, isError, message, isCreating, isCreated, isSuccess } = useSelector((state) => state.post);
    const { user } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getPosts());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            if (message) toast.error(message);
            dispatch(reset());
        }
        if (isSuccess) {
            if (message) toast.success(message);
            if (isCreated) setIsModalOpen(false);
            dispatch(reset());
        }
    }, [isError, isSuccess, isCreated, message, dispatch]);

    const handleCreatePost = (content, attachments = [], tags = [], audience = null) => {
        if (!content.trim() && attachments.length === 0) return;

        const formData = new FormData();
        formData.append('content', content);
        formData.append('audience', audience?.name || 'Anyone');

        // Append files (images and docs)
        attachments.forEach(att => {
            if ((att.type === 'image' || att.type === 'file') && att.file) {
                formData.append('files', att.file);
            }
        });

        // Collect links
        const linkAttachments = attachments.filter(att => att.type === 'link').map(att => att.url);
        formData.append('links', JSON.stringify(linkAttachments));

        // Tags
        formData.append('tags', JSON.stringify(tags));

        dispatch(createPost(formData));
        // Modal closing handled by useEffect on isCreated
    };

    return (
        <div className="bg-bg-primary h-screen flex flex-col overflow-hidden">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full flex-1 overflow-y-auto lg:overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col lg:flex-row lg:gap-8 gap-1 items-start lg:h-full">

                    {/* Left Sidebar */}
                    <div className="w-full lg:w-64 lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 pb-4 lg:pb-10 lg:sticky lg:top-0 z-20">
                        <MainLeftSidebar />
                    </div>

                    {/* Main Feed Content */}
                    <div className="flex-1 w-full max-w-2xl lg:h-full lg:overflow-y-auto no-scrollbar space-y-6 pb-10">
                        {/* Create Post Card */}
                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm">
                            <div className="flex gap-4">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Me'}&background=random`}
                                    className="w-10 h-10 rounded-full"
                                    alt="Me"
                                />
                                <div className="flex-1 relative flex items-center group">
                                    <input
                                        type="text"
                                        readOnly
                                        onClick={() => setIsModalOpen(true)}
                                        placeholder="Start a post, share an interview experience..."
                                        className="w-full bg-bg-primary text-text-primary text-sm font-medium px-5 py-3.5 rounded-full border border-border-primary hover:border-accent-blue/50 focus:outline-none cursor-text transition-all placeholder:text-text-secondary pr-10 shadow-inner"
                                    />
                                    <button className="absolute right-4 text-accent-blue opacity-50 transition-opacity hover:opacity-100 hover:scale-110 active:scale-95 pointer-events-none">
                                        <Sparkles size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between sm:justify-start items-center gap-1 sm:gap-6 ml-2">
                                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white transition-colors group">
                                    <Image size={18} className="text-accent-blue group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">Media</span>
                                </button>
                                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white transition-colors group">
                                    <FileText size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">File</span>
                                </button>
                                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white transition-colors group">
                                    <Link size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">Link</span>
                                </button>
                            </div>
                        </div>

                    
                        {/* Feed Posts */}
                        <div className="space-y-6">
                            {isLoading && posts.length === 0 ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <Loader2 size={40} className="text-accent-blue animate-spin" />
                                    <p className="text-text-secondary font-medium italic">Finding relevant discussions...</p>
                                </div>
                            ) : posts.length > 0 ? (
                                posts.map(post => (
                                    <PostCard key={post._id} {...post} />
                                ))
                            ) : !isLoading && (
                                <div className="py-20 text-center border-2 border-dashed border-border-primary rounded-3xl">
                                    <p className="text-text-secondary font-bold">No posts yet. Be the first to share!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden xl:block w-[320px] lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 pb-10">
                        <MainRightSidebar />
                    </div>
                </div>
            </main>

            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPost={handleCreatePost}
                isLoading={isCreating}
            />
        </div>
    );
};

export default MainFeedPage;
