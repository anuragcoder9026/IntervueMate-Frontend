import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../store/groupSlice';
import { Users, Globe, EyeOff, Plus } from 'lucide-react';

const GroupsTab = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { groups, isLoading } = useSelector((state) => state.group);
    const { user: authUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?._id) {
            dispatch(getGroups({ admin: user._id }));
        }
    }, [dispatch, user]);

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    };

    const handleGroupClick = (group) => {
        const slug = `${slugify(group.name)}-${group.groupId}`;
        const isAdmin = group.admins?.some(adminId =>
            adminId === authUser?._id || adminId === authUser?.id ||
            (typeof adminId === 'object' && adminId._id === authUser?._id)
        );
        if (isAdmin) {
            navigate(`/admin/groups/${slug}`);
        } else {
            navigate(`/groups/${slug}`);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 flex justify-center">
                <div className="w-8 h-8 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-white">Managed Communities</h2>
                <span className="px-2.5 py-1 bg-accent-blue/10 text-accent-blue text-[10px] font-black uppercase tracking-wider rounded-lg border border-accent-blue/20">
                    {groups.length} Groups
                </span>
            </div>

            {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.map((group) => (
                        <div
                            key={group._id}
                            onClick={() => handleGroupClick(group)}
                            className="flex items-center justify-between p-4 border border-border-primary rounded-xl bg-bg-primary group cursor-pointer hover:border-accent-blue/30 transition-all hover:bg-bg-tertiary shadow-sm"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-white/5 overflow-hidden shrink-0">
                                    {group.logo ? (
                                        <img src={group.logo} className="w-full h-full object-cover" alt={group.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-accent-blue text-white font-bold text-lg">
                                            {group.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors truncate">{group.name}</h3>
                                    <div className="flex items-center gap-3 text-[10px] text-text-secondary mt-1 font-medium">
                                        <div className="flex items-center gap-1">
                                            <Users size={10} />
                                            <span>{group.memberCount || group.members?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {group.privacy === 'private' ? <EyeOff size={10} /> : <Globe size={10} />}
                                            <span className="capitalize">{group.privacy}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-white">
                                <Plus size={16} className="rotate-45" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-2xl flex items-center justify-center text-text-secondary mb-4 border border-white/5">
                        <Users size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">No Communities Managed</h3>
                    <p className="text-xs text-text-secondary max-w-[200px] mb-6">
                        Start your own community and lead the next generation of professionals.
                    </p>
                    <button
                        onClick={() => navigate('/create-group')}
                        className="px-6 py-2.5 bg-accent-blue hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                    >
                        Launch Community
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroupsTab;
