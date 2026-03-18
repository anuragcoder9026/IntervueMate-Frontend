import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, UserPlus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const FriendsLeftSidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [counts, setCounts] = useState({ followers: 0, following: 0, groups: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            if (!currentUser) return;
            try {
                const response = await api.get(`/users/${currentUser._id}`);
                if (response.data.success) {
                    setCounts({
                        followers: response.data.user.followers?.length || 0,
                        following: response.data.user.following?.length || 0,
                        groups: response.data.user.joinedGroups?.length || 0
                    });
                }
            } catch (err) {
                console.error('Fetch Counts Error:', err);
            }
        };

        fetchCounts();
    }, [currentUser]);

    const handleProfileClick = () => {
        if (currentUser) {
            const nameSlug = currentUser.name.replace(/\s+/g, '').toLowerCase();
            navigate(`/profile/${nameSlug}-${currentUser._id}`);
        }
    };

    return (
        <div className="w-full lg:w-72 space-y-4 shrink-0">
            {/* Manage network card */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm tracking-tight mb-6 text-white">Manage my network</h3>
                <div className="space-y-4">
                    <div 
                        onClick={() => setActiveTab && setActiveTab('followers')}
                        className={`flex items-center justify-between text-xs group cursor-pointer p-4 rounded-xl transition-all ${activeTab === 'followers' ? 'bg-accent-blue/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3 transition-colors">
                            <Users size={16} className={activeTab === 'followers' ? 'text-accent-blue' : ''} />
                            <span className={`font-medium ${activeTab === 'followers' ? 'text-white' : 'group-hover:text-white'}`}>Followers</span>
                        </div>
                        <span className={`font-bold ${activeTab === 'followers' ? 'text-accent-blue' : 'group-hover:text-white'}`}>{counts.followers}</span>
                    </div>

                    <div 
                        onClick={() => setActiveTab && setActiveTab('following')}
                        className={`flex items-center justify-between text-xs group cursor-pointer p-4 rounded-xl transition-all ${activeTab === 'following' ? 'bg-accent-blue/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-3 transition-colors">
                            <UserPlus size={16} className={activeTab === 'following' ? 'text-accent-blue' : ''} />
                            <span className={`font-medium ${activeTab === 'following' ? 'text-white' : 'group-hover:text-white'}`}>Following</span>
                        </div>
                        <span className={`font-bold ${activeTab === 'following' ? 'text-accent-blue' : 'group-hover:text-white'}`}>{counts.following}</span>
                    </div>
                    
                </div>
            </div>

            {/* Profile card */}
            <div 
                onClick={handleProfileClick}
                className="bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-sm group cursor-pointer hover:border-accent-blue/20 transition-all"
            >
                {currentUser?.banner ? (
                    <img src={currentUser.banner} alt="Banner" className="h-16 w-full object-cover border-b border-border-primary/30" />
                ) : (
                    <div className="h-16 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-border-primary/30"></div>
                )}
                <div className="px-5 pb-6 flex flex-col items-center">
                    <div className="relative -mt-8 mb-4">
                        <img
                            src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || '')}&background=random&color=fff`}
                            className="w-16 h-16 rounded-full border-4 border-bg-secondary shadow-xl transition-transform group-hover:scale-110 object-cover"
                            alt="Profile"
                        />
                    </div>
                    <h3 className="font-bold text-text-primary text-base text-center group-hover:text-white transition-colors line-clamp-1">{currentUser?.name}</h3>
                    <p className="text-[10px] text-text-secondary mt-1 text-center leading-relaxed px-2 line-clamp-2">
                        {currentUser?.headline || 'Member since ' + new Date(currentUser?.createdAt).getFullYear()}
                    </p>

                    <div className="w-full h-px bg-border-primary/50 my-6"></div>

                    <div className="w-full space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                            <span className="text-text-secondary">Profile Strength</span>
                            <span className="text-accent-blue font-bold">{currentUser?.aiSnapshot?.career_readiness?.level}</span>
                        </div>
                        <div className="h-1.5 bg-border-primary rounded-full overflow-hidden">
                            <div className="h-full bg-accent-blue rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000"
                            style={{ width: `${currentUser?.aiSnapshot?.career_readiness?.score}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsLeftSidebar;
