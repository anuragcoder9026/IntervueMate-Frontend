import React from 'react';
import { ChevronDown } from 'lucide-react';

const AdminGrowthChart = () => {
    return (
        <div className="bg-[#1c2230] border border-border-primary rounded-xl p-6 h-full flex flex-col min-h-[300px] shadow-sm">
            <div className="flex items-start justify-between mb-8 z-10 relative">
                <div>
                    <h3 className="text-white font-bold text-sm tracking-tight mb-1">Member Growth</h3>
                    <p className="text-text-secondary text-[10px] font-medium">Last 30 Days Activity</p>
                </div>
                <button className="flex items-center gap-1.5 text-[10px] font-medium text-text-secondary hover:text-white transition-colors tracking-wide bg-[#242b3d] px-2 py-1.5 rounded-md border border-border-primary">
                    Last 30 Days <ChevronDown size={14} />
                </button>
            </div>

            {/* SVG Chart placeholder matching image */}
            <div className="relative flex-1 w-full flex items-end justify-between mt-auto min-h-[220px]">
                {/* Horizontal reference lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="w-full border-t border-border-primary/50"></div>
                    <div className="w-full border-t border-border-primary/50"></div>
                    <div className="w-full border-t border-border-primary/50"></div>
                    <div className="w-full border-t border-border-primary/50"></div>
                </div>

                {/* Simulated Chart area & Line */}
                <div className="absolute inset-0 pt-4 pb-2 -mx-2 pointer-events-none">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                        {/* Gradient Under Line */}
                        <defs>
                            <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0,45 Q15,42 30,35 T60,20 T80,15 L100,8 L100,50 L0,50 Z" fill="url(#blueGradient)" />

                        {/* Main Line */}
                        <path d="M0,45 Q15,42 30,35 T60,20 T80,15 L100,8" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />

                        {/* Data Points */}
                        <circle cx="30" cy="35" r="2.5" fill="#2563EB" stroke="#1c2230" strokeWidth="1.5" className="shadow-[0_0_10px_2px_#2563EB]" />
                        <circle cx="60" cy="20" r="2.5" fill="#2563EB" stroke="#1c2230" strokeWidth="1.5" />
                        <circle cx="90" cy="11.5" r="2.5" fill="#2563EB" stroke="#1c2230" strokeWidth="1.5" />
                    </svg>
                </div>

                {/* X Axis Labels */}
                <div className="w-full absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] text-text-secondary font-medium px-2">
                    <span>Nov 1</span>
                    <span>Nov 8</span>
                    <span>Nov 15</span>
                    <span>Nov 22</span>
                    <span>Nov 29</span>
                </div>
            </div>
        </div>
    );
};

export default AdminGrowthChart;
