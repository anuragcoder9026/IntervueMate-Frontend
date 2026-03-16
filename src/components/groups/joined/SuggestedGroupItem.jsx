import React from 'react';

const SuggestedGroupItem = ({ name, members, image }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h5 className="text-xs font-bold text-text-primary hover:text-accent-blue cursor-pointer transition-colors leading-tight">{name}</h5>
                <p className="text-[10px] text-text-secondary mt-0.5">{members} Mutual Members</p>
            </div>
        </div>
        <button className="w-full py-1.5 border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white rounded-lg text-[10px] font-bold transition-all">
            Join Group
        </button>
    </div>
);

export default SuggestedGroupItem;
