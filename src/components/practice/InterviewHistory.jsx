import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, Briefcase, ArrowRight, Loader2, History, ChevronRight, Plus } from 'lucide-react';
import Navbar from '../../components/Navbar';

const InterviewHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/interview/history', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success) {
                    setHistory(data.history);
                }
            } catch (err) {
                console.error('Failed to fetch history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary font-inter">
            <Navbar />
            <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 md:py-12 mb-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <History size={28} className="text-accent-blue" />
                            Interview History
                        </h1>
                        <p className="text-text-secondary mt-1 text-sm">Review your past mock interview sessions</p>
                    </div>
                    <button
                        onClick={() => navigate('/interview')}
                        className="flex gap-1 px-5 py-2.5 bg-accent-blue hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-sm"
                    > 
                      <Plus size={18} strokeWidth={2.5} />
                        New Interview
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                        <Loader2 className="animate-spin text-accent-blue" size={40} />
                        <p className="text-text-secondary text-sm font-bold tracking-widest uppercase">Loading History...</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                        <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center border border-border-primary">
                            <Briefcase size={32} className="text-text-secondary" />
                        </div>
                        <p className="text-text-secondary font-bold">No completed interviews yet</p>
                        <button
                            onClick={() => navigate('/interview')}
                            className="px-6 py-2.5 bg-accent-blue hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-sm mt-2"
                        >
                            Start Your First Interview
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item, idx) => (
                            <div
                                key={item._id}
                                onClick={() => item.feedback?.feedbackId && navigate(`/interview/feedback/${item.feedback.feedbackId}`)}
                                className="bg-bg-secondary border border-border-primary rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-accent-blue/30 hover:bg-white/[0.02] transition-all cursor-pointer group"
                                style={{ animationDelay: `${idx * 60}ms` }}
                            >
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    {/* Score Badge */}
                                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${getScoreColor(item.feedback?.overallScore || item.score || 0)}`}>
                                        <span className="text-lg font-black">{item.feedback?.overallScore || item.score || '--'}</span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-white font-bold text-sm truncate">{item.role}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary bg-white/5 px-2 py-0.5 rounded-md">{item.type}</span>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">{item.experience}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 shrink-0">
                                    {item.feedback && (
                                        <div className="hidden sm:flex items-center gap-2 text-text-secondary text-xs">
                                            <Award size={12} />
                                            <span>{item.feedback.questionsAnswered}/{item.feedback.totalQuestions} answered</span>
                                        </div>
                                    )}
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-xs text-text-secondary font-medium">{formatDate(item.date)}</span>
                                        <span className="text-[10px] text-text-secondary/60">{formatTime(item.date)}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-text-secondary group-hover:text-accent-blue transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default InterviewHistory;
