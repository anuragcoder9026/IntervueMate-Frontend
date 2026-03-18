import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotificationSidebar from '../components/notifications/NotificationSidebar';
import NotificationCard from '../components/notifications/NotificationCard';
import { Check, ChevronDown, BellOff } from 'lucide-react';
import { fetchNotifications, markAllNotificationsRead } from '../store/notificationSlice';

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const { notifications, loading, error } = useSelector((state) => state.notifications);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        // Fetch notifications based on active filter
        const category = activeFilter === 'all' ? null : activeFilter;
        dispatch(fetchNotifications(category));
    }, [dispatch, activeFilter]);

    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsRead());
    };

    const isToday = (date) => {
        const d = new Date(date);
        const now = new Date();
        return d.getDate() === now.getDate() &&
               d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear();
    };

    const todayItems = notifications.filter(n => isToday(n.createdAt));
    const earlierItems = notifications.filter(n => !isToday(n.createdAt));

    return (
        <div className="min-h-screen bg-[#0A0F1A] text-text-primary font-inter">
            <Navbar />

            <main className="max-w-[1240px] mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">

                {/* Left Sidebar Filters */}
                <aside className="w-full lg:w-[260px] shrink-0 sticky top-[64px] lg:top-[88px] z-40">
                    <NotificationSidebar 
                        activeFilter={activeFilter} 
                        onFilterChange={setActiveFilter} 
                    />
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 w-full mb-12 border border-white/5 rounded-2xl bg-[#0F1523] p-6 px-4 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Notifications</h1>
                            <p className="text-[#a3aed0] text-sm italic">
                                {activeFilter === 'all' ? 'All Activity' : 
                                 activeFilter === 'social' ? 'Social Connections' :
                                 activeFilter === 'groups' ? 'Group Activities' : 'Event Updates'}
                            </p>
                        </div>
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-1.5 text-accent-blue hover:text-white transition-colors text-[13px] font-bold pb-1 sm:pb-0"
                        >
                            <Check size={16} strokeWidth={2.5} />
                            <span>Mark all as read</span>
                        </button>
                    </div>

                    {loading && notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <div className="w-12 h-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin mb-4" />
                            <p className="text-[#a3aed0] font-bold">Fetching updates...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#64748b] mb-4">
                                <BellOff size={32} />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">No notifications yet</h3>
                            <p className="text-[#64748b] text-sm text-center max-w-[280px]">
                                When people interact with you or your groups, we'll let you know here.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* TODAY Section */}
                            {todayItems.length > 0 && (
                                <div className="mb-10">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-[#64748b] mb-4 block pl-2">TODAY</span>
                                    <div className="flex flex-col gap-0 text-white">
                                        {todayItems.map(item => <NotificationCard key={item._id} data={item} />)}
                                    </div>
                                </div>
                            )}

                            {/* EARLIER Section */}
                            {earlierItems.length > 0 && (
                                <div className="mb-8">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-[#64748b] mb-4 block pl-2">EARLIER</span>
                                    <div className="flex flex-col gap-0 text-white">
                                        {earlierItems.map(item => <NotificationCard key={item._id} data={item} />)}
                                    </div>
                                </div>
                            )}

                            {/* Load More (Visual only for now) */}
                            {notifications.length >= 20 && (
                                <div className="flex justify-center mt-8">
                                    <button className="text-[13px] font-bold text-[#64748b] hover:text-white transition-colors flex items-center gap-2 p-2 rounded-xl group">
                                        <span>Load older notifications</span>
                                        <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default NotificationsPage;
