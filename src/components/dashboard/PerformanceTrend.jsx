import React from 'react';

const PerformanceTrend = () => {
    return (
        <div className="bg-[#171c28] rounded-2xl p-6 border border-white/5 flex flex-col min-h-[350px] w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Interview Performance Trend</h2>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#a3aed0] bg-[#111622] px-3 py-1.5 rounded-lg border border-white/5">Last 30 Days</span>
            </div>

            <div className="flex-1 w-full relative group mt-4">
                {/* Y Axes grid lines */}
                <div className="absolute left-0 top-0 bottom-6 w-full flex flex-col justify-between pointer-events-none z-0 pr-2">
                    {[1, 2, 3, 4, 5, 6].map((_, i) => (
                        <div key={i} className="w-full border-b border-[#1C2436] absolute" style={{ top: `${(i * 100) / 6}%` }} />
                    ))}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
                        <div key={i} className="h-full border-l border-[#1C2436] absolute" style={{ left: `${(i * 100) / 12}%` }} />
                    ))}
                </div>

                <div className="w-full h-full relative z-10 bottom-6 sm:bottom-8">
                    <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full stroke-accent-blue fill-none filter drop-shadow-[0_10px_10px_rgba(37,99,235,0.4)] transition-all group-hover:drop-shadow-[0_10px_15px_rgba(37,99,235,0.6)]">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="rgba(37,99,235,0.4)" />
                                <stop offset="100%" stopColor="rgba(37,99,235,0)" />
                            </linearGradient>
                        </defs>

                        {/* Area */}
                        <path
                            d="M 5,42 C 15,35 25,40 30,40 S 40,25 50,25 S 60,10 70,10 S 80,25 90,25 S 95,30 100,32 L 100,50 L 5,50 Z"
                            fill="url(#chartGradient)"
                            className="stroke-none transition-all duration-1000"
                        />
                        {/* Line */}
                        <path
                            d="M 5,42 C 15,35 25,40 30,40 S 40,25 50,25 S 60,10 70,10 S 80,25 90,25 S 95,30 100,32"
                            strokeWidth="0.8"
                            className="stroke-accent-blue"
                            strokeLinecap="round"
                        />

                        {/* Data Points */}

                        <circle cx="30" cy="40" r="1.5" className="fill-[#171c28] stroke-accent-blue shadow-lg cursor-pointer hover:r-2 transition-all" strokeWidth="0.8" />
                        <circle cx="50" cy="25" r="1.5" className="fill-[#171c28] stroke-accent-blue shadow-lg cursor-pointer hover:r-2 transition-all" strokeWidth="0.8" />
                        <circle cx="70" cy="10" r="1.5" className="fill-[#171c28] stroke-accent-blue shadow-lg cursor-pointer hover:r-2 transition-all" strokeWidth="0.8" />
                        <circle cx="90" cy="25" r="1.5" className="fill-[#171c28] stroke-accent-blue shadow-lg cursor-pointer hover:r-2 transition-all" strokeWidth="0.8" />
                    </svg>

                    {/* X Axes Labels */}
                    <div className="absolute -bottom-8 left-0 w-full flex justify-between px-2 text-[10px] font-bold text-[#a3aed0] tracking-widest uppercase items-center">
                        <span>WK 1</span>
                        <span>WK 2</span>
                        <span>WK 3</span>
                        <span>WK 4</span>
                        <span>WK 5</span>
                        <span>WK 6</span>
                        <span>WK 7</span>
                        <span className="text-white bg-white/10 px-2 py-1 rounded">NOW</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceTrend;
