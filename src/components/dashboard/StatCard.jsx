import React from 'react';

const StatCard = ({ title, value, icon: Icon, theme }) => {
    return (
        <div className="bg-[#171c28] rounded-2xl p-4 sm:p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-white/10 hover:shadow-lg h-full">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bg}`}>
                <Icon className={theme.text} size={20} />
            </div>
            <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#a3aed0] mb-1">{title}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-none">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
