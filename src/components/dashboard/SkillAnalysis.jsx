import React from 'react';

const SkillAnalysis = () => {
    return (
        <div className="bg-[#171c28] rounded-2xl p-4 sm:p-6 border border-white/5 flex flex-col h-full min-h-[280px] sm:min-h-[350px] w-full relative">
            <div className="flex items-center justify-between mb-2 sm:mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1 tracking-tight">Skill Coverage Analysis</h2>
                    <p className="text-xs font-bold text-accent-blue cursor-pointer hover:underline uppercase tracking-widest mt-2">View Details</p>
                </div>
            </div>

            <div className="flex-1 w-full relative flex items-center justify-center p-2 sm:p-8 mt-4">
                <svg viewBox="-40 -30 180 160" className="w-full h-full max-w-[320px] overflow-visible">
                    {/* Background Web lines */}
                    <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" className="fill-none stroke-[#1C2436]" strokeWidth="1" />
                    <polygon points="50,18 85,38 85,62 50,82 15,62 15,38" className="fill-none stroke-[#1C2436]" strokeWidth="1" />
                    <polygon points="50,35 68,45 68,55 50,65 32,55 32,45" className="fill-none stroke-[#1C2436]" strokeWidth="1" />

                    {/* Cross lines */}
                    <line x1="50" y1="0" x2="50" y2="100" className="stroke-[#1C2436]" strokeWidth="1" />
                    <line x1="0" y1="25" x2="100" y2="75" className="stroke-[#1C2436]" strokeWidth="1" />
                    <line x1="0" y1="75" x2="100" y2="25" className="stroke-[#1C2436]" strokeWidth="1" />

                    {/* Data Polygon */}
                    <polygon
                        points="50,10 85,30 80,70 50,90 20,65 30,28"
                        className="fill-[#4A3B7D]/80 stroke-purple-500 hover:fill-[#4A3B7D] transition-colors cursor-pointer"
                        strokeWidth="1.5"
                    />

                    {/* Scale Labels inside SVG viewBox with svg unit font-size to ensure native scaling */}
                    <text x="50" y="-8" textAnchor="middle" fontSize="7" className="font-bold fill-white tracking-wide">DSA</text>
                    <text x="105" y="28" textAnchor="start" fontSize="7" className="font-bold fill-white tracking-wide">Sys Design</text>
                    <text x="105" y="78" textAnchor="start" fontSize="7" className="font-bold fill-white tracking-wide">Behavioral</text>
                    <text x="50" y="112" textAnchor="middle" fontSize="7" className="font-bold fill-white tracking-wide">Communication</text>
                    <text x="-5" y="78" textAnchor="end" fontSize="7" className="font-bold fill-white tracking-wide">CS Core</text>
                    <text x="-5" y="28" textAnchor="end" fontSize="7" className="font-bold fill-white tracking-wide">Frontend</text>
                </svg>
            </div>
        </div>
    );
};

export default SkillAnalysis;
