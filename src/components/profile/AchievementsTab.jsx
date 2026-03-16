import React from 'react';
import { Trophy, Star, Target } from 'lucide-react';

const AchievementsTab = () => {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-white mb-6">Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-border-primary rounded-xl flex items-center gap-4 bg-bg-primary">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">System Design Expert</h3>
                        <p className="text-xs text-text-secondary mt-1">Completed 50 peer mocks with high ratings.</p>
                    </div>
                </div>
                <div className="p-4 border border-border-primary rounded-xl flex items-center gap-4 bg-bg-primary">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                        <Star size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Top 5% Performer</h3>
                        <p className="text-xs text-text-secondary mt-1">Consistently scored above 90/100 in peer evaluations.</p>
                    </div>
                </div>
                <div className="p-4 border border-border-primary rounded-xl flex items-center gap-4 bg-bg-primary">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                        <Target size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">30 Day Streak</h3>
                        <p className="text-xs text-text-secondary mt-1">Maintained an active streak for a month.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementsTab;
