import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import ProfilePostCard from './ProfilePostCard';
import { Loader2, Newspaper } from 'lucide-react';

const PostsTab = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!user?._id) return;
            setIsLoading(true);
            try {
                const response = await api.get(`/users/${user._id}/posts`);
                if (response.data.success) {
                    setPosts(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching user posts:', err);
                toast.error('Failed to fetch posts');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPosts();
    }, [user]);

    if (isLoading) {
        return (
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-10 flex flex-col items-center justify-center shadow-sm">
                <Loader2 size={32} className="text-accent-blue animate-spin mb-4" />
                <p className="text-text-secondary text-sm font-medium">Loading activity...</p>
            </div>
        );
    }

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-white mb-6">Activity</h2>
            
            {posts.length > 0 ? (
                <div className="flex flex-col gap-5">
                    {posts.map((post) => (
                        <ProfilePostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-bg-primary/20 rounded-xl border border-dashed border-border-primary">
                    <Newspaper size={48} className="mx-auto text-text-secondary/20 mb-4" />
                    <h3 className="text-white font-bold mb-1">No activity yet</h3>
                    <p className="text-text-secondary text-sm max-w-xs mx-auto">
                        This user hasn't shared any posts or reposts yet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PostsTab;
