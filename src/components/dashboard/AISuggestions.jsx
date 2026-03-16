import React from 'react';
import { Sparkles } from 'lucide-react';

const AISuggestions = () => {
    return (
        <div className="bg-[#171c28] rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
            <h2 className="text-[14px] font-black tracking-tight text-white flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                AI Suggestions
            </h2>

            <div className="flex flex-col gap-3 flex-1">
                <div className="bg-[#0A0F1A] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                    <span className="text-[9px] font-black tracking-widest uppercase text-red-500 mb-1.5 block">Critical</span>
                    <p className="text-[13px] text-white leading-relaxed">
                        Pacing too fast (180wpm). Aim for 140wpm.
                    </p>
                </div>
                <div className="bg-[#0A0F1A] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                    <span className="text-[9px] font-black tracking-widest uppercase text-yellow-500 mb-1.5 block">Warning</span>
                    <p className="text-[13px] text-white leading-relaxed">
                        Defining non-functional requirements missed.
                    </p>
                </div>
            </div>

            <button className="w-full bg-[#3B337A] hover:bg-[#4A3B7D] text-white rounded-xl py-3 text-sm font-bold transition-all shadow-lg mt-auto">
                Generate Report
            </button>
        </div>
    );
};

const DailyGoalBox = () => {
    return (
        <div className="bg-[#171c28] rounded-2xl p-6 border border-white/5 mt-6 relative overflow-hidden">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#a3aed0] mb-3">
                <span>Daily Goal</span>
            </div>
            <div className="flex justify-between items-end mb-3 relative z-10">
                <span className="text-sm font-black text-white">2/3 Mocks</span>
                <span className="text-xs font-bold text-white">66%</span>
            </div>

            <div className="w-full h-1.5 bg-[#0A0F1A] rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-purple-500 w-[66%] rounded-full shadow-[0_0_10px_#A855F7]" />
            </div>
        </div>
    );
}

export { AISuggestions, DailyGoalBox };
