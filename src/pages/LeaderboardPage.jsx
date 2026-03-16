import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Trophy,
    Medal,
    Crown,
    Star,
    MessageSquare,
    FileText,
    Users,
    Award,
    Flame,
    User,
    ChevronUp,
    ChevronDown,
    Zap,
    Shield,
    Target,
    HelpCircle,
    CheckCircle2,
    Calendar,
    Globe
} from 'lucide-react';
import { getGroup, getGroupMembers } from '../store/groupSlice';
import Navbar from '../components/Navbar';
import GroupLeftSidebar from '../components/GroupLeftSidebar';

const LeaderboardPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentGroup, isLoading: isGroupLoading } = useSelector((state) => state.group);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [timeFilter, setTimeFilter] = useState('Monthly'); // 'Monthly', 'All Time', 'Weekly'

    useEffect(() => {
        if (id) {
            dispatch(getGroup(id));
            dispatch(getGroupMembers(id));
        }
    }, [id, dispatch]);

    const groupInfo = currentGroup ? {
        name: currentGroup.name,
        description: currentGroup.description,
        privacy: currentGroup.privacy || 'public',
        members: (currentGroup.memberCount || currentGroup.members?.length || 0) >= 1000 ? ((currentGroup.memberCount || currentGroup.members?.length || 0) / 1000).toFixed(1) + 'k' : (currentGroup.memberCount || currentGroup.members?.length || 0),
        online: 0, // Placeholder
        coverImage: currentGroup.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
        logo: currentGroup.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentGroup.name)}&background=047857&color=fff`
    } : null;

    // Mock Leaderboard Data based on the image
    const leaderboardData = [
        {
            rank: 1,
            name: "Marco Silva",
            karma: "12,840",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            badges: ["Resource King", "Problem Solver"],
            isTop: true
        },
        {
            rank: 2,
            name: "Elena Rodriguez",
            karma: "9,120",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            badges: ["Helpful Mentor", "Content Creator"],
            isTop: true
        },
        {
            rank: 3,
            name: "Jordan Lee",
            karma: "8,455",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            badges: ["Question Slayer", "Top Commenter"],
            isTop: true
        },
        {
            rank: 4,
            name: "Alex Thompson",
            karma: "7,240",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            badge: "RESOURCE KING"
        },
        {
            rank: 5,
            name: "Mina Wu",
            karma: "6,815",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            badge: "MOCK MASTER"
        },
        {
            rank: 6,
            name: "Chris Evans",
            karma: "6,400",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            badge: "SUPER REVIEWER"
        },
        {
            rank: 7,
            name: "Priya Sharma",
            karma: "5,920",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            badge: "PROBLEM SOLVER"
        },
        {
            rank: 8,
            name: "Leo Dupont",
            karma: "5,100",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            badge: "CONSISTENT HELPER"
        }
    ];

    const monthlyMVP = {
        name: "Sarah Jenkins",
        karma: "2,450",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        labels: ["Top Contributor", "Mock Mentor"]
    };

    const karmaPoints = [
        { label: "Helpful Comment", points: "+50 pts", color: "text-blue-400", desc: "Provide high-quality answers on study threads." },
        { label: "Share Resource", points: "+200 pts", color: "text-blue-500", desc: "Upload high-value cheat sheets or guides." },
        { label: "Mock Interview", points: "+150 pts", color: "text-blue-400", desc: "Conduct a peer interview for another member." },
        { label: "Verified Answer", points: "+100 pts", color: "text-blue-500", desc: "When your solution is marked as correct." }
    ];

    const top3 = [leaderboardData[1], leaderboardData[0], leaderboardData[2]]; // Elena, Marco, Jordan

    if (isGroupLoading) {
        return (
            <div className="bg-bg-primary min-h-screen text-text-primary flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-text-secondary font-medium tracking-wide">Loading rankings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary overflow-hidden font-inter">
            <Navbar isGroupMode={true} groupName={groupInfo?.name} groupId={id} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8 items-start h-full">

                    {/* Left Sidebar */}
                    <div className="w-full lg:w-64 lg:h-full lg:overflow-y-auto no-scrollbar shrink-0 z-20 pb-4 lg:pb-8 space-y-6">
                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4 shadow-sm">
                            <h3 className="text-lg font-bold text-white mb-1">{groupInfo?.name || "Interview Group"}</h3>
                            <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                                <Users size={12} />
                                <span>{groupInfo?.members} Active Members</span>
                            </div>
                            <button className="w-full py-2.5 bg-accent-blue hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-accent-blue/20 active:scale-95">
                                Join Current Challenge
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-[#1E2436] to-[#0A0F1A] border border-accent-blue/20 rounded-2xl p-5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                <Medal size={48} className="text-accent-blue" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue mb-4">Monthly MVP</h4>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                    <img src={monthlyMVP.avatar} className="w-12 h-12 rounded-full border-2 border-accent-blue p-0.5" alt="MVP" />
                                    <div className="absolute -bottom-1 -right-1 bg-accent-blue rounded-full p-1 text-white">
                                        <Zap size={8} fill="currentColor" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm text-white">{monthlyMVP.name}</h5>
                                    <p className="text-[10px] text-text-secondary font-bold tracking-wider">{monthlyMVP.karma} Karma Earned</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {monthlyMVP.labels.map(label => (
                                    <span key={label} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black uppercase text-accent-blue tracking-tighter">
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Pending Challenges</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                        <Target size={14} />
                                    </div>
                                    <div>
                                        <h5 className="text-[11px] font-bold text-white leading-tight">Algorithmic Blitz</h5>
                                        <p className="text-[9px] text-text-secondary">2 days remaining</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <Shield size={14} />
                                    </div>
                                    <div>
                                        <h5 className="text-[11px] font-bold text-white leading-tight">Resume Review Fair</h5>
                                        <p className="text-[9px] text-text-secondary">Starts in 4h</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full space-y-10 lg:h-full lg:overflow-y-auto no-scrollbar pr-2 pb-1">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 flex items-center gap-4">
                                    Contribution Leaderboard
                                    <Trophy size={40} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse" />
                                </h1>
                                <p className="text-text-secondary text-sm md:text-base font-medium max-w-xl leading-relaxed">
                                    Rewarding the community champions who make <span className="text-white font-bold">Interview_Mate</span> a better place through knowledge sharing and support.
                                </p>
                            </div>
                            <div className="flex p-1 bg-bg-secondary border border-border-primary rounded-2xl shrink-0">
                                {['Weekly', 'Monthly', 'All Time'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setTimeFilter(filter)}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === filter ? 'bg-accent-blue text-white shadow-xl shadow-accent-blue/20' : 'text-text-secondary hover:text-white'}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top 3 Podium */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-2">
                            {top3.map((player, idx) => {
                                const isFirst = player.rank === 1;
                                return (
                                    <div
                                        key={player.rank}
                                        className={`relative group ${isFirst ? 'md:order-2 order-1' : idx === 0 ? 'md:order-1 order-2' : 'md:order-3 order-3'}`}
                                    >
                                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold text-white tracking-widest uppercase z-10 transition-all shadow-lg ${isFirst ? 'bg-accent-blue ring-4 ring-bg-primary group-hover:scale-110' : 'bg-bg-tertiary group-hover:bg-accent-blue/80'}`}>
                                            Rank {player.rank}
                                        </div>

                                        <div className={`flex flex-col items-center bg-bg-secondary border border-border-primary rounded-[32px] p-8 transition-all hover:-translate-y-2 hover:shadow-2xl ${isFirst ? 'border-accent-blue/40 shadow-xl shadow-accent-blue/5 md:py-12' : 'hover:border-accent-blue/20'}`}>
                                            <div className="relative mb-6">
                                                <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse ${isFirst ? 'bg-accent-blue' : 'bg-white/10'}`} />
                                                <img
                                                    src={player.avatar}
                                                    className={`relative z-10 rounded-full object-cover border-4 ring-4 ring-bg-secondary shrink-0 ${isFirst ? 'w-28 h-28 border-accent-blue' : 'w-20 h-20 border-white/5'}`}
                                                    alt={player.name}
                                                />
                                                {isFirst && (
                                                    <div className="absolute -top-3 -right-3 bg-amber-400 rounded-full p-2.5 text-bg-primary shadow-xl z-20 animate-bounce">
                                                        <Crown size={18} fill="currentColor" />
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className={`text-center font-black tracking-tight mb-1 ${isFirst ? 'text-2xl text-white' : 'text-xl text-white/90'}`}>{player.name}</h3>
                                            <div className="flex items-center gap-1.5 mb-6">
                                                <Zap size={14} className="text-accent-blue" fill="currentColor" />
                                                <span className="text-lg font-black text-accent-blue tabular-nums">{player.karma}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">Karma</span>
                                            </div>

                                            <div className="w-full space-y-2">
                                                {player.badges.map((badge, bIdx) => (
                                                    <div key={badge} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-bg-primary/50 border border-white/5 transition-colors group-hover:border-accent-blue/10`}>
                                                        <div className={`${bIdx === 0 ? 'text-amber-400' : 'text-accent-blue'} transition-transform group-hover:rotate-12`}>
                                                            {bIdx === 0 ? <Medal size={16} /> : <Zap size={16} />}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/80">{badge}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* How to earn Karma Section */}
                        <div className="bg-[#0D121F] border border-border-primary rounded-[32px] overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap size={120} className="text-accent-blue" />
                            </div>
                            <div className="p-8 md:p-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-accent-blue rounded-2xl flex items-center justify-center text-white shadow-xl shadow-accent-blue/20">
                                        <HelpCircle size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white tracking-tight">How to earn Karma?</h2>
                                        <p className="text-xs text-text-secondary font-bold uppercase tracking-widest opacity-60">Boost your standing in the community</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {karmaPoints.map((item, idx) => (
                                        <div key={idx} className="space-y-3 relative group/card">
                                            <span className={`text-2xl font-black ${item.color} tabular-nums group-hover/card:scale-110 transition-transform inline-block`}>{item.points}</span>
                                            <h4 className="text-sm font-bold text-white tracking-tight">{item.label}</h4>
                                            <p className="text-xs text-text-secondary leading-relaxed font-medium opacity-60">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Member Rankings List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-border-primary/50 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-1 h-8 bg-accent-blue rounded-full"></div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Member Rankings</h2>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">Monthly Snapshot</span>
                            </div>

                            <div className="divide-y divide-border-primary/20 bg-bg-secondary border border-border-primary rounded-[32px] overflow-hidden">
                                {leaderboardData.filter(u => u.rank > 3).map((player) => (
                                    <div
                                        key={player.rank}
                                        className="flex items-center justify-between p-6 md:px-8 group hover:bg-white/[0.02] transition-all"
                                    >
                                        <div className="flex items-center gap-6 md:gap-10">
                                            <span className="text-xl md:text-2xl font-black text-text-secondary w-8 tabular-nums opacity-40 group-hover:text-white transition-colors">{player.rank}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={player.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-accent-blue/30 transition-all" alt={player.name} />
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-bg-secondary"></div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-sm md:text-base font-black text-white group-hover:text-accent-blue transition-colors line-clamp-1">{player.name}</h4>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded ml-0 mt-1 inline-block w-fit">
                                                        {player.badge}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-xl font-black text-white tabular-nums tracking-tight">{player.karma}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">Karma</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-6 text-center text-accent-blue text-[11px] font-black uppercase tracking-[0.3em] hover:text-white transition-all group flex items-center justify-center gap-3">
                                View More Members
                                <ChevronDown size={14} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
