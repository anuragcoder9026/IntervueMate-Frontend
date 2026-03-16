import React from 'react';
import { Search } from 'lucide-react';

const JoinedGroupsHeader = ({ groupCount = 12 }) => {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Joined Groups</h2>
                <span className="text-[10px] font-black uppercase text-text-secondary bg-bg-primary px-3 py-1 rounded-full border border-border-primary">{groupCount} Groups</span>
            </div>
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-text-secondary group-focus-within:text-accent-blue transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search your groups..."
                    className="w-full bg-bg-primary border border-border-primary rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/30 transition-all font-medium"
                />
            </div>
        </div>
    );
};

export default JoinedGroupsHeader;
