import React from 'react';
import SuggestionsRow from './SuggestionsRow';

const FriendsRightSidebar = () => {
    return (
        <div className="w-full lg:w-64 xl:w-[320px] shrink-0 lg:sticky top-24">
            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-sm tracking-tight text-white">People you may know</h3>
                    <button className="text-[10px] font-bold text-text-secondary hover:text-accent-blue transition-colors uppercase tracking-widest">See all</button>
                </div>

                <div className="space-y-6">
                    <SuggestionsRow
                        name="Rohan Mehta"
                        role="SDE @ Amazon"
                        tagline="IIT Delhi '24 | AWS Certified"
                        image="https://ui-avatars.com/api/?name=Rohan+Mehta&background=0284c7&color=fff"
                    />
                    <div className="h-px bg-border-primary/30 mx-2"></div>
                    <SuggestionsRow
                        name="Sarah Chen"
                        role="Product Manager @ Microsoft"
                        tagline="MBA Candidate"
                        image="https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff"
                    />
                    <div className="h-px bg-border-primary/30 mx-2"></div>
                    <SuggestionsRow
                        name="David Kim"
                        role="Frontend Engineer"
                        tagline="React & TypeScript"
                        image="https://ui-avatars.com/api/?name=David+Kim&background=f59e0b&color=fff"
                    />
                </div>
            </div>
        </div>
    );
};

export default FriendsRightSidebar;
