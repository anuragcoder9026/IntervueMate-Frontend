import React from 'react';

const TopLearners = () => {
    return (
        <div className="bg-bg-secondary border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold">Top Learners</h3>
                <button className="text-accent-blue text-[10px] font-black uppercase tracking-widest">View All</button>
            </div>

            <div className="space-y-4">
                {[
                    { rank: 1, name: 'Sarah Jenkins', xp: '24,500 XP', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
                    { rank: 2, name: 'David Chen', xp: '22,150 XP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
                    { rank: 3, name: 'Elena R.', xp: '19,800 XP', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
                    { rank: 42, name: 'You', xp: '12,450 XP', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', isUser: true }
                ].map((learner) => (
                    <div key={learner.name} className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${learner.isUser ? 'bg-accent-blue/10 border border-accent-blue/20' : ''}`}>
                        <span className={`w-5 text-xs font-black ${learner.rank === 1 ? 'text-amber-400' : learner.rank === 2 ? 'text-slate-400' : learner.rank === 3 ? 'text-amber-700' : 'text-accent-blue'}`}>
                            {learner.rank}
                        </span>
                        <img src={learner.avatar} className="w-8 h-8 rounded-full object-cover border border-white/10" alt={learner.name} />
                        <div className="flex-1">
                            <div className="text-xs font-bold text-white leading-none mb-1">{learner.name}</div>
                            <div className="text-[10px] text-text-secondary leading-none">{learner.xp}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopLearners;
