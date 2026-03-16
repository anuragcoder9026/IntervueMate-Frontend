import React from 'react';

const PerformanceStats = () => {
    return (
        <div className="bg-bg-secondary border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-6">Your Performance</h3>

            <div className="relative w-40 h-40 mx-auto mb-8">
                {/* Circular Progress Placeholder */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-bg-tertiary"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 * (1 - 0.75)}
                        strokeLinecap="round"
                        className="text-accent-blue"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">75%</span>
                    <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Accuracy</span>
                </div>
            </div>

            <div className="space-y-4">
                {[
                    { label: 'Data Structures', value: '85%', color: 'bg-emerald-500' },
                    { label: 'Algorithms', value: '60%', color: 'bg-amber-500' },
                    { label: 'System Design', value: '72%', color: 'bg-accent-blue' }
                ].map((stat) => (
                    <div key={stat.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-text-secondary">{stat.label}</span>
                            <span className="text-white font-bold">{stat.value}</span>
                        </div>
                        <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${stat.color}`}
                                style={{ width: stat.value }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerformanceStats;
