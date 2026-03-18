import React, { useState } from 'react';
import { Cpu, Sparkles, TrendingUp, Target, Award, CheckCircle2, AlertCircle, Loader2, BrainCircuit } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AISnapshotTab = ({ user, isOwnProfile }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [snapshot, setSnapshot] = useState(user?.aiSnapshot || null);

    const takeSnapshot = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/users/profile/ai-snapshot');
            if (response.data.success) {
                setSnapshot(response.data.data);
                toast.success('AI Snapshot updated successfully!');
            }
        } catch (err) {
            console.error('Snapshot Error:', err);
            toast.error(err.response?.data?.error || 'Failed to generate AI snapshot');
        } finally {
            setIsLoading(false);
        }
    };

    if (!snapshot && !isLoading) {
        return (
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>

                <div className="w-20 h-20 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-6 relative group">
                    <div className="absolute inset-0 bg-accent-blue/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <Cpu size={40} className="text-accent-blue relative z-10" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">AI Professional Snapshot</h2>
                <p className="text-text-secondary max-w-md mb-8 leading-relaxed">
                    Get an instant AI-powered analysis of your career readiness. We'll analyze your resume, interview performance, and quiz scores to give you a comprehensive professional verdict.
                </p>

                {isOwnProfile ? (
                    <button
                        onClick={takeSnapshot}
                        className="bg-accent-blue hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-xl transition-all active:scale-95 shadow-lg shadow-accent-blue/20 flex items-center gap-3 group"
                    >
                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                        Take AI Snapshot
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-text-secondary italic">
                        <AlertCircle size={16} />
                        <span>This user hasn't generated an AI snapshot yet.</span>
                    </div>
                )}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-20 flex flex-col items-center justify-center shadow-xl relative overflow-hidden min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent"></div>
                <div className="relative flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-accent-blue/20 rounded-full blur-2xl animate-pulse"></div>
                        <BrainCircuit size={60} className="text-accent-blue animate-bounce relative z-10" />
                        <Loader2 size={80} className="text-accent-blue/30 animate-spin absolute top-1/2 left-1/2 -mt-10 -ml-10 z-0" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Profile...</h3>
                        <p className="text-text-secondary animate-pulse">Synthesizing interviews, resumes, and scores</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Header & Verdict */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    {isOwnProfile && (
                        <button 
                            onClick={takeSnapshot}
                            className="text-text-secondary hover:text-accent-blue transition-colors flex items-center gap-2 text-xs font-bold"
                        >
                            <Sparkles size={14} /> Refesh Snapshot
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    {/* Career Readiness Circular Score */}
                    <div className="relative shrink-0 flex items-center justify-center mx-auto md:mx-0">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * snapshot.career_readiness.score) / 100}
                                className="text-accent-blue transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">{snapshot.career_readiness.score}</span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase">Score</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                            <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue text-xs font-black rounded-lg border border-accent-blue/20 tracking-wider">
                                {snapshot.career_readiness.level}
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                                <CheckCircle2 size={16} /> {snapshot.career_readiness.label}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2 font-outfit">AI Analyst Verdict</h2>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl italic">
                            "{snapshot.summary_verdict}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Technical Proficiency */}
                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-xl">
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest opacity-50">
                        <TrendingUp size={16} className="text-accent-blue" /> Technical Proficiency
                    </h3>
                    <div className="space-y-5">
                        {snapshot.technical_proficiency.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-bold text-white">{item.skill}</span>
                                    <span className="text-xs font-black text-accent-blue">{item.rating}%</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-accent-blue rounded-full transition-all duration-700" 
                                        style={{ width: `${item.rating}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interview Performance */}
                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-xl flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest opacity-50">
                        <Target size={16} className="text-emerald-400" /> Interview Metrics
                    </h3>
                    <div className="flex-1">
                        <p className="text-sm text-text-secondary mb-6 leading-relaxed bg-bg-primary/40 p-3 rounded-lg border border-border-primary/50">
                            {snapshot.interview_performance.summary}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-bg-primary/40 p-4 rounded-xl border border-border-primary/50 text-center">
                                <div className="text-2xl font-black text-white mb-1">{snapshot.interview_performance.comm_score}</div>
                                <div className="text-[10px] font-bold text-text-secondary uppercase">Communication</div>
                            </div>
                            <div className="bg-bg-primary/40 p-4 rounded-xl border border-border-primary/50 text-center">
                                <div className="text-2xl font-black text-white mb-1">{snapshot.interview_performance.logic_score}</div>
                                <div className="text-[10px] font-bold text-text-secondary uppercase">Logical Reasoning</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Traits */}
                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-xl">
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest opacity-50">
                        <Award size={16} className="text-amber-400" /> Core Strengths
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {snapshot.top_traits.map((trait, idx) => (
                            <div key={idx} className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 text-sm font-bold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                {trait}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Plan */}
                <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-xl">
                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest opacity-50">
                        <BrainCircuit size={16} className="text-purple-400" /> Growth Action Plan
                    </h3>
                    <div className="space-y-3">
                        {snapshot.action_plan.map((step, idx) => (
                            <div key={idx} className="flex gap-3 items-start p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-black text-xs">
                                    {idx + 1}
                                </div>
                                <p className="text-sm text-text-secondary leading-snug">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="text-center py-4">
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-[0.2em]">
                    Powered by InterviewMate AI Nexus Engine
                </p>
            </div>
        </div>
    );
};

export default AISnapshotTab;
