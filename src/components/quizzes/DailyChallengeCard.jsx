import React from 'react';
import { Zap } from 'lucide-react';

const DailyChallengeCard = () => {
    return (
        <div className="relative group overflow-hidden decoration-none cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity rounded-2xl" />

            <div className="relative p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-white fill-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Daily Challenge</span>
                </div>

                <h3 className="text-white font-black text-lg sm:text-xl mb-2">React Hooks Deep Dive</h3>
                <p className="text-white/70 text-[10px] sm:text-xs mb-6 leading-relaxed">
                    Complete today's challenge to earn 2x XP and keep your streak alive.
                </p>

                <button className="w-full bg-white text-indigo-700 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors shadow-lg shadow-black/20">
                    Play Now
                </button>
            </div>

            {/* Background Decorative Element */}
            <Zap
                size={120}
                className="absolute -bottom-6 -right-6 text-white/10 -rotate-12 group-hover:scale-110 transition-transform pointer-events-none"
            />
        </div>
    );
};

export default DailyChallengeCard;
