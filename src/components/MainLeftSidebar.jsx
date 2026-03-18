import { useSelector } from 'react-redux';
import {
    Layout,
    Users,
    Calendar,
    Mic,
    Bookmark,
    Settings,
    ChevronRight,
    Briefcase,
    UserPlus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLeftSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="flex flex-col gap-6">
            {/* User Quick Profile - Hidden on mobile */}
            <div
                onClick={() => navigate('/profile')}
                className="bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-sm group hidden lg:block cursor-pointer hover:border-accent-blue/30 transition-all"
            >
                {user?.banner ? <img src={user.banner} alt="Banner" className="w-full h-20 object-cover" /> : <div className="h-20 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                </div>}
                <div className="px-5 pb-5 flex flex-col items-center">
                    <div className="relative -mt-10 mb-4">
                        <div className="w-20 h-20 rounded-full border-4 border-bg-secondary shadow-2xl transition-transform group-hover:scale-105 bg-bg-tertiary flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img
                                    src={user?.avatar}
                                    className="w-full h-full object-cover"
                                    alt="Profile"
                                />
                            ) : (
                                <span className="text-white font-bold text-2xl">{user?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-bg-secondary rounded-full"></div>
                    </div>
                    <h3 className="font-bold text-text-primary text-xl tracking-tight text-center">{user?.name || 'User'}</h3>
                    <p className="text-sm text-text-secondary mt-1 text-center font-medium capitalize">{user?.headline || 'User'}</p>

                    <div className="w-full h-px bg-border-primary/50 my-5"></div>

                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-text-secondary font-medium">Profile Views</span>
                            <span className="text-accent-blue font-bold">{user?.profileViews || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-text-secondary font-medium">Post Impressions</span>
                            <span className="text-accent-blue font-bold">{user?.totalPostLikes || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats / Quick Links - Horizontal on Mobile */}
            <div className="flex lg:flex-col lg:bg-bg-secondary lg:border lg:border-border-primary lg:rounded-2xl lg:p-4 lg:shadow-sm lg:divide-y lg:divide-border-primary/30 overflow-x-auto no-scrollbar gap-2 pb-2 lg:pb-0">
                <div className="flex lg:flex-col gap-1 pb-0 lg:pb-3 shrink-0">
                    <NavItem icon={<Layout size={18} />} label="Prep Dashboard" active={location.pathname === '/dashboard' || location.pathname === '/feed'} onClick={() => navigate('/feed')} />
                    <NavItem icon={<Users size={18} />} label="Joined Groups" active={location.pathname === '/joined-groups'} onClick={() => navigate('/joined-groups')} />
                    <NavItem icon={<Calendar size={18} />} label="Events" active={location.pathname === '/events'} onClick={() => navigate('/events#events-mode')} />
                    <NavItem icon={<Mic size={18} />} label="Mock Interviews" active={location.pathname === '/interview'} onClick={() => navigate('/interview')} />
                    <NavItem
                        icon={<UserPlus size={18} />}
                        label="Friends"
                        active={location.pathname === '/friends'}
                        onClick={() => navigate('/friends')}
                    />
                </div>
                <div className="flex lg:flex-col gap-1 pt-0 lg:pt-3 shrink-0 mb-4">
                    <NavItem 
                        icon={<Bookmark size={18} className="text-yellow-500" />} 
                        label="Saved Items" 
                        active={location.pathname === '/saved'}
                        onClick={() => navigate('/saved')}
                    />
                </div>
            </div>

            {/* Footer Info - Hidden on mobile */}
            <div className="px-4 py-2 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-text-secondary font-medium opacity-60 hidden lg:flex">
                <span className="hover:text-accent-blue cursor-pointer transition-colors">About</span>
                <span className="hover:text-accent-blue cursor-pointer transition-colors">Accessibility</span>
                <span className="hover:text-accent-blue cursor-pointer transition-colors">Help Center</span>
                <span className="hover:text-accent-blue cursor-pointer transition-colors">Privacy & Terms</span>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, badge, color = "text-text-secondary", onClick }) => (
    <button onClick={onClick} className={`w-fit lg:w-full flex items-center justify-between px-4 lg:px-2.5 py-2 lg:py-2.5 rounded-xl transition-all group shrink-0 ${active ? 'bg-bg-secondary lg:bg-bg-tertiary text-white border border-border-primary lg:border-white/5 shadow-sm' : 'hover:bg-bg-tertiary/50 text-text-secondary hover:text-white border border-transparent'}`}>
        <div className="flex items-center gap-3">
            <div className={`${active ? 'text-accent-blue' : color} group-hover:scale-110 transition-transform shrink-0`}>
                {icon}
            </div>
            <span className={`text-sm tracking-tight whitespace-nowrap ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </div>
        {badge ? (
            <span className="bg-accent-blue/10 text-accent-blue text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border border-accent-blue/20 ml-2">{badge}</span>
        ) : (
            <ChevronRight size={14} className={`opacity-0 lg:group-hover:opacity-40 transition-opacity hidden lg:block ${active ? 'opacity-20' : ''}`} />
        )}
    </button>
);

export default MainLeftSidebar;
