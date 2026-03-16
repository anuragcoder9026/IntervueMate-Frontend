import React from 'react';

const ProfileTabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="pt-2 flex items-center overflow-x-auto no-scrollbar gap-6 sm:gap-8 border-b border-border-primary/50">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab
                        ? 'border-accent-blue text-accent-blue font-bold'
                        : 'border-transparent text-text-secondary hover:text-white'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default ProfileTabs;
