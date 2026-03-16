import React from 'react';
import { Search } from 'lucide-react';

const EventsFilterBar = ({ activeFilter, onFilterChange, searchQuery, onSearchChange }) => {
    const filters = [
        'All Events',
        'General Tech Talk',
        'Interview Training',
        'Job Opportunity',
        'Current News',
        'Group Study'
    ];

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                            activeFilter === filter
                                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                                : 'bg-bg-secondary border border-white/5 text-text-secondary hover:text-white'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex items-center bg-bg-secondary rounded-lg border border-white/10 px-3 flex-1 md:w-64 focus-within:border-accent-blue/50">
                    <Search size={16} className="text-text-secondary w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search events..."
                        className="bg-transparent border-none text-sm text-white pl-2 py-2 focus:outline-none w-full placeholder:text-text-secondary/60"
                    />
                </div>
            </div>
        </div>
    );
};

export default EventsFilterBar;
