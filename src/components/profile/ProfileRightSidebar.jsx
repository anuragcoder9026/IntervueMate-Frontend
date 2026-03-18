import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sparkles, ArrowRight, UserPlus, Cpu, Loader2, Target, MessageSquare, BrainCircuit } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const ProfileRightSidebar = ({ user, isOwnProfile }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [snapshot, setSnapshot] = useState(user?.aiSnapshot || null);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await api.get('/users/profile/suggested');
                if (response.data.success) {
                    setSuggestions(response.data.data);
                }
            } catch (err) {
                console.error('Fetch Suggestions Error:', err);
            } finally {
                setSuggestionsLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    const handleFollow = async (userId) => {
        try {
            const response = await api.put(`/users/${userId}/follow`);
            if (response.data.success) {
                toast.success('Following user!');
                // Remove the followed user from suggestions
                setSuggestions(prev => prev.filter(u => u._id !== userId));
            }
        } catch (err) {
            console.error('Follow Error:', err);
            toast.error(err.response?.data?.error || 'Failed to follow user');
        }
    };

    const takeSnapshot = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/users/profile/ai-snapshot');
            if (response.data.success) {
                setSnapshot(response.data.data);
                toast.success('AI Snapshot updated!');
            }
        } catch (err) {
            console.error('Snapshot Error:', err);
            toast.error(err.response?.data?.error || 'Failed to generate AI snapshot');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full lg:w-[320px] shrink-0 space-y-6">

            {/* Create Your Group*/}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-100"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 text-white backdrop-blur-sm border border-white/30">
                        <Users size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">Build Your Community</h3>
                    <p className="text-[10px] text-white/80 font-medium mb-4 max-w-[200px]">
                        Lead your own peer group and master interviews together.
                    </p>
                    <button onClick={() => navigate('/create-group')} className="px-5 py-1.5 bg-white text-indigo-900 rounded-full font-bold text-[11px] hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                        Create Your Group
                    </button>
                </div>
            </div>
             
             {/* AI Snapshot Section */}
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group/card transition-all duration-500 hover:shadow-purple-500/5">
                {/* Premium Background Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full -mr-20 -mt-20 group-hover/card:bg-purple-600/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-blue/5 blur-[50px] rounded-full -ml-16 -mb-16"></div>
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white tracking-tight">AI Snapshot</h3>
                                <p className="text-[10px] text-text-secondary font-medium tracking-wide">InterviewMate Engine v2.0</p>
                            </div>
                        </div>
                        <span className="text-[9px] text-purple-400 uppercase tracking-[0.15em] font-black bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">PRO</span>
                    </div>

                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-accent-blue/20 rounded-full blur-xl animate-pulse"></div>
                                <BrainCircuit size={40} className="text-accent-blue animate-bounce relative z-10" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-white">Generating Insights</h4>
                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-secondary">
                                    <Loader2 size={10} className="animate-spin text-accent-blue" />
                                    <span>Synthesizing profile data...</span>
                                </div>
                            </div>
                        </div>
                    ) : snapshot ? (
                        <div className="space-y-6">
                            {/* Readiness Score & Verdict Summary */}
                            <div className="flex items-center gap-5">
                                <div className="relative shrink-0 w-16 h-16">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/[0.03]" />
                                        <circle 
                                            cx="32" 
                                            cy="32" 
                                            r="28" 
                                            stroke="url(#gradient-purple)" 
                                            strokeWidth="5" 
                                            fill="transparent" 
                                            strokeDasharray={175.8} 
                                            strokeDashoffset={175.8 - (175.8 * snapshot.career_readiness.score) / 100} 
                                            className="transition-all duration-1000 ease-out" 
                                            strokeLinecap="round" 
                                        />
                                        <defs>
                                            <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#8b5cf6" />
                                                <stop offset="100%" stopColor="#3b82f6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-sm font-black text-white">{snapshot.career_readiness.score}</span>
                                        <span className="text-[7px] font-bold text-text-secondary uppercase">Score</span>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mb-0.5">
                                        <Target size={10} /> {snapshot.career_readiness.label}
                                    </div>
                                    <div className="text-xs font-bold text-white truncate uppercase tracking-tighter">
                                        {snapshot.career_readiness.level} Professional
                                    </div>
                                </div>
                            </div>

                            {/* Refined Metrics */}
                            <div className="space-y-4">
                                <div className="group/metric">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[11px] font-medium text-text-secondary group-hover/metric:text-white transition-colors">Communication</span>
                                        <span className="text-[11px] font-bold text-white">{snapshot.interview_performance.comm_score}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${snapshot.interview_performance.comm_score}%` }}></div>
                                    </div>
                                </div>
                                <div className="group/metric">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[11px] font-medium text-text-secondary group-hover/metric:text-white transition-colors">Logic & Analytical</span>
                                        <span className="text-[11px] font-bold text-white">{snapshot.interview_performance.logic_score}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-accent-blue to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${snapshot.interview_performance.logic_score}%` }}></div>
                                    </div>
                                </div>
                            </div>

                             {/* Analyst Insight Snippet - Always Full */}
                            <div className="relative group/insight">
                                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/5 to-accent-blue/5 rounded-xl opacity-0 group-hover/insight:opacity-100 transition-opacity"></div>
                                <div className="relative bg-bg-primary/40 p-4 rounded-xl border border-white/5 overflow-hidden">
                                    <MessageSquare size={12} className="absolute top-2 right-2 text-white/5" />
                                    <p className="text-[11px] text-text-secondary italic leading-relaxed">
                                        "{snapshot.summary_verdict}"
                                    </p>
                                </div>
                            </div>

                            {isOwnProfile && (
                                <button 
                                    onClick={takeSnapshot}
                                    className="w-full py-2.5 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 hover:from-purple-600/20 hover:to-indigo-600/20 text-white/80 text-[10px] uppercase tracking-widest font-bold rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    <Cpu size={12} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                                    Update DNA Snapshot
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white/[0.02] rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                                <BrainCircuit size={32} className="text-text-secondary/20" />
                            </div>
                            <p className="text-[11px] text-text-secondary mb-6 max-w-[180px] mx-auto leading-relaxed">No AI behavioral DNA has been synthesized for this account yet.</p>
                            {isOwnProfile && (
                                <button 
                                    onClick={takeSnapshot}
                                    className="px-6 py-2.5 bg-accent-blue hover:bg-blue-600 text-white text-[11px] font-bold rounded-xl transition-all shadow-xl shadow-accent-blue/20 active:scale-95 flex items-center gap-2 mx-auto"
                                >
                                    <Sparkles size={14} /> Synthesize DNA
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Suggested for you */}
            <div className="bg-[#0f111a] border border-white/5 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/5 blur-[40px] rounded-full -mr-12 -mt-12"></div>
                
                <h3 className="text-[11px] font-black text-[#a3aed0] tracking-[0.15em] uppercase mb-5 flex items-center gap-2">
                    <UserPlus size={14} className="text-accent-blue" />
                    Suggested for you
                </h3>

                <div className="space-y-4">
                    {suggestionsLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between gap-3 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-20 bg-white/5 rounded"></div>
                                        <div className="h-2 w-24 bg-white/5 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : suggestions.length > 0 ? (
                        suggestions.map((sug) => (
                            <div key={sug._id} className="flex items-center justify-between gap-3 group/item">
                                <div 
                                    onClick={() => navigate(`/profile/${sug.userId}`)}
                                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                                >
                                    <div className="relative shrink-0">
                                        <img 
                                            src={sug.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sug.name)}&background=random&color=fff`} 
                                            className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover/item:border-accent-blue/30 transition-colors" 
                                            alt={sug.name} 
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-blue rounded-full border-2 border-[#0f111a] scale-0 group-hover/item:scale-100 transition-transform"></div>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-white truncate group-hover/item:text-accent-blue transition-colors">
                                            {sug.name}
                                        </h4>
                                        <p className="text-[10px] text-text-secondary truncate mt-0.5 font-medium">
                                            {sug.headline || 'Professional'}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleFollow(sug._id)}
                                    className="shrink-0 flex items-center justify-center p-2 rounded-xl bg-white/[0.03] hover:bg-accent-blue text-[#a3aed0] hover:text-white transition-all border border-white/5 hover:border-accent-blue active:scale-90"
                                    title="Follow"
                                >
                                    <UserPlus size={14} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-[10px] text-text-secondary font-medium">No suggestions at the moment</p>
                        </div>
                    )}
                </div>

                {suggestions.length > 0 && (
                    <button 
                        onClick={() => navigate('/search')}
                        className="w-full mt-5 pt-4 text-center text-[10px] font-black text-[#a3aed0] hover:text-white flex items-center justify-center gap-2 group transition-colors border-t border-white/5 uppercase tracking-widest"
                    >
                        Explore More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfileRightSidebar;
