import React from 'react';
import SuggestedGroupItem from './SuggestedGroupItem';

const JoinedGroupsRightSidebar = () => {
    return (
        <div className="w-full lg:w-64 xl:w-72 space-y-4 shrink-0 lg:sticky top-24 h-fit">
            <div className="bg-bg-secondary border border-border-primary rounded-3xl p-6 shadow-sm">
                <div className="space-y-1 mb-6">
                    <h3 className="font-bold text-sm text-white">Suggested Groups</h3>
                    <p className="text-[10px] text-text-secondary">Based on your profile & skills</p>
                </div>

                <div className="space-y-6">
                    <SuggestedGroupItem
                        name="FAANG Interview Prep"
                        members="24"
                        image="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=100&q=80"
                    />
                    <SuggestedGroupItem
                        name="Data Science Hub"
                        members="12"
                        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=100&q=80"
                    />
                    <SuggestedGroupItem
                        name="Startup Founders Circle"
                        members="8"
                        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=100&q=80"
                    />
                </div>

                <button className="w-full mt-6 pt-4 border-t border-border-primary/50 text-[10px] font-black uppercase text-accent-blue hover:text-white transition-colors text-center tracking-widest">
                    View All Suggestions
                </button>
            </div>

            {/* Premium Card */}
            <div className="bg-gradient-to-br from-[#121826] to-[#0A0F1A] border border-accent-blue/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                <div className="relative z-10">
                    <h3 className="font-bold text-base text-white mb-2">Premium Access</h3>
                    <p className="text-[10px] text-text-secondary leading-relaxed mb-6 opacity-80 font-medium">
                        Unlock exclusive interview mocks with top mentors.
                    </p>
                    <button className="w-full py-2.5 bg-white text-black font-black text-[10px] rounded-xl hover:bg-accent-blue hover:text-white transition-all shadow-lg active:scale-95 uppercase tracking-widest">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinedGroupsRightSidebar;
