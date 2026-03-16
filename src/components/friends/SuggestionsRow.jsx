import React from 'react';
import { UserPlus } from 'lucide-react';

const SuggestionsRow = ({ name, role, tagline, image }) => (
    <div className="flex items-start gap-4 p-1 group">
        <div className="relative shrink-0 mt-1">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-border-primary bg-bg-primary flex items-center justify-center">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-[10px] text-text-secondary font-bold">User</span>
                )}
            </div>
        </div>
        <div className="flex-1 space-y-1">
            <h5 className="text-xs font-bold text-text-primary hover:text-accent-blue cursor-pointer transition-colors line-clamp-1">{name}</h5>
            <p className="text-[10px] text-text-secondary leading-tight line-clamp-2">
                {role} @ {tagline}
            </p>
            <button className="flex items-center gap-1.5 px-4 py-1 mt-2 text-[10px] font-bold text-text-secondary border border-border-primary hover:border-accent-blue hover:text-white rounded-full transition-all group-hover:bg-accent-blue/5">
                <UserPlus size={12} />
                Connect
            </button>
        </div>
    </div>
);

export default SuggestionsRow;
