import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotificationSidebar from '../components/notifications/NotificationSidebar';
import NotificationCard from '../components/notifications/NotificationCard';
import { Check, ChevronDown } from 'lucide-react';

const NotificationsPage = () => {
    // Mock Data mimicking the image exactly
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'social_grouped',
            isUnread: true,
            title: 'Connection Requests',
            message: <><strong className="text-white font-semibold">Alex Morgan</strong> and 2 others want to connect with you.</>,
            time: '10m ago',
            additionalUsersCount: 2,
            section: 'TODAY'
        },
        {
            id: 2,
            type: 'social_single',
            isUnread: true,
            title: 'Felix Johnson',
            roleText: 'Software Engineer at TechCorp',
            userName: 'Felix',
            message: 'Sent you a connection request. "Hi, I saw your recent project on System Design and would love to connect!"',
            time: '25m ago',
            section: 'TODAY',
            userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f97316'
        },
        {
            id: 3,
            type: 'message',
            isUnread: false,
            title: 'New Message from Sarah',
            message: '"Hey! Are we still on for the mock interview prep tonight at 8 PM?"',
            time: '42m ago',
            section: 'TODAY'
        },
        {
            id: 4,
            type: 'achievement',
            isUnread: false,
            title: 'New Rank Achieved!',
            message: <>Congratulations! You are now in the top <strong className="text-orange-500">5%</strong> at <strong className="text-white">NIT Jalandhar</strong>.</>,
            time: '2h ago',
            section: 'TODAY'
        },
        {
            id: 5,
            type: 'ai_feedback',
            isUnread: false,
            title: 'AI Interview Feedback Ready',
            message: <>Your mock interview analysis for '<strong className="text-white">System Design - Scalability</strong>' is complete. 3 key improvements found.</>,
            time: '3h ago',
            section: 'TODAY'
        },
        {
            id: 6,
            type: 'group_invite',
            isUnread: false,
            title: 'Invite: "FAANG Prep 2024"',
            badge: 'Group',
            userName: 'Sarah',
            message: <><strong className="text-white font-semibold">Sarah Jenkins</strong> invited you. "We're focusing on DP this week."</>,
            time: '1d ago',
            section: 'EARLIER',
            userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=10b981'
        },
        {
            id: 7,
            type: 'reminder',
            isUnread: false,
            title: 'Reminder: Mock Interview',
            message: 'Scheduled mock interview for "Frontend Architecture" at 10:00 AM.',
            time: '1d ago',
            section: 'EARLIER'
        }
    ]);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    };

    const todayItems = notifications.filter(n => n.section === 'TODAY');
    const earlierItems = notifications.filter(n => n.section === 'EARLIER');

    return (
        <div className="min-h-screen bg-[#0A0F1A] text-text-primary font-inter">
            <Navbar />

            <main className="max-w-[1240px] mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">

                {/* Left Sidebar Filters */}
                <aside className="w-full lg:w-[260px] shrink-0 sticky top-[64px] lg:top-[88px] z-40">
                    <NotificationSidebar />
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 w-full mb-12 border border-white/5 rounded-2xl bg-[#0F1523] p-6 px-4 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Notifications</h1>
                            <p className="text-[#a3aed0] text-sm">Stay updated with your interview progress and network activity</p>
                        </div>
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-1.5 text-accent-blue hover:text-white transition-colors text-[13px] font-bold pb-1 sm:pb-0"
                        >
                            <Check size={16} strokeWidth={2.5} />
                            <span>Mark all as read</span>
                        </button>
                    </div>

                    {/* TODAY Section */}
                    {todayItems.length > 0 && (
                        <div className="mb-10">
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#64748b] mb-4 block pl-2">TODAY</span>
                            <div className="flex flex-col gap-0">
                                {todayItems.map(item => <NotificationCard key={item.id} data={item} />)}
                            </div>
                        </div>
                    )}

                    {/* EARLIER Section */}
                    {earlierItems.length > 0 && (
                        <div className="mb-8">
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#64748b] mb-4 block pl-2">EARLIER</span>
                            <div className="flex flex-col gap-0">
                                {earlierItems.map(item => <NotificationCard key={item.id} data={item} />)}
                            </div>
                        </div>
                    )}

                    {/* Load More */}
                    <div className="flex justify-center mt-8">
                        <button className="text-[13px] font-bold text-[#64748b] hover:text-white transition-colors flex items-center gap-2 p-2 rounded-xl group">
                            <span>Load older notifications</span>
                            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default NotificationsPage;
