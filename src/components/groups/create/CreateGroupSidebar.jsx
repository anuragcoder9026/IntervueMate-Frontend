import React from 'react';
import { Target, Palette, ListChecks, Shield, HelpCircle } from 'lucide-react';

const CreateGroupSidebar = ({ activeStep }) => {
    const steps = [
        { id: 1, title: 'Basic Info', desc: 'Name & Category', icon: Target },
        { id: 2, title: 'Visuals', desc: 'Cover & Logo', icon: Palette },
        { id: 3, title: 'Guidelines', desc: 'Rules & Protocols', icon: ListChecks },
        { id: 4, title: 'Permissions', desc: 'Security Access', icon: Shield },
    ];

    return (
        <div className="w-full lg:w-64 shrink-0 flex flex-col h-full  pr-6 lg:min-h-screen">
            <div className="mb-12 hidden lg:block">
                <h1 className="text-2xl font-black text-white leading-tight mb-2">
                    Create New<br />Community
                </h1>
                <p className="text-xs text-text-secondary leading-relaxed">
                    Chart your course to a new space.
                </p>
            </div>

            <div className="space-y-6 flex-1">
                {steps.map((step) => {
                    const isActive = activeStep === step.id;
                    const Icon = step.icon;
                    return (
                        <div key={step.id} className={`flex items-start gap-4 transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isActive ? 'bg-accent-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-bg-secondary border border-border-primary text-text-secondary'}`}>
                                <Icon size={14} />
                            </div>
                            <div>
                                <h3 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-text-secondary'}`}>
                                    {step.title}
                                </h3>
                                <p className="text-[10px] text-text-secondary mt-0.5">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default CreateGroupSidebar;
