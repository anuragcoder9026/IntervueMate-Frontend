import React from 'react';
import { Lock } from 'lucide-react';

const AccessRestricted = ({ groupName, onViewGroup, onBrowseGroups }) => {
    return (
        <div className="h-screen bg-[#070B13] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-rose-500/20 blur-[60px] rounded-full animate-pulse" />
                <div className="w-24 h-24 bg-[#0A0F1A] border-2 border-rose-500/30 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Lock size={40} className="text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Access Restricted</h1>
            <p className="text-text-secondary max-w-md mb-10 text-[11px] md:text-xs leading-relaxed uppercase tracking-[0.2em] font-medium opacity-60">
                You are not a member of <span className="text-white font-black">"{groupName}"</span>. <br />
                Join this community to unlock and explore shared resources.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onViewGroup}
                    className="px-10 py-4 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:-translate-y-1 active:scale-95"
                >
                    View Group Profile
                </button>
                <button
                    onClick={onBrowseGroups}
                    className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all border border-white/10 hover:border-white/20 hover:-translate-y-1 active:scale-95"
                >
                    Browse Other Groups
                </button>
            </div>
        </div>
    );
};

export default AccessRestricted;
