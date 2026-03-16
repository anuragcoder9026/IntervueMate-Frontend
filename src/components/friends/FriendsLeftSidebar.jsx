import React from 'react';
import { Users, UserPlus, BookOpen } from 'lucide-react';

const FriendsLeftSidebar = () => {
    return (
        <div className="w-full lg:w-72 space-y-4 shrink-0">
            {/* Manage network card */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm tracking-tight mb-6 text-white">Manage my network</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs group cursor-pointer">
                        <div className="flex items-center gap-3 text-text-secondary group-hover:text-white transition-colors">
                            <Users size={16} />
                            <span className="font-medium">Connections</span>
                        </div>
                        <span className="text-text-secondary font-bold group-hover:text-white">1,248</span>
                    </div>
                    <div className="flex items-center justify-between text-xs group cursor-pointer">
                        <div className="flex items-center gap-3 text-text-secondary group-hover:text-white transition-colors">
                            <UserPlus size={16} />
                            <span className="font-medium">Contacts</span>
                        </div>
                        <span className="text-text-secondary font-bold group-hover:text-white">452</span>
                    </div>
                    <div className="flex items-center justify-between text-xs group cursor-pointer">
                        <div className="flex items-center gap-3 text-text-secondary group-hover:text-white transition-colors">
                            <BookOpen size={16} />
                            <span className="font-medium">Groups</span>
                        </div>
                        <span className="text-text-secondary font-bold group-hover:text-white">12</span>
                    </div>
                </div>
            </div>

            {/* Profile card */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-sm group">
                <div className="h-16 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-border-primary/30"></div>
                <div className="px-5 pb-6 flex flex-col items-center">
                    <div className="relative -mt-8 mb-4">
                        <img
                            src="https://ui-avatars.com/api/?name=Alex+M&background=fb923c&color=fff"
                            className="w-16 h-16 rounded-full border-4 border-bg-secondary shadow-xl transition-transform group-hover:rotate-6"
                            alt="Profile"
                        />
                    </div>
                    <h3 className="font-bold text-text-primary text-base text-center group-hover:text-white transition-colors">Alex Thompson</h3>
                    <p className="text-[10px] text-text-secondary mt-1 text-center leading-relaxed px-2">
                        Product Designer | UI/UX Enthusiast | Frontend Developer
                    </p>

                    <div className="w-full h-px bg-border-primary/50 my-6"></div>

                    <div className="w-full space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                            <span className="text-text-secondary">Profile Strength</span>
                            <span className="text-accent-blue font-bold">Intermediate</span>
                        </div>
                        <div className="h-1.5 bg-border-primary rounded-full overflow-hidden">
                            <div className="h-full bg-accent-blue w-[65%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsLeftSidebar;
