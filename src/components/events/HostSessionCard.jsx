import React from 'react';
import { Plus } from 'lucide-react';

const HostSessionCard = ({ onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="rounded-2xl border-2 border-dashed border-white/20 hover:border-accent-blue/50 transition-colors flex flex-col h-full bg-[#111622]/50 items-center justify-center p-8 cursor-pointer group hover:bg-[#111827]"
        >
            <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-accent-blue/10 flex items-center justify-center transition-colors mb-4 text-white">
                <Plus size={24} className="group-hover:text-accent-blue" />
            </div>
            <h3 className="text-white font-bold text-center text-lg mb-2 group-hover:text-accent-blue transition-colors">
                Host Your Own Session
            </h3>
            <p className="text-text-secondary text-xs text-center max-w-[200px]">
                Create a study group, lead a discussion, or practice presenting to the community.
            </p>
        </div>
    );
};

export default HostSessionCard;
