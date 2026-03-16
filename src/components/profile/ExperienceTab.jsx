import React from 'react';
import { Plus, ChevronDown, Building2 } from 'lucide-react';

const ExperienceTab = () => {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-white">Experience</h2>
                <button className="text-accent-blue hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-accent-blue/10">
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-8">
                {/* Experience 1 */}
                <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Senior Software Engineer</h3>
                        <p className="text-xs text-text-secondary mt-0.5 font-medium">Google · Full-time</p>
                        <p className="text-[11px] text-text-secondary/70 mt-1">Jan 2021 - Present · 2 yrs 10 mos</p>
                        <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                            Leading the backend infrastructure team for Google Cloud Storage components. Optimized latency by 15%.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-border-primary/50 ml-16"></div>

                {/* Experience 2 */}
                <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-[#635BFF] rounded-lg flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                        <Building2 size={24} className="text-white opacity-80" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Software Engineer II</h3>
                        <p className="text-xs text-text-secondary mt-0.5 font-medium">Stripe · Full-time</p>
                        <p className="text-[11px] text-text-secondary/70 mt-1">Jun 2018 - Dec 2020 · 2 yrs 7 mos</p>
                        <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                            Worked on the Payments API team. Implemented new fraud detection signals.
                        </p>
                    </div>
                </div>
            </div>

            <button className="w-full mt-8 py-3 flex justify-center items-center gap-2 text-xs font-bold text-text-secondary hover:text-white transition-colors border-t border-border-primary/30 group">
                Show all experience <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
        </div>
    );
};

export default ExperienceTab;
