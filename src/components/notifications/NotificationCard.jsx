import React from 'react';
import { Settings, Reply, UserPlus, Users, MessageSquare, Trophy, Bot, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationCard = ({ data }) => {

    const renderIcon = () => {
        switch (data.type) {
            case 'social_grouped':
                return (
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center overflow-hidden border-2 border-[#171c28]">
                            <Users size={18} className="text-[#64748B]" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2563EB] border-[2px] border-[#171c28] flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                            +{data.additionalUsersCount}
                        </div>
                    </div>
                );
            case 'social_single':
                return (
                    <div className="relative shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                            <img src={data.userAvatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${data.userName}`} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                );
            case 'message':
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center shrink-0 border border-[#2563EB]/20 text-[#3b82f6]">
                        <MessageSquare size={18} />
                    </div>
                );
            case 'achievement':
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#d97706]/10 flex items-center justify-center shrink-0 border border-[#d97706]/20 text-[#f59e0b]">
                        <Trophy size={18} />
                    </div>
                );
            case 'ai_feedback':
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#9333ea]/10 flex items-center justify-center shrink-0 border border-[#9333ea]/20 text-[#c084fc]">
                        <Bot size={18} />
                    </div>
                );
            case 'group_invite':
                return (
                    <div className="relative shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                            <img src={data.userAvatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${data.userName}`} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-md bg-[#10b981] border-[2px] border-[#171c28] flex items-center justify-center text-[10px] text-white shadow-sm">
                            <Users size={10} />
                        </div>
                    </div>
                );
            case 'reminder':
                return (
                    <div className="w-10 h-10 rounded-xl bg-[#4f46e5]/10 flex items-center justify-center shrink-0 border border-[#4f46e5]/20 text-[#818cf8]">
                        <Calendar size={18} />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderContent = () => {
        return (
            <div className="flex-1 min-w-0 pr-12 sm:pr-24">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                    <h4 className="text-[13px] font-bold text-white tracking-tight">{data.title}</h4>
                    {data.roleText && <span className="text-xs text-[#a3aed0] truncate shrink-0">• {data.roleText}</span>}
                    {data.badge && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{data.badge}</span>}
                </div>

                {data.message && (
                    <p className="text-[13px] text-[#a3aed0] leading-relaxed mt-1">
                        {data.message}
                    </p>
                )}

                {renderActions()}
            </div>
        );
    };

    const renderActions = () => {
        if (data.type === 'social_grouped') {
            return (
                <div className="mt-3">
                    <button className="bg-accent-blue hover:bg-accent-blue-hover text-white text-[12px] font-bold px-4 py-1.5 rounded-lg transition-colors">
                        View All
                    </button>
                </div>
            )
        }
        if (data.type === 'social_single') {
            return (
                <div className="flex items-center gap-2 mt-3">
                    <button className="bg-accent-blue hover:bg-accent-blue-hover text-white text-[12px] font-bold px-5 py-1.5 rounded-lg transition-colors shadow-lg shadow-accent-blue/20">
                        Accept
                    </button>
                    <button className="bg-[#1C2436] border border-white/5 hover:border-white/20 text-[#a3aed0] hover:text-white text-[12px] font-bold px-5 py-1.5 rounded-lg transition-colors">
                        Decline
                    </button>
                </div>
            )
        }
        if (data.type === 'message') {
            return (
                <div className="mt-3 flex items-center">
                    <button className="flex items-center gap-1.5 text-accent-blue hover:text-[#60a5fa] text-[12px] font-bold transition-colors">
                        <span>Reply</span>
                        <Reply size={14} className="rotate-180" />
                    </button>
                </div>
            )
        }
        if (data.type === 'ai_feedback') {
            return (
                <div className="mt-3 flex items-center">
                    <button className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-[12px] font-bold transition-colors">
                        <span>View Full Report</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            )
        }
        if (data.type === 'group_invite') {
            return (
                <div className="flex items-center gap-2 mt-3">
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-[#022c22] text-[12px] font-bold px-5 py-1.5 rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
                        Accept
                    </button>
                    <button className="bg-[#1C2436] border border-white/5 hover:border-white/20 text-[#a3aed0] hover:text-white text-[12px] font-bold px-5 py-1.5 rounded-lg transition-colors">
                        Decline
                    </button>
                </div>
            )
        }
        return null;
    };

    return (
        <div className={`group relative bg-[#171c28] hover:bg-[#1C2436] border transition-all rounded-2xl p-4 sm:p-5 flex items-start gap-4 w-full mb-3 cursor-pointer ${data.isUnread ? 'border-white/10 shadow-[0_0_20px_rgba(37,99,235,0.05)]' : 'border-white/5 shadow-sm'}`}>
            {renderIcon()}
            {renderContent()}

            <div className="absolute right-4 top-4 sm:top-5 flex items-center gap-3">
                {data.isUnread && <div className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />}
                <span className="text-[11px] text-[#64748b] font-medium hidden sm:block">{data.time}</span>
                <button className="text-[#64748b] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <Settings size={14} />
                </button>
            </div>
        </div>
    );
};

export default NotificationCard;
