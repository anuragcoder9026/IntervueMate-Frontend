import { Globe, Users, EyeOff } from 'lucide-react';

const SpaceLivePreview = ({ groupData }) => {
    const getInitials = (name) => {
        if (!name) return 'GP';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Derive tags from category and custom tags
    const categoryTag = groupData.category ? `#${groupData.category.toLowerCase().replace(/\s+/g, '-')}` : null;
    const customTags = (groupData.tags || []).map(tag => tag.startsWith('#') ? tag : `#${tag}`);
    const displayTags = [...new Set([...customTags, categoryTag].filter(Boolean))].slice(0, 3);

    return (
        <div className="w-full max-w-sm mx-auto xl:mr-10">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Live Preview</span>
                </div>
                <button className="text-[10px] font-bold text-text-secondary border border-border-primary hover:text-white px-3 py-1.5 rounded-full transition-colors bg-bg-secondary">
                    Discover Feed View
                </button>
            </div>

            {/* Preview Card */}
            <div className="bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Banner gradient mimicking cover image */}
                <div className="h-28 bg-bg-primary relative overflow-hidden">
                    {groupData.coverImage ? (
                        <img src={groupData.coverImage} className="w-full h-full object-cover" alt="Cover Preview" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-bg-primary"></div>
                    )}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white shadow-lg">
                        {groupData.category || 'Category'}
                    </div>
                </div>

                <div className="px-5 pb-5">
                    {/* Floating Avatar */}
                    <div className="relative -mt-8 mb-3 z-10">
                        <div className="w-16 h-16 rounded-xl bg-accent-blue border-[3px] border-bg-secondary flex items-center justify-center shadow-lg text-white font-black text-xl overflow-hidden">
                            {groupData.logo ? (
                                <img src={groupData.logo} className="w-full h-full object-cover" alt="Logo Preview" />
                            ) : (
                                getInitials(groupData.name)
                            )}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight mb-2">
                        {groupData.name || 'Your Community Name'}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] text-text-secondary mb-4 font-medium">
                        {groupData.privacy === 'private' ? <EyeOff size={12} /> : <Globe size={12} />}
                        <span className="capitalize">{groupData.privacy} Group</span>
                        <span className="w-1 h-1 rounded-full bg-text-secondary/50"></span>
                        <Users size={12} />
                        <span>1 member</span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-3">
                        {groupData.description || 'Your description will appear here...'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {displayTags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-border-primary/50 pt-4">
                        <div className="flex items-center">
                            {/* Dummy avatar stack */}
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/100?img=11" alt="Member" className="w-6 h-6 rounded-full border border-bg-secondary" />
                                <img src="https://i.pravatar.cc/100?img=12" alt="Member" className="w-6 h-6 rounded-full border border-bg-secondary" />
                                <div className="w-6 h-6 rounded-full border border-bg-secondary bg-bg-tertiary flex items-center justify-center text-[8px] font-bold text-white">
                                    +5
                                </div>
                            </div>
                        </div>
                        <button className="px-5 py-2 bg-accent-blue hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95">
                            Join Community
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-text-secondary mt-6 italic opacity-80 max-w-xs mx-auto">
                "This is how your community will appear to millions of job seekers in the Discover feed."
            </p>
        </div>
    );
};

export default SpaceLivePreview;
