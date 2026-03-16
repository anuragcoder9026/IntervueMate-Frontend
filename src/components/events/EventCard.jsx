import React from 'react';
import { Building2, Users, Bot, CircleUserRound } from 'lucide-react';

const EventCard = ({ theme, dateTag, badge, subtitle, title, desc, attendees, actionText, actionVariant, onActionClick, isHosted }) => {

    const themes = {
        emerald: {
            bg: 'bg-[#102B24]',
            border: 'border-emerald-500/20',
            textTitle: 'text-white',
            textSubtitle: 'text-emerald-400',
            btnSolid: 'bg-emerald-500 text-[#022c22] hover:bg-emerald-400 shadow-emerald-500/20',
            iconBg: 'bg-emerald-500/20 text-emerald-400'
        },
        purple: {
            bg: 'bg-[#1E1145]',
            border: 'border-purple-500/20',
            textTitle: 'text-white',
            textSubtitle: 'text-purple-400',
            btnOutline: 'border border-white/20 text-white hover:bg-white/10',
            iconBg: 'bg-purple-500/20 text-purple-400'
        },
        blue: {
            bg: 'bg-[#0F1C3F]',
            border: 'border-blue-500/20',
            textTitle: 'text-white',
            textSubtitle: 'text-blue-400',
            btnSolid: 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20',
            iconBg: 'bg-blue-500/20 text-blue-400'
        }
    };

    const currentTheme = themes[theme] || themes.blue;

    const renderBadgeIcon = () => {
        if (badge.icon === 'building') return <Building2 size={12} />;
        if (badge.icon === 'users') return <Users size={12} />;
        if (badge.icon === 'bot') return <Bot size={12} />;
        return null;
    };

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all hover:scale-[1.02] flex flex-col h-full bg-[#171c28] relative ${currentTheme.border} ${isHosted ? 'ring-2 ring-accent-blue shadow-[0_0_20px_rgba(37,99,235,0.2)]' : ''}`}>

            {isHosted && (
                <div className="absolute top-0 right-0 bg-accent-blue text-white text-[9px] font-black px-3 py-1 rounded-bl-xl z-20 shadow-md uppercase tracking-wider flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Hosting
                </div>
            )}
            {/* Colored Header Banner */}
            <div className={`h-24 ${currentTheme.bg} w-full relative p-4 flex justify-between items-start`}>
                <div className="bg-[#111827]/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-white tracking-widest uppercase border border-white/10 shadow-sm">
                    {dateTag}
                </div>
                {badge && (
                    <div className={`ml-4 flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${currentTheme.iconBg}`}>
                        {renderBadgeIcon()}
                        {badge.text}
                    </div>
                )}
                {/* Floating Icon bottom right of banner */}
                <div className="absolute -bottom-4 right-4 w-8 h-8 rounded-full bg-[#1E293B] border-[3px] border-[#171c28] flex items-center justify-center text-white shadow-sm z-10">
                    {badge.icon === 'building' && <Building2 size={14} className="text-emerald-400" />}
                    {badge.icon === 'users' && <Users size={14} className="text-purple-400" />}
                    {badge.icon === 'bot' && <Bot size={14} className="text-blue-400" />}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col">
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${currentTheme.textSubtitle}`}>
                    {subtitle}
                </div>
                <h3 className={`text-lg font-bold mb-2 leading-tight ${currentTheme.textTitle}`}>
                    {title}
                </h3>
                <p className="text-text-secondary text-xs sm:text-xs leading-relaxed mb-6 flex-1">
                    {desc}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-2">
                        {attendees.type === 'avatars' ? (
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-300 to-green-500 border border-[#171c28]" />
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-100 to-yellow-300 border border-[#171c28]" />
                                <div className="w-6 h-6 rounded-full bg-[#1E293B] border border-[#171c28] flex items-center justify-center text-[9px] font-bold text-white z-10">
                                    {attendees.count}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                                <CircleUserRound size={14} />
                                <span>{attendees.text}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onActionClick}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
                            (actionText === 'Start' || actionText === 'Attend' || actionText === 'Join')
                            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
                            : actionText === 'Rejected'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-none hover:bg-red-500/20' 
                            : (actionText === 'Attending' || actionText === 'Requested' || actionText === 'Yet to Start')
                            ? 'bg-white/10 text-text-secondary border border-white/5 shadow-none hover:bg-white/20' 
                            : (actionVariant === 'outline' ? (currentTheme.btnOutline || currentTheme.btnSolid) : currentTheme.btnSolid)
                        }`}
                    >
                        {actionText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
