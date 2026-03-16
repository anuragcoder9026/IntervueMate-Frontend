import React from 'react';

const ProfileStats = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-bg-secondary border border-border-primary shadow-sm rounded-xl p-5 sm:p-6 text-center">
                <h4 className="text-white font-bold text-xl sm:text-2xl mb-1">Top 5%</h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">INTERVIEW PERFORMANCE</p>
            </div>
            <div className="bg-bg-secondary border border-border-primary shadow-sm rounded-xl p-5 sm:p-6 text-center">
                <h4 className="text-white font-bold text-xl sm:text-2xl mb-1">24</h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">DAY STREAK</p>
            </div>
            <div className="bg-bg-secondary border border-border-primary shadow-sm rounded-xl p-5 sm:p-6 text-center">
                <h4 className="text-white font-bold text-xl sm:text-2xl mb-1">48</h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">MOCKS COMPLETED</p>
            </div>
        </div>
    );
};

export default ProfileStats;
