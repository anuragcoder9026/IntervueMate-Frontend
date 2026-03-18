import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Plus, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { followUser } from '../../store/authSlice';
import { toast } from 'react-toastify';

const SuggestionsRow = ({ userId, name, headline, education, image, onFollowSuccess }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isFollowing, setIsFollowing] = useState(false);

    const handleProfileClick = () => {
        if (userId) {
            const nameSlug = name.replace(/\s+/g, '').toLowerCase();
            navigate(`/profile/${nameSlug}-${userId}`);
        }
    };

    const handleConnect = async (e) => {
        e.stopPropagation();
        setIsFollowing(true);
        try {
            await dispatch(followUser(userId)).unwrap();
            toast.success(`Following ${name}`);
            if (onFollowSuccess) onFollowSuccess(userId);
        } catch (err) {
            setIsFollowing(false);
            toast.error(err || 'Failed to connect');
        }
    };

    return (
        <div className="flex items-start gap-4 p-1 group">
            <div className="relative shrink-0 mt-1 cursor-pointer" onClick={handleProfileClick}>
                <div className="w-12 h-12 rounded-full overflow-hidden border border-border-primary bg-bg-primary flex items-center justify-center group-hover:border-accent-blue/50 transition-all">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] text-text-secondary font-bold">User</span>
                    )}
                </div>
            </div>
            <div className="flex-1 space-y-1">
                <h5 
                    onClick={handleProfileClick}
                    className="text-xs font-bold text-text-primary hover:text-accent-blue cursor-pointer transition-colors line-clamp-1"
                >
                    {name}
                </h5>
                <p className="text-[10px] text-text-secondary leading-tight line-clamp-2">
                    {headline || education || 'Professional'}
                </p>
                <button 
                    onClick={handleConnect}
                    disabled={isFollowing}
                    className="flex items-center gap-1.5 px-4 py-1 mt-2 text-[10px] font-bold text-text-secondary border border-border-primary hover:border-accent-blue hover:text-white rounded-full transition-all group-hover:bg-accent-blue/5 disabled:opacity-50"
                >
                    {isFollowing ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    Connect
                </button>
            </div>
        </div>
    );
};

export default SuggestionsRow;
