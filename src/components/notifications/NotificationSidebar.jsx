import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Bell, 
    Users, 
    Calendar, 
    Layers, 
    Settings, 
    Search,
    CheckCircle2,
    SlidersHorizontal
} from 'lucide-react';
import { fetchNotifications, markAllNotificationsRead } from '../../store/notificationSlice';

const NotificationSidebar = ({ activeFilter = 'all', onFilterChange }) => {
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const categories = [
        { id: 'all', label: 'All Notifications', icon: Bell, count: unreadCount },
        { id: 'social', label: 'Social Activity', icon: Users, count: notifications.filter(n => n.category === 'social' && !n.isRead).length },
        { id: 'events', label: 'Events Activity', icon: Calendar, count: notifications.filter(n => (n.category === 'events' || n.relatedType === 'Event') && !n.isRead).length },
        { id: 'groups', label: 'Groups Activity', icon: Layers, count: notifications.filter(n => (n.category === 'groups' || n.groupId) && !n.isRead).length },
    ];

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead());
    };

    return (
        <div className="bg-[#171c28] lg:rounded-2xl border border-white/5 flex flex-col p-2 lg:p-4 w-full shadow-lg">
            <div className="hidden lg:flex items-center justify-between mb-4 px-2">
                <span className="text-[11px] font-black text-[#a3aed0] tracking-widest uppercase">Filters</span>
                <button 
                    onClick={handleMarkAllRead}
                    className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-[#a3aed0] hover:text-accent-blue"
                    title="Mark all as read"
                >
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-1 mb-0 lg:mb-8 pb-1 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeFilter === category.id;
                    const count = category.count;
                    
                    return (
                        <button
                            key={category.id}
                            onClick={() => onFilterChange(category.id)}
                            className={`flex items-center justify-between px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-xl transition-all border shrink-0 gap-3 lg:gap-0 ${
                                isActive 
                                ? 'bg-accent-blue/10 text-accent-blue font-bold border-accent-blue/10' 
                                : 'text-[#a3aed0] hover:text-white hover:bg-white/5 border-transparent font-semibold'
                            }`}
                        >
                            <div className="flex items-center gap-2 lg:gap-3">
                                <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isActive ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : ''
                                }`}>
                                    <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                </div>
                                <span className="whitespace-nowrap text-[11px] lg:text-[13px]">{category.label}</span>
                            </div>
                            {count > 0 && (
                                <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full text-[9px] lg:text-[10px] flex items-center justify-center font-black ${
                                    isActive ? 'bg-accent-blue text-white' : 'bg-white/5 text-[#a3aed0]'
                                }`}>
                                    {count > 99 ? '99+' : count}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

        </div>
    );
};

export default NotificationSidebar;
