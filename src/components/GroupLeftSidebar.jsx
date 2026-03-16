import React, { useEffect } from 'react';
import {
    FileText,
    Users,
    MessageSquare,
    BookOpen,
    Trophy,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJoinedGroupsOfUser } from '../store/groupSlice';

const GroupLeftSidebar = ({ groupInfo, activeTab = "Feed" }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { joinedGroups } = useSelector((state) => state.group);

    useEffect(() => {
        if (joinedGroups.length === 0) {
            dispatch(getJoinedGroupsOfUser());
        }
    }, [dispatch, joinedGroups.length]);

    // Use current ID from URL, or default to first group if available
    // Extract the groupId (last segment after final dash) from URL param for comparison
    const activeGroupId = id ? id.split('-').pop() : null;

    return (
        <div className="flex flex-col gap-6">
            <div className="px-2 lg:mb-2 hidden lg:block">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Navigation</h4>
            </div>
            <div className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible no-scrollbar px-2">
                {[
                    { name: 'Feed', icon: FileText, path: `/groups/${id}` },
                    { name: 'Members', icon: Users, path: `/groups/${id}/members` },
                    { name: 'Discussion', icon: MessageSquare, path: `/groups/${id}/discussion` },
                    { name: 'Resources', icon: BookOpen, path: `/groups/${id}/resources` },
                    { name: 'Leaderboard', icon: Trophy, path: `/groups/${id}/leaderboard` },
                ].map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => navigate(tab.path)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group shrink-0 ${activeTab === tab.name
                            ? 'text-white font-bold bg-accent-blue/10 border border-accent-blue/20 shadow-sm'
                            : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <tab.icon size={16} className={`${activeTab === tab.name ? 'text-accent-blue' : 'group-hover:text-accent-blue transition-colors'}`} />
                        <span className="text-xs font-bold uppercase tracking-wider">{tab.name}</span>
                    </button>
                ))}
            </div>

            <div className="h-px bg-border-primary w-full hidden lg:block my-2"></div>

            {/* Your Joined Groups */}
            <div className="space-y-4 px-2 hidden lg:block">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Your Joined Groups</h4>
                <div className="space-y-2 mt-4">
                    {joinedGroups.map((group) => {
                        const isCurrentActive = activeGroupId === group.groupId;
                        const targetLink = `/groups/${group.name.toLowerCase().replace(/\s+/g, '-')}-${group.groupId}`;

                        return (
                            <div
                                key={group._id}
                                onClick={() => navigate(targetLink)}
                                title={group.name}
                                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all group ${isCurrentActive
                                    ? 'bg-bg-secondary border border-border-primary shadow-sm text-white'
                                    : 'hover:bg-bg-tertiary/50 text-text-secondary hover:text-white border border-transparent'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg overflow-hidden bg-accent-blue/20 flex items-center justify-center text-white font-black text-[10px] uppercase shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
                                    {group.logo ? (
                                        <img src={group.logo} alt={group.name} className="w-full h-full object-cover" />
                                    ) : (
                                        group.name.charAt(0)
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm tracking-tight truncate ${isCurrentActive ? 'font-bold text-white' : 'font-medium'}`}>
                                        {group.name}
                                    </span>
                                    <span className="flex items-center gap-1 justify-start text-[10px] font-bold text-text-secondary tabular-nums">
                                        <Users size={10} />
                                        {group.memberCount || group.members?.length || 0} members
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {joinedGroups.length === 0 && (
                        <p className="text-[10px] text-text-secondary italic px-2">No groups joined yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, badge, color = "text-text-secondary", onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-between px-4 lg:px-3 py-2 lg:py-2.5 rounded-xl transition-all group shrink-0 ${active ? 'bg-bg-secondary border border-border-primary shadow-sm text-white' : 'hover:bg-bg-tertiary/50 text-text-secondary hover:text-white border border-transparent'} lg:w-full`}
    >
        <div className="flex items-center gap-2.5 lg:gap-3">
            <div className={`${active ? 'text-accent-blue' : color} group-hover:scale-110 transition-transform shrink-0`}>
                {icon}
            </div>
            <span className={`text-xs lg:text-sm tracking-tight whitespace-nowrap ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </div>
        {badge && (
            <span className="bg-bg-secondary w-5 h-5 rounded-full hidden lg:flex items-center justify-center text-[10px] font-bold text-text-secondary shadow-inner border border-border-primary group-hover:bg-accent-blue group-hover:text-white transition-colors ml-2">
                {badge}
            </span>
        )}
    </button>
);

export default GroupLeftSidebar;
