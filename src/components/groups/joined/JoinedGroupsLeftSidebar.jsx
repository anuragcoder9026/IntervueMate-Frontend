import React from 'react';
import { Users, Compass, PlusCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const JoinedGroupsLeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { joinedGroups } = useSelector((state) => state.group);

    return (
        <div className="w-full lg:w-64 space-y-6 shrink-0 lg:sticky top-24 h-fit">
            {/* User Summary Card */}
            <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 shadow-sm flex flex-col items-center">
                <div className="relative mb-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/profile')}>
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=fb923c&color=fff`}
                        className="w-20 h-20 rounded-full border-4 border-bg-secondary shadow-xl object-cover"
                        alt="Profile"
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-bg-secondary rounded-full shadow-sm"></div>
                </div>
                <h3 className="font-bold text-text-primary text-lg text-center truncate w-full px-2" title={user?.name}>{user?.name || 'User'}</h3>
                <p className="text-xs text-text-secondary mt-1 text-center font-medium opacity-80 truncate w-full px-2" title={user?.headline}>{user?.headline || 'Member'}</p>

                <div className="grid grid-cols-2 w-full gap-4 mt-8 pt-6 border-t border-border-primary/50">
                    <div className="text-center">
                        <div className="text-lg font-bold text-white tracking-tight">{joinedGroups.length}</div>
                        <div className="text-[9px] uppercase font-black text-text-secondary tracking-widest leading-tight">Groups</div>
                    </div>
                    <div className="text-center border-l border-border-primary/50">
                        <div className="text-lg font-bold text-white tracking-tight">{user?.followers?.length || 0}</div>
                        <div className="text-[9px] uppercase font-black text-text-secondary tracking-widest leading-tight">Followers</div>
                    </div>
                </div>
            </div>

            {/* Navigation Sidebar */}
            <div className="bg-bg-secondary border border-border-primary rounded-3xl p-3 shadow-sm space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-accent-blue/10 text-accent-blue font-bold text-sm transition-all group">
                    <Users size={18} />
                    <span>My Groups</span>
                </button>
                <button
                    onClick={() => navigate('/groups')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-text-secondary hover:text-white hover:bg-bg-tertiary transition-all text-sm font-semibold group"
                >
                    <Compass size={18} />
                    <span>Discover Groups</span>
                </button>
                <button onClick={() => navigate('/create-group')} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-text-secondary hover:text-white hover:bg-bg-tertiary transition-all text-sm font-semibold group">
                    <PlusCircle size={18} />
                    <span>Create Group</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-text-secondary hover:text-white hover:bg-bg-tertiary transition-all text-sm font-semibold group">
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );
};

export default JoinedGroupsLeftSidebar;
