import React, { useState } from 'react';
import { Link2, ChevronDown, Info, Hash, X } from 'lucide-react';

const MissionCoordinates = ({ groupData, updateGroupData }) => {
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim().replace(/^#/, '');
            if (newTag && !(groupData.tags || []).includes(newTag)) {
                updateGroupData({ tags: [...(groupData.tags || []), newTag] });
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        updateGroupData({
            tags: (groupData.tags || []).filter(t => t !== tagToRemove)
        });
    };

    return (
        <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Info size={24} className="text-accent-blue" />
                    Basic Information
                </h2>
                <div className="px-3 py-1 bg-bg-secondary border border-border-primary rounded-full text-[10px] font-bold text-text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue"></span> Step 1
                </div>
            </div>

            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-bold text-text-secondary mb-2 uppercase tracking-wider">
                            Community Name
                        </label>
                        <input
                            type="text"
                            value={groupData.name}
                            onChange={(e) => updateGroupData({ name: e.target.value })}
                            className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue transition-colors"
                            placeholder="e.g. Product Management Masters"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[11px] font-bold text-text-secondary mb-2 uppercase tracking-wider">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    value={groupData.category}
                                    onChange={(e) => updateGroupData({ category: e.target.value })}
                                    className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-accent-blue transition-colors"
                                >
                                    <option value="Colleges">Colleges</option>
                                    <option value="Companies">Companies</option>
                                    <option value="Technical Prep">Technical Prep</option>
                                    <option value="Behavioral Prep">Behavioral Prep</option>
                                    <option value="Career Guidance">Career Guidance</option>
                                    <option value="Open Source">Open Source</option>
                                    <option value="Hackathons">Hackathons</option>
                                    <option value="Upcoming Events">Upcoming Events</option>
                                    <option value="Other">Other</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-text-secondary mb-2 uppercase tracking-wider">
                                Website (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                                    <Link2 size={16} />
                                </div>
                                <input
                                    type="text"
                                    value={groupData.website}
                                    onChange={(e) => updateGroupData({ website: e.target.value })}
                                    className="w-full bg-bg-primary border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue transition-colors"
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-text-secondary mb-2 uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            value={groupData.description}
                            onChange={(e) => updateGroupData({ description: e.target.value })}
                            rows="4"
                            className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue transition-colors resize-none"
                            placeholder="Tell us what this community is about..."
                        ></textarea>
                        <div className="flex justify-between items-center mt-2 mb-6">
                            <span className="text-[10px] text-text-secondary">Be descriptive to attract the right members.</span>
                            <span className="text-[10px] text-text-secondary">{groupData.description.length}/500</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-text-secondary mb-2 uppercase tracking-wider">
                            Community Tags
                        </label>
                        <div className="bg-bg-primary border border-white/10 rounded-xl p-2 min-h-[50px] flex flex-wrap gap-2 items-center focus-within:border-accent-blue transition-colors">
                            {(groupData.tags || []).map((tag, i) => (
                                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary border border-border-primary rounded-lg text-xs font-bold text-white shadow-sm">
                                    <span className="text-accent-blue opacity-70">#</span>{tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="text-text-secondary hover:text-red-400 transition-colors ml-1"
                                    >
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                </span>
                            ))}
                            <div className="flex-1 min-w-[120px] flex items-center relative">
                                <Hash size={12} className="absolute left-2 text-text-secondary/50" />
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="w-full bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 pl-7 py-1"
                                    placeholder="Type and press Enter"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MissionCoordinates;
