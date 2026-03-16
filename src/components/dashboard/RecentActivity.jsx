import React from 'react';
import { Video, CheckCircle2, Users, MessageSquare } from 'lucide-react';

const RecentActivity = () => {
    const activities = [
        {
            icon: <Video size={14} />,
            bg: 'bg-blue-500/10 text-blue-500',
            title: 'AI Mock: System Design L4',
            time: '2h ago'
        },
        {
            icon: <CheckCircle2 size={14} />,
            bg: 'bg-emerald-500/10 text-emerald-500',
            title: 'Solved: Valid Anagram',
            time: '5h ago'
        },
        {
            icon: <Users size={14} />,
            bg: 'bg-indigo-500/10 text-indigo-400',
            title: 'Connected: Alex Johnson',
            time: 'Yesterday'
        },
        {
            icon: <MessageSquare size={14} />,
            bg: 'bg-orange-500/10 text-orange-500',
            title: 'Commented on Sys Design ...',
            time: 'Yesterday'
        }
    ];

    return (
        <div className="bg-[#171c28] rounded-2xl p-6 sm:p-8 border border-white/5">
            <h2 className="text-[14px] font-black tracking-tight text-white mb-8">Recent Activity</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {activities.map((a, i) => (
                    <div key={i} className="flex gap-4 items-center group cursor-pointer">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.bg} transition-transform group-hover:scale-110`}>
                            {a.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white truncate transition-colors group-hover:text-accent-blue">{a.title}</h3>
                            <span className="text-[10px] text-[#a3aed0]">{a.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;
