import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Hash, Volume2, Mic, Headphones, X, Check, Search, PlusCircle, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { getGroupDiscussions, createGroupDiscussion, getJoinedGroupsOfUser } from '../../../store/groupSlice';

const DiscussionLeftSidebar = ({ onClose, currentChannel, onChannelChange }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { joinedGroups, currentGroup, discussions, isDiscussionsLoading } = useSelector((state) => state.group);
    const { user } = useSelector((state) => state.auth);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState({ name: '', category: 'general' });
    const [isCreating, setIsCreating] = useState(false);

    const groups = joinedGroups?.map((g, i) => ({
        id: g._id,
        groupId: g.groupId,
        name: g.name,
        initials: g.name.substring(0, 3).toUpperCase(),
        color: ['bg-blue-600', 'bg-purple-600', 'bg-pink-600', 'bg-green-600'][i % 4]
    })) || [];

    const slugify = (text, channelId) => {
        const slug = text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
        return channelId ? `${slug}-${channelId}` : slug;
    };

    // Fetch joined groups if not available
    useEffect(() => {
        if (joinedGroups.length === 0) {
            dispatch(getJoinedGroupsOfUser());
        }
    }, [dispatch, joinedGroups.length]);



    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateDiscussion = async (e) => {
        e.preventDefault();
        if (!newDiscussion.name.trim()) return;

        setIsCreating(true);
        // If category is voice, set type to voice as well
        const discussionData = {
            ...newDiscussion,
            type: newDiscussion.category === 'voice' ? 'voice' : 'chat'
        };

        await dispatch(createGroupDiscussion({
            groupId: currentGroup?._id,
            discussionData
        }));
        setIsCreating(false);
        setIsModalOpen(false);
        setNewDiscussion({ name: '', category: 'general' });
    };

    if (!currentGroup) return <div className="w-[300px] max-w-[85vw] bg-[#1E232E] shrink-0 h-full border-r border-white/5" />;

    return (
        <div className="w-[300px] max-w-[85vw] bg-[#1E232E] flex flex-col h-full border-r border-white/5 shrink-0 text-gray-300 relative shadow-2xl md:shadow-none pb-16 lg:pb-0">
            {/* Header */}
            <div
                className={`h-12 border-b border-white/5 flex items-center justify-between px-4 cursor-pointer hover:bg-white/5 transition-colors shrink-0 z-20 ${isDropdownOpen ? 'bg-white/5' : ''}`}
            >
                <div
                    className="flex items-center gap-2 flex-1 min-w-0"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <div className="w-6 h-6 rounded bg-accent-blue flex items-center justify-center text-white text-[10px] font-bold shrink-0 uppercase">
                        {currentGroup.name.substring(0, 2)}
                    </div>
                    <h2 className="font-bold text-white text-[15px] truncate max-w-[150px]">{currentGroup.name}</h2>
                    {isDropdownOpen ? <X size={14} className="shrink-0" /> : <ChevronDown size={14} className="shrink-0" />}
                </div>

                <button onClick={onClose} className="md:hidden text-gray-500 hover:text-white transition-colors p-1">
                    <X size={20} />
                </button>
            </div>

            {/* Groups Dropdown */}
            {isDropdownOpen && (
                <div className="absolute top-12 left-2 right-2 mt-1 bg-[#111721] rounded-lg border border-white/5 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-3 bg-[#181F2B]/50 border-b border-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search groups..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0D1219] border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-blue/50 transition-all font-medium"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto no-scrollbar p-2 space-y-0.5">
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <div
                                    key={group.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropdownOpen(false);
                                        setSearchQuery("");
                                        const slug = `${slugify(group.name)}-${group.groupId}`;
                                        navigate(`/groups/${slug}/discussion/announcements/messages`);
                                    }}
                                    className={`flex items-center justify-between p-2 rounded-md transition-all hover:bg-white/5 cursor-pointer group ${currentGroup._id === group.id ? 'bg-accent-blue/10 text-accent-blue' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${group.color} flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                                            {group.initials}
                                        </div>
                                        <span className="text-[14px] font-semibold truncate max-w-[160px]">{group.name}</span>
                                    </div>
                                    {currentGroup._id === group.id && <Check size={16} className="text-accent-blue shrink-0" />}
                                </div>
                            ))
                        ) : (
                            <div className="py-8 px-4 text-center">
                                <p className="text-sm text-gray-500 italic">No groups found</p>
                            </div>
                        )}
                    </div>
                    <div className="h-px bg-white/5 w-full"></div>
                    <div className="p-1">
                        <button
                            onClick={() => navigate('/groups')}
                            className="w-full flex items-center gap-2 p-2 rounded-md text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                        >
                            <PlusCircle size={14} />
                            Explore Other Groups
                        </button>
                    </div>
                </div>
            )}

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">

                {/* Information Category */}
                <div>
                    <div className="flex items-center text-xs font-bold text-gray-500 hover:text-gray-300 cursor-pointer mb-2 px-1">
                        <ChevronDown size={10} className="mr-1" />
                        INFORMATION
                    </div>
                    <div className="space-y-0.5">
                        <ChannelItem
                            icon={<Volume2 size={16} />}
                            name="announcements"
                            active={currentChannel?.name === 'announcements'}
                            onClick={() => onChannelChange({ name: 'announcements' })}
                        />
                        <ChannelItem
                            icon={<Hash size={16} />}
                            name="rules"
                            active={currentChannel?.name === 'rules'}
                            onClick={() => onChannelChange({ name: 'rules' })}
                        />
                    </div>
                </div>

                {/* General Category */}
                <div>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-300 mb-2 px-1">
                        <div className="flex items-center cursor-pointer">
                            <ChevronDown size={10} className="mr-1" />
                            GENERAL CHAT
                        </div>
                        <button
                            onClick={() => {
                                setNewDiscussion({ ...newDiscussion, category: 'general' });
                                setIsModalOpen(true);
                            }}
                            className="hover:text-white transition-colors"
                        >
                            <PlusCircle size={14} />
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {isDiscussionsLoading && (!discussions || discussions.filter(d => d.category === 'general').length === 0) ? (
                            <div className="px-4 py-2 text-xs text-gray-600 animate-pulse italic">Loading discussions...</div>
                        ) : (discussions?.filter(d => d.category === 'general').length > 0) ? (
                            discussions.filter(d => d.category === 'general').map(d => (
                                <ChannelItem
                                    key={d._id}
                                    icon={d.type === 'voice' ? <Volume2 size={16} /> : <Hash size={16} />}
                                    name={d.name}
                                    active={currentChannel?._id === d._id}
                                    onClick={() => onChannelChange(d)}
                                />
                            ))
                        ) : (
                            <div className="px-4 py-2 text-[13px] text-gray-650 italic">No channels yet</div>
                        )}
                    </div>
                </div>

                {/* Preparation Category */}
                <div>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-300 mb-2 px-1">
                        <div className="flex items-center cursor-pointer">
                            <ChevronDown size={10} className="mr-1" />
                            PREPARATION
                        </div>
                        <button
                            onClick={() => {
                                setNewDiscussion({ ...newDiscussion, category: 'preparation' });
                                setIsModalOpen(true);
                            }}
                            className="hover:text-white transition-colors"
                        >
                            <PlusCircle size={14} />
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {isDiscussionsLoading && (!discussions || discussions.filter(d => d.category === 'preparation').length === 0) ? (
                            <div className="px-4 py-2 text-xs text-gray-600 animate-pulse italic">Loading discussions...</div>
                        ) : (discussions?.filter(d => d.category === 'preparation').length > 0) ? (
                            discussions.filter(d => d.category === 'preparation').map(d => (
                                <ChannelItem
                                    key={d._id}
                                    icon={d.type === 'voice' ? <Volume2 size={16} /> : <Hash size={16} />}
                                    name={d.name}
                                    active={currentChannel?._id === d._id}
                                    onClick={() => onChannelChange(d)}
                                />
                            ))
                        ) : (
                            <div className="px-4 py-2 text-[13px] text-gray-650 italic">No channels yet</div>
                        )}
                    </div>
                </div>

                {/* Voice Category */}
                <div>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-300 mb-2 px-1 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer">
                            <ChevronDown size={10} className="mr-1" />
                            Voice Lounges
                        </div>
                        <button
                            onClick={() => {
                                setNewDiscussion({ ...newDiscussion, category: 'voice' });
                                setIsModalOpen(true);
                            }}
                            className="hover:text-white transition-colors"
                        >
                            <PlusCircle size={14} />
                        </button>
                    </div>
                    <div className="space-y-0.5">
                        {isDiscussionsLoading && (!discussions || discussions.filter(d => d.category === 'voice').length === 0) ? (
                            <div className="px-4 py-2 text-xs text-gray-600 animate-pulse italic">Loading...</div>
                        ) : (discussions?.filter(d => d.category === 'voice').length > 0) ? (
                            discussions.filter(d => d.category === 'voice').map(d => (
                                <ChannelItem
                                    key={d._id}
                                    icon={<Volume2 size={16} />}
                                    name={d.name}
                                    active={currentChannel?._id === d._id}
                                    onClick={() => onChannelChange(d)}
                                />
                            ))
                        ) : (
                            <div className="px-4 py-2 text-[13px] text-gray-650 italic">No voice lounges</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="h-[52px] bg-[#1a1f29] border-t border-white/5 p-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 hover:bg-white/10 p-1 rounded-md cursor-pointer transition-colors max-w-[150px]">
                    <div className="relative shrink-0">
                        <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} className="w-8 h-8 rounded-full object-cover" alt={user?.name} />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-[#1a1f29]"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white leading-tight truncate">{user?.name}</span>
                        <span className="text-[11px] text-gray-400 leading-tight truncate">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                    <button className="p-1.5 hover:bg-white/10 hover:text-white rounded-md transition-colors"><Mic size={18} /></button>
                    <button className="p-1.5 hover:bg-white/10 hover:text-white rounded-md transition-colors"><Headphones size={18} /></button>
                </div>
            </div>

            {/* Create Discussion Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300">
                    <div className="bg-bg-secondary border border-border-primary/50 w-full max-w-md rounded-[1.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="relative px-6 pt-6 pb-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-black text-white tracking-tight leading-none">
                                            {newDiscussion.category === 'voice' ? 'New Lounge' : 'New Channel'}
                                        </h3>

                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60 mr-1">Creating in</span>
                                        <span className={`px-1.5 py-0.5 rounded-full text-[9px]  uppercase tracking-widest ${newDiscussion.category === 'general' ? 'bg-blue-400/20 text-blue-400' :
                                            newDiscussion.category === 'preparation' ? 'bg-purple-400/20 text-purple-400' :
                                                'bg-emerald-400/20 text-emerald-400'
                                            }`}>
                                            {newDiscussion.category}
                                        </span>

                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-bg-tertiary transition-all border border-white/5 active:scale-95"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateDiscussion} className="p-6 space-y-6 bg-gradient-to-b from-transparent to-black/10">

                            {/* Channel Name Input */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Channel Name</label>
                                    <span className="text-[9px] text-text-secondary/50 font-medium italic">lowercase-only</span>
                                </div>
                                <div className="relative group">
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${newDiscussion.name ? 'text-accent-blue scale-110' : 'text-gray-600'}`}>
                                        <Hash size={18} strokeWidth={3} />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-bg-primary border border-border-primary/50 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-gray-700/60 focus:border-accent-blue/50 focus:bg-bg-tertiary/30 focus:ring-4 focus:ring-accent-blue/5 outline-none transition-all duration-500 font-bold tracking-tight shadow-inner"
                                        placeholder="explore-ideas"
                                        value={newDiscussion.name}
                                        onChange={(e) => setNewDiscussion({ ...newDiscussion, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        autoFocus
                                    />
                                    <div className={`absolute bottom-0 right-4 top-0 flex items-center transition-all duration-300 ${newDiscussion.name ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                                        <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-2 rounded-lg bg-orange-400/5 border border-orange-400/10">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full shrink-0"></div>
                                    <p className="text-[9px] text-orange-400/80 font-bold uppercase tracking-wider">Note: Channels are visible to all members</p>
                                </div>
                            </div>


                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 text-[10px] font-black text-text-secondary hover:text-white transition-all uppercase tracking-[0.2em] hover:bg-white/5 rounded-xl"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newDiscussion.name || isCreating}
                                    className="flex px-3 bg-accent-blue hover:bg-blue-600 text-white font-black py-3 rounded-xl transition-all shadow-[0_8px_16px_-6px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(59,130,246,0.5)] active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2.5 uppercase tracking-[0.15em] text-[10px] group"
                                >
                                    {isCreating ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            <div className="w-5 h-5 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <PlusCircle size={16} strokeWidth={3} />
                                            </div>
                                            <span className="text-[10px] mr-1">Create</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChannelItem = ({ icon, name, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${active ? 'bg-[#293240] text-gray-100' : 'text-gray-400 hover:bg-[#293240]/50 hover:text-gray-200'}`}
    >
        <div className={`shrink-0 ${active ? 'text-accent-blue' : 'text-gray-400'}`}>{icon}</div>
        <span className={`text-[15px] truncate font-medium ${active ? 'font-bold' : ''}`}>{name}</span>
        {active && <div className="ml-auto w-1 h-3 bg-accent-blue rounded-full"></div>}
    </div>
);

export default DiscussionLeftSidebar;
