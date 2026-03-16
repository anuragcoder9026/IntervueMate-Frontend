import React from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupListItem = ({ name, members, image, iconColor, id, groupId }) => {
    const navigate = useNavigate();
    const targetLink = groupId ? `/groups/${name.toLowerCase().replace(/\s+/g, '-')}-${groupId}` : `/groups/${id}`;

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent-blue/30 transition-all group">
            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-lg ${iconColor || 'bg-accent-blue/20'}`}>
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        name.charAt(0)
                    )}
                </div>
                <div className="min-w-0 pr-2">
                    <h4
                        onClick={() => navigate(targetLink)}
                        className="font-bold text-base text-text-primary group-hover:text-white transition-colors cursor-pointer truncate"
                    >
                        {name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                        <Users size={12} />
                        <span>{members} Members</span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => navigate(targetLink)}
                className="w-full sm:w-auto px-6 py-2 bg-transparent border border-border-primary text-text-primary hover:bg-bg-tertiary transition-all rounded-xl text-xs font-bold pt-2 sm:pt-2 shrink-0 border-t sm:border border-border-primary/50 sm:border-border-primary sm:mt-0 mt-2"
            >
                View Group
            </button>
        </div>
    );
};

export default GroupListItem;
