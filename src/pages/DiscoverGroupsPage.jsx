import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups, getFeaturedGroup, joinGroup } from '../store/groupSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { Search, Users, CheckCircle, Lock, LayoutGrid, Building2, Briefcase, Smile, CalendarDays, FileText, ChevronRight, Mic, Palette, Globe, EyeOff } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

const GroupCard = ({ group, onJoinSuccess, externalStatus }) => {
    const coverImg = group.coverImage || group.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=0284c7&color=fff&size=600`;
    const isPrivate = group.privacy === 'private';
    const slug = `${slugify(group.name)}-${group.groupId}`;

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isJoining, setIsJoining] = useState(false);
    const [joinStatus, setJoinStatus] = useState(null); // 'joined' | 'requested' | null

    const userId = user?._id || user?.id;
    const isMember = group.members?.some(m => (m.user?._id || m.user || m).toString() === userId) || externalStatus === 'joined';
    const isRequested = group.joinRequests?.some(r => (r.user?._id || r.user || r).toString() === userId) || externalStatus === 'requested';
    const isAdmin = group.admins?.some(a => (a._id || a).toString() === userId);

    const handleJoin = async (e) => {
        e.preventDefault();
        if (isMember || isRequested || isAdmin || isJoining || joinStatus || (externalStatus && externalStatus !== null)) return;
        setIsJoining(true);
        try {
            const result = await dispatch(joinGroup(slug)).unwrap();
            const status = result.status || (isPrivate ? 'requested' : 'joined');
            setJoinStatus(status);
            if (onJoinSuccess) onJoinSuccess(group._id, status);
        } catch (err) {
            toast.error(err || 'Failed to join group');
        } finally {
            setIsJoining(false);
        }
    };

    const getButtonLabel = () => {
        if (joinStatus === 'joined' || externalStatus === 'joined' || isMember || isAdmin) return 'Joined';
        if (joinStatus === 'requested' || externalStatus === 'requested' || isRequested) return 'Requested';
        if (isJoining) return 'Joining...';
        return isPrivate ? 'Request to Join' : 'Join Now';
    };

    const isDisabled = isMember || isRequested || isAdmin || isJoining || !!joinStatus || !!externalStatus;

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden hover:border-accent-blue/50 transition-all group shadow-sm flex flex-col h-full relative">
            <Link to={`/groups/${slug}`}>
                <div className="relative h-32 overflow-hidden">
                    <img src={coverImg} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={group.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/20 to-transparent"></div>

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {isPrivate && (
                            <div className="bg-amber-500/90 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm border border-white/10">
                                <Lock size={10} /> Private
                            </div>
                        )}
                    </div>

                    {/* Floating Logo */}
                    <div className="absolute bottom-0 left-4 w-20 h-20 bg-bg-primary/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center shadow-2xl transition-transform group-hover:-translate-y-1 overflow-hidden">
                        {group.logo ? (
                            <img src={group.logo} className="w-full h-full object-cover" alt={group.name} />
                        ) : (
                            <span className="text-accent-blue font-black text-sm">{group.name.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="p-5 flex-1 flex flex-col">
                <Link to={`/groups/${slug}`}>
                    <h4 className="font-outfit font-bold text-lg text-text-primary group-hover:text-accent-blue transition-colors truncate">{group.name}</h4>
                </Link>
                <p className="text-xs text-text-secondary mt-1 mb-1 line-clamp-1 leading-relaxed capitalize">{group.category}</p>
                <p className="text-xs text-text-secondary mt-1 mb-6 line-clamp-2 leading-relaxed flex-1 opacity-80">
                    {group.description}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-border-primary/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                        <Users size={14} className="text-text-secondary/50" />
                        <span className="tabular-nums">{group.memberCount || group.members?.length || 0} Members</span>
                    </div>
                    <button
                        onClick={handleJoin}
                        disabled={isDisabled}
                        className={`text-xs font-black uppercase tracking-tighter flex items-center gap-1 transition-all ${isDisabled
                            ? 'text-text-secondary/50 cursor-default'
                            : 'text-accent-blue hover:text-white cursor-pointer'
                            }`}
                    >
                        {isJoining && <div className="w-3 h-3 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin"></div>}
                        {getButtonLabel()}
                        {!isDisabled && <ChevronRight size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

const YourGroupCard = ({ name, updated, status, icon: Icon, members, statusAction }) => (
    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4 flex-1 min-w-[280px] hover:border-accent-blue/30 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue border border-accent-blue/20 group-hover:scale-110 transition-transform">
                    {Icon ? <Icon size={20} /> : <Users size={20} />}
                </div>
                <div>
                    <h5 className="font-bold text-sm text-text-primary group-hover:text-white transition-colors">{name}</h5>
                    <p className="text-[10px] text-text-secondary">Updated {updated}</p>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mt-6">
            <div className="flex -space-x-1.5">
                {[...Array(3)].map((_, i) => (
                    <img key={i} src={`https://ui-avatars.com/api/?name=${i}&background=random`} className="w-5 h-5 rounded-full border border-bg-secondary" alt="m" />
                ))}
                <div className="w-5 h-5 rounded-full border border-bg-secondary bg-bg-tertiary flex items-center justify-center text-[8px] font-bold">+{members}</div>
            </div>

            <div className="text-[10px] font-bold flex items-center gap-1.5">
                <span className="text-text-secondary">{status}</span>
                {statusAction && (
                    <button className="bg-bg-tertiary px-2 py-1 rounded-md text-text-primary border border-border-primary hover:bg-accent-blue hover:text-white transition-colors">
                        {statusAction}
                    </button>
                )}
            </div>
        </div>
    </div>
);

const CATEGORIES = ['All', 'Colleges', 'Companies', 'Technical Prep', 'Behavioral Prep', 'Upcoming Events', 'Career Guidance', 'Open Source', 'Hackathons'];

const CATEGORY_ICONS = {
    'All': LayoutGrid,
    'Colleges': Building2,
    'Companies': Briefcase,
    'Technical Prep': FileText,
    'Behavioral Prep': Smile,
    'Upcoming Events': CalendarDays,
    'Career Guidance': FileText,
    'Open Source': FileText,
    'Hackathons': FileText,
};

const DiscoverGroupsPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { groups, isLoading, featuredGroup } = useSelector((state) => state.group);
    const { user } = useSelector((state) => state.auth);

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(6);
    const [featuredJoinStatus, setFeaturedJoinStatus] = useState(null);
    const [isFeaturedJoining, setIsFeaturedJoining] = useState(false);
    const [localJoinStates, setLocalJoinStates] = useState({}); // { [groupId]: 'joined' | 'requested' }

    const userId = user?._id || user?.id;

    useEffect(() => {
        dispatch(getGroups(userId ? { excludeUser: userId } : {}));
        dispatch(getFeaturedGroup(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const elm = document.getElementById(id);
            if (elm) {
                setTimeout(() => elm.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        }
    }, [location]);

    const filteredGroups = groups.filter((group) => {
        const matchesCategory = activeFilter === 'All' || group.category === activeFilter;
        const matchesSearch = !searchQuery || group.name.toLowerCase().includes(searchQuery.toLowerCase()) || group.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Reset visible count when filter or search changes
    useEffect(() => {
        setVisibleCount(6);
    }, [activeFilter, searchQuery]);

    const visibleGroups = filteredGroups.slice(0, visibleCount);
    const hasMore = visibleCount < filteredGroups.length;

    const handleFeaturedJoin = async () => {
        if (!featuredGroup || isFeaturedJoining || featuredJoinStatus || localJoinStates[featuredGroup._id]) return;
        const slug = `${slugify(featuredGroup.name)}-${featuredGroup.groupId}`;
        setIsFeaturedJoining(true);
        try {
            const result = await dispatch(joinGroup(slug)).unwrap();
            const status = result.status || (featuredGroup.privacy === 'private' ? 'requested' : 'joined');
            setFeaturedJoinStatus(status);
            setLocalJoinStates(prev => ({ ...prev, [featuredGroup._id]: status }));
        } catch (err) {
            toast.error(err || 'Failed to join group');
        } finally {
            setIsFeaturedJoining(false);
        }
    };

    // Callback when a GroupCard join succeeds — sync featured card if same group
    const handleGroupCardJoin = (groupId, status) => {
        setLocalJoinStates(prev => ({ ...prev, [groupId]: status }));
        if (featuredGroup && (featuredGroup._id === groupId || featuredGroup._id?.toString() === groupId?.toString())) {
            setFeaturedJoinStatus(status);
        }
    };

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary">
            <Navbar isGroupMode={true} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="mb-4">
                    <h1 className="text-4xl lg:text-6xl font-outfit font-black tracking-tight text-white">Discover Groups</h1>
                    <p className="text-text-secondary mt-4 max-w-2xl text-lg opacity-80">
                        Find your community, join alumni networks, and ace your next interview together.
                    </p>


                    {/* Featured Highlight Card */}
                    {featuredGroup && (
                        <div className="mt-4 relative rounded-xl overflow-hidden border border-border-primary mb-4 group min-h-[220px] flex items-center shadow-2xl">
                            <div className="absolute inset-0">
                                <img
                                    src={featuredGroup.coverImage || featuredGroup.logo || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    alt={featuredGroup.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/90 to-bg-primary/20"></div>
                            </div>

                            <div className="relative z-10 p-6 md:p-10 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-blue/10 border border-accent-blue/30 rounded-full text-[9px] font-black text-accent-blue mb-4 uppercase tracking-[0.2em] shadow-lg backdrop-blur-sm">
                                    <Smile size={10} className="text-accent-blue" /> Featured Group
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-outfit font-black mb-2 leading-tight text-white">{featuredGroup.name}</h2>
                                <p className="text-text-secondary text-sm mb-4 leading-relaxed opacity-90 line-clamp-2">
                                    {featuredGroup.description}
                                </p>

                                <div className="flex flex-wrap gap-6 items-center mb-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                        <Users size={16} className="text-accent-blue" />
                                        {featuredGroup.memberCount || featuredGroup.members?.length || 0} Members
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                        {featuredGroup.privacy === 'private' ? (
                                            <><Lock size={12} className="text-amber-500" /> Private Group</>
                                        ) : (
                                            <><Globe size={12} className="text-emerald-500" /> Public Group</>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Active now
                                    </div>
                                </div>

                                {(() => {
                                    const isFeaturedRequested = featuredJoinStatus === 'requested' || featuredGroup.joinRequests?.some(r => (r.user?._id || r.user || r).toString() === userId);
                                    const isFeaturedJoined = featuredJoinStatus === 'joined';
                                    if (isFeaturedJoined) {
                                        return (
                                            <span className="inline-flex px-5 py-3.5 bg-emerald-500/20 text-emerald-400 font-black text-xs rounded-md items-center gap-2 uppercase tracking-tighter cursor-default">
                                                <CheckCircle size={14} /> Joined
                                            </span>
                                        );
                                    }
                                    if (isFeaturedRequested) {
                                        return (
                                            <span className="inline-flex px-5 py-3.5 bg-white/10 text-text-secondary font-black text-xs rounded-md items-center gap-2 uppercase tracking-tighter cursor-default">
                                                Requested
                                            </span>
                                        );
                                    }
                                    return (
                                        <button
                                            onClick={handleFeaturedJoin}
                                            disabled={isFeaturedJoining}
                                            className="inline-flex px-5 py-3.5 bg-accent-blue hover:bg-blue-600 text-white font-black text-xs rounded-md transition-all shadow-xl shadow-accent-blue/30 items-center gap-2 active:scale-95 group/btn uppercase tracking-tighter"
                                        >
                                            {isFeaturedJoining && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                            {isFeaturedJoining ? 'Joining...' : (featuredGroup.privacy === 'private' ? 'Request to Join' : 'Join Group')}
                                            {!isFeaturedJoining && <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />}
                                        </button>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                </div>

                {/* Filter Chips */}
                <div className="flex flex-col gap-3 mb-2 overflow-x-auto no-scrollbar pb-2">
                    {/* Desktop Integrated Search */}
                    <div className="mt-2 relative group max-w-3xl py-2">
                        <div className="absolute inset-y-0  left-5 flex items-center pointer-events-none">
                            <Search size={22} className="text-text-secondary group-focus-within:text-accent-blue transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for roles, companies, or topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-bg-secondary border border-border-primary rounded-2xl py-3 pl-14 pr-6 text-base focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition-all placeholder:text-text-secondary/40 shadow-2xl"
                        />
                    </div>
                    <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar pb-2">
                        {CATEGORIES.map((cat) => {
                            const Icon = CATEGORY_ICONS[cat] || FileText;
                            return (
                                <FilterChips
                                    key={cat}
                                    active={activeFilter === cat}
                                    icon={<Icon size={16} />}
                                    label={cat}
                                    onClick={() => setActiveFilter(cat)}
                                />
                            );
                        })}
                    </div>
                </div>
                {/* Explore Grid Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h3 className="text-2xl font-outfit font-black text-white">Explore Groups</h3>
                        <p className="text-xs text-text-secondary mt-1">{filteredGroups.length} groups found</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Sort by:</span>
                        <div className="bg-bg-secondary px-4 py-2 rounded-xl border border-border-primary text-xs font-bold text-white flex items-center gap-2 cursor-pointer hover:border-accent-blue transition-all group/sort shadow-sm">
                            Recommended <ChevronRight size={14} className="rotate-90 text-text-secondary group-hover/sort:text-accent-blue transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Explore Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
                    </div>
                ) : filteredGroups.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                            {visibleGroups.map((group) => (
                                <GroupCard
                                    key={group._id}
                                    group={group}
                                    onJoinSuccess={handleGroupCardJoin}
                                    externalStatus={localJoinStates[group._id]}
                                />
                            ))}
                        </div>
                        {hasMore && (
                            <div className="flex justify-center mb-20">
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                    className="px-10 py-4 bg-bg-secondary border border-border-primary text-text-secondary hover:text-white rounded-2xl text-sm font-extrabold transition-all shadow-xl hover:shadow-accent-blue/5 flex items-center gap-3 group/load active:scale-95"
                                >
                                    Load More Groups <ChevronRight size={18} className="rotate-90 group-hover/load:translate-y-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 mb-20">
                        <Users size={40} className="mx-auto mb-4 text-text-secondary/30" />
                        <h4 className="text-lg font-bold text-white mb-2">No groups found</h4>
                        <p className="text-sm text-text-secondary">Try a different category or search term.</p>
                    </div>
                )}


                {/* Your Groups Section */}
                <div id="your-groups" className="mb-20 scroll-mt-24">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h3 className="text-2xl font-outfit font-black text-white flex items-center gap-3">
                                <Users className="text-accent-blue" size={24} /> Your joined Groups
                            </h3>
                        </div>
                        <button className="text-xs font-bold text-accent-blue hover:text-white transition-colors uppercase tracking-widest">
                            View All
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-6 pb-4">
                        <YourGroupCard
                            name="System Design Study"
                            updated="2h ago"
                            status="Next meetup: 9PM"
                            members="12"
                            icon={LayoutGrid}
                        />
                        <YourGroupCard
                            name="Mock Interview Club"
                            updated="yesterday"
                            status="Next check-in: Tomorrow"
                            members="5"
                            statusAction="Check In"
                            icon={Mic}
                        />
                        <YourGroupCard
                            name="Stanford CS Alumni"
                            updated="5m ago"
                            status="New Event"
                            members="40"
                            icon={CheckCircle}
                        />
                    </div>
                </div>


            </div>
            <Footer />
        </div>
    );
};

const FilterChips = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-xl text-xs font-black transition-all border uppercase tracking-tighter ${active ? 'bg-accent-blue border-accent-blue text-white shadow-xl shadow-accent-blue/20' : 'bg-bg-secondary border-border-primary text-text-secondary hover:text-white hover:border-white/20'}`}
    >
        {icon && React.cloneElement(icon, { size: 14 })}
        {label}
    </button>
);

export default DiscoverGroupsPage;
