import React, { useState } from 'react';
import {
    Info,
    Calendar,
    Shield,
    Tag,
    ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AboutGroupSection = ({ group }) => {
    const navigate = useNavigate();
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    if (!group) return null;

    const description = group.description || 'No description available.';
    const shouldTruncate = description.length > 100;
    const displayDesc = (shouldTruncate && !isDescExpanded) ? description.slice(0, 100) + '...' : description;

    const handleAdminClick = (admin) => {
        if (admin?.userId) {
            const nameSlug = admin.name?.replace(/\s+/g, '').toLowerCase() || '';
            navigate(`/profile/${nameSlug}-${admin.userId}`);
        }
    };

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-text-primary text-sm">About Group</h4>
                <Info size={16} className="text-text-secondary cursor-help" />
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-1">
                {displayDesc}
            </p>

            {shouldTruncate && (
                <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-xs font-bold text-accent-blue hover:text-white transition-colors mb-5"
                >
                    {isDescExpanded ? 'See less' : 'See more'}
                </button>
            )}

            {!shouldTruncate && <div className="mb-5" />}

            <div className="space-y-4">
                {/* Category */}
                {group.category && (
                    <div className="flex gap-3">
                        <Tag size={16} className="text-purple-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-1">Category</p>
                            <p className="text-xs font-medium text-text-primary capitalize">{group.category}</p>
                        </div>
                    </div>
                )}

                {/* Created */}
                <div className="flex gap-3">
                    <Calendar size={16} className="text-text-secondary shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-1">Created</p>
                        <p className="text-xs font-medium text-text-primary">
                            {group.createdAt ? format(new Date(group.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                        </p>
                    </div>
                </div>

                {/* Website */}
                {group.website && (
                    <div className="flex gap-3">
                        <ExternalLink size={16} className="text-accent-blue shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-1">Website</p>
                            <a
                                href={group.website.startsWith('http') ? group.website : `https://${group.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-accent-blue hover:text-white transition-colors truncate block max-w-[200px]"
                            >
                                {group.website}
                            </a>
                        </div>
                    </div>
                )}

                {/* Admins */}
                <div className="flex gap-3">
                    <Shield size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-2">Admins</p>
                        <div className="space-y-2">
                            {group.admins && group.admins.length > 0 ? (
                                group.admins.map((admin) => {
                                    const adminName = admin?.name || 'Admin';
                                    const adminAvatar = admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=fb923c&color=fff`;
                                    return (
                                        <div
                                            key={admin._id || admin}
                                            onClick={() => handleAdminClick(admin)}
                                            className="flex items-center gap-2.5 cursor-pointer group/admin hover:bg-white/5 -mx-1.5 px-1.5 py-1 rounded-lg transition-all"
                                        >
                                            <img
                                                src={adminAvatar}
                                                className="w-6 h-6 rounded-full object-cover border border-amber-500/30"
                                                alt={adminName}
                                            />
                                            <span className="text-xs font-medium text-text-primary group-hover/admin:text-accent-blue transition-colors truncate">
                                                {adminName}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <span className="text-xs text-text-secondary italic">No admins</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {group.tags && group.tags.length > 0 && (
                    <div className="pt-2 border-t border-border-primary/50">
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black leading-none mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                            {group.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 py-1 bg-accent-blue/10 text-accent-blue text-[10px] font-bold rounded-lg border border-accent-blue/20"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutGroupSection;
