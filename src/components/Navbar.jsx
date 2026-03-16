import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { getJoinedGroupsOfUser } from '../store/groupSlice';
import {
    Home,
    Users,
    MessageSquare,
    Search,
    Bell,
    User,
    Globe,
    Layout,
    Mic,
    ChevronDown,
    Search as SearchIcon,
    Zap,
    Brain,
    ChevronRight,
    ClipboardList,
    Radio,
    LogOut,
    Settings
} from 'lucide-react';

const Navbar = ({ isGroupMode, groupName, groupId = '1' }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { joinedGroups } = useSelector((state) => state.group);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isPracticeOpen, setIsPracticeOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const practiceRef = useRef(null);
    const mobilePracticeRef = useRef(null);
    const profileRef = useRef(null);

    // Fetch joined groups on mount if not already fetched
    useEffect(() => {
        if (joinedGroups.length === 0) {
            dispatch(getJoinedGroupsOfUser());
        }
    }, [dispatch, joinedGroups.length]);

    const handleGroupToggle = () => {
        if (joinedGroups.length > 0) {
            const firstGroup = joinedGroups[0];
            const slug = `${firstGroup.name.toLowerCase().replace(/\s+/g, '-')}-${firstGroup.groupId}`;
            navigate(`/groups/${slug}`);
        } else {
            navigate('/no-groups');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isDesktopClick = practiceRef.current && !practiceRef.current.contains(event.target);
            const isMobileClick = mobilePracticeRef.current && !mobilePracticeRef.current.contains(event.target);
            const isProfileClick = profileRef.current && !profileRef.current.contains(event.target);

            if (isDesktopClick && isMobileClick) {
                setIsPracticeOpen(false);
            }
            if (isProfileClick) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = useMemo(() => [
        { name: 'Home', icon: Home, path: '/feed' },
        { name: 'Events', icon: Radio, path: '/events' },
        { name: 'Groups', icon: Users, path: '/groups' },
        { name: 'Practice', icon: Mic, path: '/interview' },
        { name: 'Dashboard', icon: Layout, path: '/dashboard' },
        { name: 'Message', icon: MessageSquare, path: '/messages' }
    ], []);

    return (
        <nav className="bg-bg-secondary border-b border-border-primary sticky top-0 z-[1000] h-16 w-full shadow-lg">
            <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-2">

                {/* Logo & Search */}
                <div className="flex items-center gap-2  xl:gap-6">
                    <Link to="/feed" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                            <Layout size={18} className="text-white" />
                        </div>
                        <span className="font-outfit font-bold text-lg hidden xl:block tracking-tight text-text-primary whitespace-nowrap">
                            Interview_Mate
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-3 bg-bg-primary px-3 lg:px-4 py-2 rounded-xl border border-transparent focus-within:border-accent-blue/50 focus-within:bg-bg-tertiary transition-all w-52 lg:w-80 xl:w-[350px]">
                        <SearchIcon size={16} className="text-text-secondary" />
                        <input
                            type="text"
                            placeholder={isGroupMode ? `Search in ${groupName}...` : "Search anything..."}
                            className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-text-secondary/60 text-text-primary"
                        />
                    </div>
                </div>

                {/* Global/Group Switcher - Responsive Full Width */}
                <div className="flex flex-1 sm:flex-none bg-bg-primary p-1 rounded-xl border border-border-primary mx-2 sm:mx-0">
                    <Link
                        to="/feed"
                        className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${!isGroupMode ? 'bg-bg-tertiary text-white shadow-md shadow-black/20' : 'text-text-secondary hover:text-white'}`}
                    >
                        <Globe size={14} className={`${!isGroupMode ? 'text-accent-blue' : ''}`} />
                        <span className="hidden sm:inline">General</span>
                    </Link>
                    <button
                        onClick={handleGroupToggle}
                        className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${isGroupMode ? 'bg-accent-blue text-white shadow-md shadow-accent-blue/20' : 'text-text-secondary hover:text-white'}`}
                    >
                        <Layout size={14} />
                        <span className="hidden sm:inline">Groups</span>
                    </button>
                </div>

                {/* Nav Links & Profile - Always Visible */}
                <div className="flex items-center gap-1 shrink-0 ml-auto">
                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="md:hidden p-2 text-text-secondary hover:text-white transition-colors shrink-0"
                    >
                        <SearchIcon size={20} />
                    </button>

                    <div className="hidden lg:flex items-center gap-0">
                        {navItems.map((item) => {
                            if (item.name === 'Practice') {
                                return (
                                    <div key={item.name} className="relative" ref={practiceRef}>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsPracticeOpen(!isPracticeOpen);
                                            }}
                                            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all group ${location.pathname.startsWith('/interview') || isPracticeOpen ? 'text-white' : 'text-text-secondary hover:text-white'}`}
                                        >
                                            <item.icon size={18} className={`transition-transform group-hover:-translate-y-0.5 ${location.pathname.startsWith('/interview') || isPracticeOpen ? 'text-accent-blue' : ''}`} />
                                            <span className="text-[9px] uppercase font-bold tracking-wider">{item.name}</span>
                                        </button>

                                        {/* Practice Dropdown Modal */}
                                        {isPracticeOpen && (
                                            <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-64 bg-bg-secondary/95 backdrop-blur-xl border border-border-primary rounded-2xl shadow-2xl p-2 z-[1050] overflow-hidden animate-in fade-in zoom-in duration-200">
                                                <div className="px-3 py-2 border-b border-border-primary mb-2">
                                                    <span className="text-[10px] font-black uppercase text-accent-blue tracking-widest">Practice Modes</span>
                                                </div>
                                                <Link
                                                    to="/interview"
                                                    onClick={() => setIsPracticeOpen(false)}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                                                >
                                                    <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                                                        <Mic size={20} />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <div className="text-[13px] font-bold text-white">Interviews</div>
                                                        <div className="text-[10px] text-text-secondary">AI Mock Sessions</div>
                                                    </div>
                                                    <ChevronRight size={14} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                                <Link
                                                    to="/quizzes"
                                                    onClick={() => setIsPracticeOpen(false)}
                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                                                >
                                                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                                        <Zap size={20} />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <div className="text-[13px] font-bold text-white">Quizzes</div>
                                                        <div className="text-[10px] text-text-secondary">Topic-wise Tests</div>
                                                    </div>
                                                    <ChevronRight size={14} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all group ${location.pathname === item.path ? 'text-white' : 'text-text-secondary hover:text-white'}`}
                                >
                                    <div className="relative">
                                        <item.icon size={18} className={`transition-transform group-hover:-translate-y-0.5 ${location.pathname === item.path ? 'text-accent-blue' : ''}`} />
                                        {item.name === 'Events' && (
                                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[9px] uppercase font-bold tracking-wider">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-0 pl-1 lg:border-l border-border-primary shrink-0">
                        <Link to="/notifications" className="p-1.5 text-text-secondary hover:text-white hover:bg-bg-tertiary rounded-xl transition-all relative shrink-0">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-accent-blue rounded-full border-2 border-bg-secondary"></span>
                        </Link>

                        <div className="relative ml-2" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full border-2 border-white/10 group-hover:border-accent-blue/50 transition-all overflow-hidden bg-bg-tertiary flex items-center justify-center shrink-0">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-bold text-xs">{user?.name?.charAt(0) || 'U'}</span>
                                    )}
                                </div>
                                <div className="hidden xl:block text-left whitespace-nowrap">
                                    <span className="text-xs font-bold leading-none text-text-primary block">{user?.name || 'User'}</span>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="text-[10px] text-text-secondary capitalize">{user?.role || 'User'}</span>
                                        <ChevronDown size={10} className={`text-text-secondary transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-56 bg-bg-secondary border border-border-primary rounded-2xl shadow-2xl p-2 z-[1050] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-3 py-3 border-b border-border-primary mb-1">
                                        <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                                        <p className="text-[10px] text-text-secondary truncate">{user?.email}</p>
                                    </div>
                                    <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all text-text-secondary hover:text-white group">
                                        <User size={16} />
                                        <span className="text-sm font-medium">My Profile</span>
                                    </Link>
                                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all text-text-secondary hover:text-white group">
                                        <Settings size={16} />
                                        <span className="text-sm font-medium">Settings</span>
                                    </Link>
                                    <div className="h-px bg-border-primary my-1 mx-2" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/10 transition-all text-red-400 group cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                        <span className="text-sm font-bold">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar Expandable */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 bg-bg-secondary border-b border-border-primary ${isSearchOpen ? 'max-h-20 py-4 px-4' : 'max-h-0'}`}>
                <div className="flex items-center gap-3 bg-bg-primary px-4 py-2 rounded-xl border border-border-primary/50 focus-within:border-accent-blue/50">
                    <SearchIcon size={16} className="text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="bg-transparent border-none text-sm w-full focus:outline-none text-text-primary"
                    />
                </div>
            </div>


            {/* Mobile Bottom Navigation Gear */}
            <div className="hidden lg:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-primary z-[70] px-3 py-2 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
                {navItems.map((item) => {
                    if (item.name === 'Practice') {
                        return (
                            <div key={item.name} className="relative" ref={mobilePracticeRef}>
                                <button
                                    onClick={() => setIsPracticeOpen(!isPracticeOpen)}
                                    className={`flex flex-col items-center gap-1 transition-all ${location.pathname.startsWith('/interview') || isPracticeOpen ? 'text-accent-blue scale-110' : 'text-text-secondary hover:text-white'}`}
                                >
                                    <item.icon size={20} strokeWidth={location.pathname.startsWith('/interview') || isPracticeOpen ? 2.5 : 2} />
                                    <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
                                </button>

                                {isPracticeOpen && (
                                    <div className="absolute bottom-[calc(100%+20px)] left-1/2 -translate-x-1/2 w-64 bg-bg-secondary/95 backdrop-blur-xl border border-border-primary rounded-2xl shadow-2xl p-2 z-[1050] animate-in slide-in-from-bottom-4 duration-300">
                                        <div className="px-3 py-2 border-b border-border-primary mb-2">
                                            <span className="text-[10px] font-black uppercase text-accent-blue tracking-widest">Practice Modes</span>
                                        </div>
                                        <Link
                                            to="/interview"
                                            onClick={() => setIsPracticeOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl active:bg-white/10 transition-all"
                                        >
                                            <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue">
                                                <Mic size={20} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="text-[13px] font-bold text-white">Interviews</div>
                                                <div className="text-[10px] text-text-secondary">AI Mock Sessions</div>
                                            </div>
                                            <ChevronRight size={14} className="text-text-secondary" />
                                        </Link>
                                        <Link
                                            to="/quizzes"
                                            onClick={() => setIsPracticeOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl active:bg-white/10 transition-all"
                                        >
                                            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                                                <Zap size={20} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="text-[13px] font-bold text-white">Quizzes</div>
                                                <div className="text-[10px] text-text-secondary">Topic-wise Tests</div>
                                            </div>
                                            <ChevronRight size={14} className="text-text-secondary" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 transition-all ${location.pathname === item.path ? 'text-accent-blue scale-110' : 'text-text-secondary hover:text-white'}`}
                        >
                            <div className="relative">
                                <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                                {item.name === 'Events' && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
