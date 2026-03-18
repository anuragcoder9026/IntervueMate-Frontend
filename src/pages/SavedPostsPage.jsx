import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedPosts, reset } from '../store/postSlice';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import MainLeftSidebar from '../components/MainLeftSidebar';
import MainRightSidebar from '../components/MainRightSidebar';
import { Bookmark, Loader2, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const SavedPostsPage = () => {
    const dispatch = useDispatch();
    const { savedPosts, isLoading, isError, isSuccess, message } = useSelector((state) => state.post);

    useEffect(() => {
        dispatch(getSavedPosts());

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
            dispatch(reset());
        }
    }, [isError, isSuccess, message, dispatch]);

    return (
        <div className="bg-bg-primary h-screen flex flex-col overflow-hidden">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full flex-1 overflow-y-auto lg:overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col lg:flex-row lg:gap-8 gap-1 items-start lg:h-full">

                    {/* Left Sidebar */}
                    <div className="w-full lg:w-64 lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 pb-4 lg:pb-10 lg:sticky lg:top-0 z-20">
                        <MainLeftSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 w-full max-w-2xl lg:h-full lg:overflow-y-auto no-scrollbar space-y-6 pb-10">
                        {/* Page Header */}
                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                    <Bookmark size={24} className="text-amber-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight">Saved Items</h1>
                                    <p className="text-text-secondary text-sm font-medium">Posts and articles you've saved for later</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Tip */}
                        <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-4 flex gap-3 items-start">
                             <Info size={18} className="text-accent-blue shrink-0 mt-0.5" />
                             <p className="text-xs text-text-secondary leading-relaxed">
                                Items you save here are only visible to you. Use them to keep track of interesting interview experiences, prep resources, or discussions you want to revisit.
                             </p>
                        </div>

                        {/* Feed Posts */}
                        <div className="space-y-6">
                            {isLoading && savedPosts.length === 0 ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <Loader2 size={40} className="text-accent-blue animate-spin" />
                                    <p className="text-text-secondary font-medium italic">Retrieving your saved treasures...</p>
                                </div>
                            ) : savedPosts.length > 0 ? (
                                savedPosts.map(post => (
                                    <PostCard key={post._id} {...post} isSaved={true} />
                                ))
                            ) : !isLoading && (
                                <div className="py-20 flex flex-col items-center text-center border-2 border-dashed border-border-primary rounded-3xl animate-in fade-in duration-700">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Bookmark size={32} className="text-text-secondary opacity-30" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">No saved items yet</h3>
                                    <p className="text-text-secondary text-sm max-w-xs mx-auto">
                                        Found something interesting? Click the save button on any post to keep it here for easy access.
                                    </p>
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
        </div>
    );
};

export default SavedPostsPage;
