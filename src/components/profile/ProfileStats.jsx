import React from 'react';

const ProfileStats = ({ user }) => {
    const totalConnections = (user?.followers?.length || 0) + (user?.following?.length || 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-bg-secondary border border-border-primary shadow-sm rounded-xl p-5 sm:p-6 text-center group hover:border-accent-blue/50 transition-colors">
                <h4 className="text-white font-bold text-xl sm:text-2xl mb-1 group-hover:text-accent-blue transition-colors">
                    {user?.profileViews || 0}
                </h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">PROFILE VIEWS</p>
            </div>
            <div className="bg-bg-secondary border border-border-primary shadow-sm rounded-xl p-5 sm:p-6 text-center group hover:border-accent-green/50 transition-colors">
                <h4 className="text-white font-bold text-xl sm:text-2xl mb-1 group-hover:text-accent-green transition-colors">
                    {totalConnections}
                </h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">CONNECTIONS</p>
            </div>
            <div className="bg-bg-secondary border border-border-primary shadow-sm rounded-xl p-5 sm:p-6 text-center group hover:border-accent-purple/50 transition-colors">
                <h4 className="text-white font-bold text-xl sm:text-2xl mb-1 group-hover:text-accent-purple transition-colors">
                    0
                </h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">MOCKS COMPLETED</p>
            </div>
        </div>
    );
};

export default ProfileStats;
