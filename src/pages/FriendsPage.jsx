import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import ConnectionRow from '../components/friends/ConnectionRow';
import FriendsLeftSidebar from '../components/friends/FriendsLeftSidebar';
import FriendsRightSidebar from '../components/friends/FriendsRightSidebar';
import api from '../utils/api';

const FriendsPage = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('followers'); // 'followers' or 'following'
    const [searchQuery, setSearchQuery] = useState('');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNetwork = async () => {
            if (!currentUser) return;
            try {
                const response = await api.get(`/users/${currentUser._id}`);
                if (response.data.success) {
                    setFollowers(response.data.user.followers || []);
                    setFollowing(response.data.user.following || []);
                }
            } catch (err) {
                console.error('Fetch Network Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNetwork();
    }, [currentUser]);

    const displayUsers = activeTab === 'followers' ? followers : following;
    
    const filteredUsers = displayUsers.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.education?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#0A0F1A] min-h-screen text-text-primary pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6 items-start">

                <FriendsLeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Center Column */}
                <div className="flex-1 w-full space-y-4">
                    {/* Search Bar */}
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-2 shadow-sm">
                        <div className="relative flex items-center gap-4 bg-bg-primary px-4 py-2 rounded-xl border border-transparent focus-within:border-accent-blue/30 transition-all">
                            <Search size={18} className="text-text-secondary" />
                            <input
                                type="text"
                                placeholder="Search by name, college, or role"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-text-secondary/60 text-text-primary h-6"
                            />
                        </div>
                    </div>

                    {/* Connections List Card */}
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8 border-b border-border-primary/50 pb-4">
                            <h2 className="text-xl font-bold text-white tracking-tight capitalize">
                                {activeTab === 'followers' ? `${followers.length}` : `${following.length}`}
                                <span className="ml-2 text-text-secondary">{activeTab === 'followers' ? `  Followers` : `   Following`}</span>
                            </h2>
                            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary cursor-pointer hover:text-white transition-colors">
                                <span>Sort by: <span className="text-white">Recently added</span></span>
                                <ChevronDown size={14} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {isLoading ? (
                                <div className="py-12 flex flex-col items-center justify-center text-text-secondary">
                                    <Loader2 size={32} className="animate-spin mb-2" />
                                    <p className="text-sm font-medium">Syncing your network...</p>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((person) => (
                                    <ConnectionRow 
                                        key={person._id} 
                                        userId={person._id}
                                        name={person.name}
                                        headline={person.headline}
                                        university={person.education}
                                        image={person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&color=fff`}
                                        connectedDate={new Date(person.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    />
                                ))
                            ) : (
                                <div className="py-12 text-center text-text-secondary">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-medium">No results found for your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <FriendsRightSidebar />
            </div>
        </div>
    );
};

export default FriendsPage;
