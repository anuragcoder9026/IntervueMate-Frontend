import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import {
    Info,
    Calendar,
    Shield,
    Globe,
    Lock,
    Tag,
    Users,
    ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';

const GroupRightSidebar = () => {
    const navigate = useNavigate();
    const { currentGroup, groupAdmins, groupMembers } = useSelector((state) => state.group);

    const group = currentGroup;

    const handleAdminClick = (admin) => {
        if (admin?.userId) {
            const nameSlug = admin.name?.replace(/\s+/g, '').toLowerCase() || '';
            navigate(`/profile/${nameSlug}-${admin.userId}`);
        }
    };

    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const { onlineUsers } = useSocket() || {};
    const description = group?.description || 'No description available.';
    const shouldTruncate = description.length > 100;
    const displayDesc = shouldTruncate && !isDescExpanded ? description.slice(0, 100) + '...' : description;

    const getOnlineMembers = () => {
        if (!group || !onlineUsers) return { count: 0, profiles: [] };
        const onlineSet = new Set();
        const onlineProfiles = [];

        // Check admins (from getGroupMembers thunk)
        (groupAdmins || []).forEach(admin => {
            const id = (admin._id || admin).toString();
            if (onlineUsers.has(id)) {
                onlineSet.add(id);
                if (admin.avatar) {
                    onlineProfiles.push({
                        id,
                        name: admin.name,
                        avatar: admin.avatar,
                        user: admin // Store full object for click handler
                    });
                }
            }
        });

        // Check regular members (from getGroupMembers thunk)
        (groupMembers || []).forEach(member => {
            const id = (member._id || member).toString();
            if (onlineUsers.has(id) && !onlineSet.has(id)) {
                onlineSet.add(id);
                if (member.avatar) {
                    onlineProfiles.push({
                        id,
                        name: member.name,
                        avatar: member.avatar,
                        user: member // Store full object for click handler
                    });
                }
            }
        });

        return {
            count: onlineSet.size,
            profiles: onlineProfiles.slice(0, 6) // Show first 6 online users
        };
    };

    const { count: onlineCount, profiles: onlineProfiles } = getOnlineMembers();

    return (
        <div className="space-y-6">
            {/* About Group Card */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-text-primary text-sm">About Group</h4>
                    <Info size={16} className="text-text-secondary cursor-help" />
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-1">
                    {displayDesc}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="text-xs font-bold text-accent-blue hover:text-white transition-colors mb-5"
                    >
                        {isDescExpanded ? 'See less' : 'See more'}
                    </button>
                )}
                {!shouldTruncate && <div className="mb-5" />}

                <div className="space-y-4">


                    {/* Category */}
                    {group?.category && (
                        <div className="flex gap-3">
                            <Tag size={16} className="text-purple-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-1">Category</p>
                                <p className="text-xs font-medium text-text-primary capitalize">{group.category}</p>
                            </div>
                        </div>
                    )}

                    {/* Created */}
                    <div className="flex gap-3">
                        <Calendar size={16} className="text-text-secondary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-1">Created</p>
                            <p className="text-xs font-medium text-text-primary">
                                {group?.createdAt ? format(new Date(group.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                            </p>
                        </div>
                    </div>

                    {/* Website */}
                    {group?.website && (
                        <div className="flex gap-3">
                            <ExternalLink size={16} className="text-accent-blue shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-1">Website</p>
                                <a
                                    href={group.website.startsWith('http') ? group.website : `https://${group.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-accent-blue hover:text-white transition-colors truncate block max-w-[200px]"
                                >
                                    {group.website}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Admins */}
                    <div className="flex gap-3">
                        <Shield size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-2">Admins</p>
                            <div className="space-y-2">
                                {group?.admins && group.admins.length > 0 ? (
                                    group.admins.map((admin) => {
                                        const adminName = admin?.name || 'Admin';
                                        const adminAvatar = admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=fb923c&color=fff`;
                                        return (
                                            <div
                                                key={admin._id || admin}
                                                onClick={() => handleAdminClick(admin)}
                                                className="flex items-center gap-2.5 cursor-pointer group/admin hover:bg-white/5 -mx-1.5 px-1.5 py-1 rounded-lg transition-all"
                                            >
                                                <img
                                                    src={adminAvatar}
                                                    className="w-6 h-6 rounded-full object-cover border border-amber-500/30"
                                                    alt={adminName}
                                                />
                                                <span className="text-xs font-medium text-text-primary group-hover/admin:text-accent-blue transition-colors truncate">
                                                    {adminName}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <span className="text-xs text-text-secondary italic">No admins</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {group?.tags && group.tags.length > 0 && (
                        <div className="pt-2 border-t border-border-primary/50">
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1.5">
                                {group.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 bg-accent-blue/10 text-accent-blue text-[10px] font-bold rounded-lg border border-accent-blue/20"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Upcoming</h4>
                    <button className="text-xs font-black uppercase text-accent-blue tracking-widest hover:text-white transition-colors">View All</button>
                </div>

                <div className="space-y-4 mt-2">
                    <div className="flex gap-4 items-center cursor-pointer group">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] font-black text-rose-500 tracking-widest uppercase">Oct</span>
                            <span className="text-lg font-black text-white">28</span>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-white group-hover:text-accent-blue transition-colors">Resume Review Workshop</h5>
                            <p className="text-[10px] text-text-secondary mt-0.5">Mon • 6:00 PM</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center cursor-pointer group">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] font-black text-rose-500 tracking-widest uppercase">Nov</span>
                            <span className="text-lg font-black text-white">02</span>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-white group-hover:text-accent-blue transition-colors">Google Kickstart Prep</h5>
                            <p className="text-[10px] text-text-secondary mt-0.5">Fri • 8:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Online Members */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm border-t-4 border-t-emerald-500/80 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm flex items-center gap-2">Online Members</h4>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>

                <div className="flex items-center gap-2">
                    {onlineProfiles.map((profile, i) => (
                        <div
                            key={profile.id}
                            title={profile.name}
                            onClick={() => handleAdminClick(profile.user)}
                            className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center border-2 border-emerald-500 relative overflow-hidden group cursor-pointer transition-transform hover:scale-110 active:scale-95 z-[5]"
                        >
                            <img
                                src={profile.avatar}
                                className="w-full h-full object-cover"
                                alt={profile.name}
                            />
                        </div>
                    ))}

                    {onlineCount > onlineProfiles.length && (
                        <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-primary text-[10px] font-bold text-text-secondary cursor-pointer hover:bg-bg-primary hover:text-white transition-colors">
                            +{onlineCount - onlineProfiles.length}
                        </div>
                    )}

                    {onlineCount === 0 && (
                        <p className="text-[10px] text-text-secondary italic">No members online</p>
                    )}
                </div>
            </div>

            {/* Footer Links */}
            <div className="px-2">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-text-secondary mb-3">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Advertising</a>
                    <a href="#" className="hover:text-white transition-colors">Cookies</a>
                </div>
                <p className="text-[10px] text-text-secondary/50">© 2025 Interview_Mate</p>
            </div>
        </div>
    );
};

export default GroupRightSidebar;
