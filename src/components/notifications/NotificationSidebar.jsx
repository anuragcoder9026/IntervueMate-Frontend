import React from 'react';
import { SlidersHorizontal, Bell, Users, Bot, Layers, Settings } from 'lucide-react';

const NotificationSidebar = () => {
    return (
        <div className="bg-[#171c28] lg:rounded-2xl border border-white/5 flex flex-col p-2 lg:p-4 w-full shadow-lg">
            <div className="hidden lg:flex items-center justify-between mb-4 px-2">
                <span className="text-[11px] font-black text-[#a3aed0] tracking-widest uppercase">Filters</span>
                <SlidersHorizontal size={14} className="text-accent-blue" strokeWidth={2.5} />
            </div>

            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-1 mb-0 lg:mb-8 pb-1 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button className="flex items-center justify-between px-2.5 py-2 lg:px-3 lg:py-2.5 bg-accent-blue/10 rounded-xl text-accent-blue font-bold text-[11px] lg:text-[13px] transition-all border border-accent-blue/10 shrink-0 gap-3 lg:gap-0">
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-accent-blue flex items-center justify-center text-white shadow-lg shadow-accent-blue/20 shrink-0">
                            <Bell className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        </div>
                        <span className="whitespace-nowrap">All Notifications</span>
                    </div>
                    <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-accent-blue text-white text-[9px] lg:text-[10px] flex items-center justify-center font-black">
                        5
                    </div>
                </button>

                <button className="flex items-center gap-2 lg:gap-3 px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-xl text-[#a3aed0] hover:text-white hover:bg-white/5 transition-all text-[11px] lg:text-[13px] font-semibold shrink-0">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                    </div>
                    <span className="whitespace-nowrap">Social Activity</span>
                </button>

                <button className="flex items-center gap-2 lg:gap-3 px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-xl text-[#a3aed0] hover:text-white hover:bg-white/5 transition-all text-[11px] lg:text-[13px] font-semibold shrink-0">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                    </div>
                    <span className="whitespace-nowrap">AI Assistant</span>
                </button>

                <button className="flex items-center gap-2 lg:gap-3 px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-xl text-[#a3aed0] hover:text-white hover:bg-white/5 transition-all text-[11px] lg:text-[13px] font-semibold shrink-0">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                    </div>
                    <span className="whitespace-nowrap">Study Groups</span>
                </button>
            </div>

            <div className="hidden lg:block border-t border-white/5 pt-6 pb-2">
                <span className="text-[11px] font-black text-[#a3aed0] tracking-widest uppercase px-2 block mb-2">Preferences</span>
                <button className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[#a3aed0] hover:text-white hover:bg-white/5 transition-all text-[13px] font-semibold w-full">
                    <span>Notification Settings</span>
                    <Settings size={16} />
                </button>
            </div>
        </div>
    );
};

export default NotificationSidebar;
