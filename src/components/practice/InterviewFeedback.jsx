import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, AlertCircle, TrendingUp, Target,
    MessageSquare, AlertTriangle, ArrowLeft, Loader2,
    RotateCcw, History, BarChart3
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const getGrade = (score) => {
    if (score >= 90) return { label: 'Outstanding', emoji: '🏆', color: 'text-emerald-400' };
    if (score >= 80) return { label: 'Excellent', emoji: '🌟', color: 'text-emerald-400' };
    if (score >= 70) return { label: 'Strong', emoji: '💪', color: 'text-blue-400' };
    if (score >= 60) return { label: 'Good', emoji: '👍', color: 'text-amber-400' };
    if (score >= 50) return { label: 'Fair', emoji: '📝', color: 'text-orange-400' };
    return { label: 'Needs Work', emoji: '🎯', color: 'text-red-400' };
};

const getQuestionScoreColor = (score) => {
    if (score >= 8) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (score >= 6) return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    if (score >= 4) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-red-500/15 text-red-400 border-red-500/30';
};

const InterviewFeedback = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/interview/feedback/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.success) {
                    setFeedback(data.feedback);
                } else {
                    setError(data.error || 'Failed to fetch feedback');
                }
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Network error fetching feedback");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFeedback();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="bg-bg-primary min-h-screen font-inter flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
                    <Loader2 className="animate-spin text-accent-blue" size={48} />
                    <p className="text-text-secondary font-bold tracking-widest uppercase text-sm">Loading Detailed Feedback...</p>
                </div>
            </div>
        );
    }

    if (error || !feedback) {
        return (
            <div className="bg-bg-primary min-h-screen font-inter flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <AlertCircle className="text-red-500" size={48} />
                    <p className="text-red-400 font-bold">{error || "Feedback not found"}</p>
                    <button onClick={() => navigate('/interview')} className="mt-4 px-6 py-2 bg-bg-secondary border border-border-primary rounded-xl text-white hover:bg-white/10 transition">
                        Back to Practice
                    </button>
                </div>
            </div>
        );
    }

    const { overallScore, performanceSummary, strengths, improvements, detailedAnalysis, interview, questionsAnswered = 0, totalQuestions = 0 } = feedback;
    const grade = getGrade(overallScore);

    // Find max score for chart scaling
    const maxScore = 10;

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary font-inter">
            <Navbar />
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 animate-in zoom-in-95 duration-700 mb-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/interview/history')} className="p-2 hover:bg-white/5 rounded-full transition-colors text-text-secondary hover:text-white">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-white">Interview Feedback</h1>
                            <p className="text-text-secondary mt-1 tracking-wide text-sm">
                                {interview?.type} • {interview?.role} ({interview?.experience})
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/interview/history')}
                            className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-primary rounded-xl text-text-secondary hover:text-white transition-colors text-sm font-bold"
                        >
                            <History size={16} />
                            History
                        </button>
                        <button
                            onClick={() => navigate('/interview')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-accent-blue hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-sm"
                        >
                            <RotateCcw size={16} />
                            Retake
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Column - Score & Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Score Card */}
                        <div className="bg-bg-secondary border border-border-primary rounded-[32px] p-8 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-bl-[100px]"></div>

                            <h2 className="text-text-secondary font-bold tracking-widest uppercase text-xs mb-6 w-full text-center">Overall Score</h2>

                            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <circle
                                        cx="50" cy="50" r="45" fill="none"
                                        stroke={overallScore >= 80 ? '#10B981' : overallScore >= 60 ? '#F59E0B' : '#EF4444'}
                                        strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={`${overallScore * 2.83} 283`}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-5xl font-black text-white tracking-tighter">{overallScore}</span>
                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">/ 100</span>
                                </div>
                            </div>

                            {/* Grade Label */}
                            <div className={`flex items-center gap-2 mb-4 ${grade.color}`}>
                                <span className="text-2xl">{grade.emoji}</span>
                                <span className="text-sm font-black uppercase tracking-wider">{grade.label}</span>
                            </div>

                            {/* Questions Answered Widget */}
                            <div className="w-full mt-2 bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-text-secondary flex items-center gap-2">
                                    <MessageSquare size={14} className="text-accent-blue" />
                                    Questions Answered
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {questionsAnswered} <span className="text-text-secondary">/ {totalQuestions}</span>
                                </span>
                            </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="bg-bg-secondary border border-border-primary rounded-[24px] p-6 shadow-sm">
                            <h3 className="flex items-center gap-2 text-white font-bold mb-4">
                                <TrendingUp size={18} className="text-accent-blue" /> Final Verdict
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {performanceSummary}
                            </p>
                        </div>

                        {/* Score Comparison Chart */}
                        {detailedAnalysis && detailedAnalysis.length > 0 && (
                            <div className="bg-bg-secondary border border-border-primary rounded-[24px] p-6 shadow-sm">
                                <h3 className="flex items-center gap-2 text-white font-bold mb-5">
                                    <BarChart3 size={18} className="text-accent-blue" /> Score Breakdown
                                </h3>
                                <div className="space-y-3">
                                    {detailedAnalysis.map((item, i) => {
                                        const score = item.score || 0;
                                        const barColor = score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-blue-500' : score >= 4 ? 'bg-amber-500' : 'bg-red-500';
                                        return (
                                            <div key={i} className="group">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Q{i + 1}</span>
                                                    <span className="text-[10px] font-bold text-white">{score}/10</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                                                        style={{ width: `${(score / maxScore) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Strengths, Improvements & Detailed Analysis */}
                    <div className="lg:col-span-2 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-[24px] p-6">
                                <h3 className="flex items-center gap-2 text-[#10B981] font-bold mb-5">
                                    <CheckCircle size={18} /> Core Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {strengths?.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-[#10B981]/80 leading-relaxed">
                                            <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#10B981] block"></span>
                                            {item}
                                        </li>
                                    ))}
                                    {(!strengths || strengths.length === 0) && <p className="text-sm text-gray-500">No specific strengths captured.</p>}
                                </ul>
                            </div>

                            {/* Improvements */}
                            <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-[24px] p-6">
                                <h3 className="flex items-center gap-2 text-[#EF4444] font-bold mb-5">
                                    <Target size={18} /> Areas for Improvement
                                </h3>
                                <ul className="space-y-3">
                                    {improvements?.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-[#EF4444]/80 leading-relaxed">
                                            <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#EF4444] block"></span>
                                            {item}
                                        </li>
                                    ))}
                                    {(!improvements || improvements.length === 0) && <p className="text-sm text-gray-500">No specific improvements suggested.</p>}
                                </ul>
                            </div>
                        </div>

                        {/* Detailed Analysis */}
                        <div className="bg-bg-secondary border border-border-primary rounded-[24px] overflow-hidden">
                            <div className="p-6 border-b border-border-primary bg-white/[0.02]">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <MessageSquare size={20} className="text-accent-blue" /> Question-by-Question Analysis
                                </h3>
                            </div>
                            <div className="divide-y divide-border-primary">
                                {detailedAnalysis?.map((item, i) => (
                                    <div key={i} className="p-6 hover:bg-white/[0.01] transition-colors">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">
                                                    Question {i + 1}
                                                </span>
                                                <p className="text-white font-medium leading-relaxed">{item.question}</p>
                                            </div>
                                            {/* Per-question score badge */}
                                            <div className={`px-3 py-1.5 rounded-xl border text-xs font-black shrink-0 ${getQuestionScoreColor(item.score || 0)}`}>
                                                {item.score || 0}/10
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                                <div className="text-[10px] font-bold tracking-widest uppercase text-text-secondary mb-2 flex items-center gap-2">
                                                    Your Response Summary
                                                </div>
                                                <p className="text-sm text-text-secondary leading-relaxed italic">"{item.response}"</p>
                                            </div>

                                            <div className="bg-accent-blue/5 rounded-xl p-4 border border-accent-blue/10">
                                                <div className="text-[10px] font-bold tracking-widest uppercase text-accent-blue mb-2 flex items-center gap-2">
                                                    Actionable Feedback
                                                </div>
                                                <p className="text-sm text-blue-100/70 leading-relaxed">{item.feedback}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!detailedAnalysis || detailedAnalysis.length === 0) && (
                                    <div className="p-8 text-center text-text-secondary">
                                        No detailed response breakdowns available for this session.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default InterviewFeedback;
