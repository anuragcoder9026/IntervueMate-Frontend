import React from 'react';
import { Clock, Users, HelpCircle, ArrowRight } from 'lucide-react';

const ChallengeCard = ({ title, difficulty, description, questions, duration, attempts, icon: Icon, iconBg, onStartClick }) => {
    const difficultyColor = {
        'EASY': 'text-emerald-400 bg-emerald-400/10',
        'MEDIUM': 'text-amber-400 bg-amber-400/10',
        'HARD': 'text-rose-400 bg-rose-400/10'
    }[difficulty];

    return (
        <div
            onClick={onStartClick}
            className="bg-bg-secondary border border-white/5 rounded-2xl p-5 hover:border-accent-blue/30 transition-all group relative overflow-hidden cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${iconBg || 'bg-accent-blue/10'} text-white`}>
                    <Icon size={24} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider ${difficultyColor}`}>
                    {difficulty}
                </span>
            </div>

            <h3 className="text-white font-bold text-base sm:text-lg mb-2 group-hover:text-accent-blue transition-colors">{title}</h3>
            <p className="text-text-secondary text-[10px] sm:text-xs leading-relaxed mb-6 line-clamp-2">
                {description}
            </p>

            <div className="flex items-center gap-4 text-text-secondary mb-6 border-t border-white/5 pt-4">
                <div className="flex items-center gap-1.5 text-[11px]">
                    <HelpCircle size={14} className="text-accent-blue" />
                    <span>{questions} Questions</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock size={14} className="text-accent-blue" />
                    <span>{duration} Mins</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                    <Users size={14} className="text-accent-blue" />
                    <span>{attempts} attempts</span>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onStartClick();
                }}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:gap-3 transition-all"
            >
                Start Quiz <ArrowRight size={14} className="text-accent-blue sm:w-4 sm:h-4" />
            </button>
        </div>
    );
};

export default ChallengeCard;
