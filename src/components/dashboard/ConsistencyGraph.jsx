import React, { useMemo, useState } from 'react';
import { X, Users, FileText } from 'lucide-react';

const ConsistencyGraph = ({ interviews = [], quizzes = [], signupDate }) => {
    const days = 7;
    const [selectedDay, setSelectedDay] = useState(null);

    // Map data to dates
    const activityMap = useMemo(() => {
        const map = {};
        
        interviews.forEach(item => {
            if (!item || !item.date) return;
            const dateStr = new Date(item.date).toDateString();
            if (!map[dateStr]) map[dateStr] = { intensity: 0, items: [] };
            map[dateStr].intensity += 2;
            
            // Details from populated interview object
            const inv = item.interview || {};
            map[dateStr].items.push({
                type: 'interview',
                title: inv.role || 'Mock Interview',
                sessionType: inv.type,
                company: inv.companyName,
                experience: inv.experience,
                description: inv.jobDescription,
                score: inv.score,
                date: item.date
            });
        });

        quizzes.forEach(item => {
            if (!item || !item.date || !item.quizAttempt) return;
            const dateStr = new Date(item.date).toDateString();
            if (!map[dateStr]) map[dateStr] = { intensity: 0, items: [] };
            map[dateStr].intensity += 1;
            
            // Details from populated quizAttempt and nested quiz object
            const att = item.quizAttempt || {};
            const qz = att.quiz || {};
            
            map[dateStr].items.push({
                type: 'quiz',
                title: qz.title || 'Knowledge Quiz',
                score: att.score,
                totalQuestions: att.totalQuestions,
                status: att.status,
                date: item.date
            });
        });

        return map;
    }, [interviews, quizzes]);

    const gridData = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const totalWeeksToShow = 52;
        const totalDaysToShow = totalWeeksToShow * 7;
        
        const start = signupDate ? new Date(signupDate) : new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);

        const startDate = new Date(start);
        startDate.setDate(start.getDate() - start.getDay());

        const grid = Array.from({ length: days }).map(() => []);

        for (let i = 0; i < totalDaysToShow; i++) {
            const current = new Date(startDate);
            current.setDate(startDate.getDate() + i);
            const dateStr = current.toDateString();
            const activity = activityMap[dateStr] || { intensity: 0, items: [] };
            
            const dayOfWeek = current.getDay();
            grid[dayOfWeek].push({
                date: current,
                intensity: Math.min(activity.intensity, 4),
                items: activity.items,
                isFuture: current > today
            });
        }
        return grid;
    }, [activityMap, signupDate]);

    const getColor = (cell) => {
        if (cell.isFuture) return 'bg-[#0A0F1A] border-white/[0.02] opacity-20';
        switch (cell.intensity) {
            case 1: return 'bg-[#1e3a30] border-transparent';
            case 2: return 'bg-[#218146] border-transparent';
            case 3: return 'bg-[#2ba552] border-transparent';
            case 4: return 'bg-[#3ceb74] border-transparent shadow-[0_0_8px_rgba(60,235,116,0.3)]';
            default: return 'bg-[#1C2436] border-white/5';
        }
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthLabels = useMemo(() => {
        if (!gridData[0] || gridData[0].length === 0) return [];
        const labels = [];
        let currentMonth = -1;
        
        gridData[0].forEach((cell, idx) => {
            const m = cell.date.getMonth();
            if (m !== currentMonth) {
                labels.push({ name: months[m], index: idx });
                currentMonth = m;
            }
        });
        return labels;
    }, [gridData]);

    const totalActivityCount = interviews.length + quizzes.length;

    return (
        <>
            <div className="bg-[#171c28] rounded-2xl p-6 border border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1 tracking-tight">Preparation Consistency</h2>
                        <p className="text-[#a3aed0] text-sm">{totalActivityCount} activities since joining</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#a3aed0] font-bold uppercase tracking-widest bg-[#111622] px-3 py-1.5 rounded-lg border border-white/5">
                        <span>Less</span>
                        <div className="flex gap-1.5 mx-1">
                            <span className="w-3 h-3 rounded-[3px] bg-[#1C2436] border border-white/5" />
                            <span className="w-3 h-3 rounded-[3px] bg-[#1e3a30]" />
                            <span className="w-3 h-3 rounded-[3px] bg-[#218146]" />
                            <span className="w-3 h-3 rounded-[3px] bg-[#2ba552]" />
                            <span className="w-3 h-3 rounded-[3px] bg-[#3ceb74] shadow-[0_0_4px_rgba(60,235,116,0.3)]" />
                        </div>
                        <span>More</span>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar pb-3">
                    <div className="w-full pr-4">
                        <div className="flex gap-3">
                            <div className="flex flex-col justify-between text-[10px] font-bold text-[#a3aed0] py-1 shrink-0 uppercase tracking-widest">
                                <span className="h-4 flex items-center">Sun</span>
                                <span className="h-4 flex items-center">Wed</span>
                                <span className="h-4 flex items-center">Sat</span>
                            </div>

                            <div className="flex flex-col gap-2 flex-1">
                                <div className="relative h-4 w-full">
                                    {monthLabels.map((m, idx) => (
                                        <span 
                                            key={idx} 
                                            className="absolute text-[10px] font-bold tracking-widest text-[#a3aed0] uppercase"
                                            style={{ left: `${(m.index / 51) * 100}%` }}
                                        >
                                            {m.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-rows-7 gap-1 w-full">
                                    {gridData.map((dayRow, i) => (
                                        <div key={i} className="flex justify-between gap-1 w-full">
                                            {dayRow.map((cell, j) => (
                                                <div
                                                    key={j}
                                                    className={`w-[13px] h-[13px] sm:w-[15px] sm:h-[15px] xl:w-[18px] xl:h-[18px] rounded-[3px] border ${getColor(cell)} transition-all hover:scale-125 hover:z-10 relative cursor-crosshair`}
                                                    title={`${cell.date.toDateString()}: ${cell.items.length} activities`}
                                                    onClick={() => !cell.isFuture && setSelectedDay(cell)}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedDay && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A0F1A]/80 backdrop-blur-sm" onClick={() => setSelectedDay(null)}>
                    <div
                        className="bg-[#111622] rounded-3xl w-full max-w-lg border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#171c28]">
                            <div>
                                <h3 className="text-white text-lg font-black tracking-tight">{selectedDay.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${selectedDay.items.length > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                                    <p className="text-xs font-bold text-[#a3aed0] uppercase tracking-widest">
                                        {selectedDay.items.length === 0 ? 'No activity registered' : `${selectedDay.items.length} sessions completed`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="p-2 text-[#a3aed0] hover:text-white rounded-xl hover:bg-white/5 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {selectedDay.items.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <X size={24} className="text-slate-600" />
                                    </div>
                                    <p className="text-[#a3aed0] text-sm">No activities registered for this day.</p>
                                </div>
                            ) : (
                                selectedDay.items.map((item, idx) => (
                                    <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl bg-[#1C2436] border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                item.type === 'interview' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'
                                            }`}>
                                                {item.type === 'interview' ? <Users size={20} /> : <FileText size={20} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                                                        item.type === 'interview' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'
                                                    }`}>
                                                        {item.type}
                                                    </span>
                                                    {item.type === 'interview' ? item.sessionType && (
                                                        <span className="text-[9px] font-bold text-[#a3aed0] uppercase tracking-wider">
                                                            • {item.sessionType}
                                                        </span>
                                                    ) : <span className="text-[9px] font-bold text-[#a3aed0] uppercase tracking-wider">
                                                            • {item.totalQuestions} Questions
                                                        </span>}
                                                </div>
                                                <span className="text-white font-bold mt-0.5 text-[14px]">{item.title}</span> 
                                                {item.type === 'quiz' &&
                                                <span className={`text-[10px] ml-4 font-bold uppercase ${
                                                    item.status === 'finished' ? 'text-emerald-400' : 'text-orange-400'
                                                }`}>
                                                    {item.status || 'Active'}
                                                </span>
                                                }
                                            </div>
                                        </div>
                                        
                                            <div className="text-right">
                                                <p className={`text-sm font-black ${item.score >= 70 || item.score >= 7 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                    {item.type === 'quiz' ? `${item.score}/${item.totalQuestions}` : `${item.score}`}
                                                </p>
                                                <p className="text-[9px] text-[#a3aed0] font-bold uppercase tracking-wider">Score</p>
                                            </div>
                                    
                                    
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConsistencyGraph;
