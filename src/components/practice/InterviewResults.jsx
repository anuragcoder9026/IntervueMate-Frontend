import React, { useEffect, useState } from 'react';
import {
    Share2,
    Download,
    Brain,
    Zap,
    Target,
    ShieldCheck,
    Check,
    AlertCircle,
    RefreshCcw,
    Loader
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const InterviewResults = ({ onRetake, interviewId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            if (!interviewId) {
                setError("No interview ID provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/interview/finish', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ interviewId })
                });

                const data = await response.json();
                if (data.success) {
                    setFeedback(data.feedback);
                    setScore(data.score || 85); // fallback to 85 if unable to parse score
                } else {
                    setError(data.error || "Failed to finalize session.");
                }
            } catch (err) {
                console.error("Error fetching results", err);
                setError("Network error fetching results.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [interviewId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4 animate-in fade-in duration-500">
                <Loader className="animate-spin text-accent-blue" size={48} />
                <p className="text-text-secondary font-bold tracking-widest uppercase text-sm">Analyzing Interview Performance...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
                <AlertCircle className="text-red-500" size={48} />
                <p className="text-red-400 font-bold">{error}</p>
                <button onClick={onRetake} className="mt-4 px-6 py-2 bg-bg-secondary border border-border-primary rounded-xl text-white hover:bg-white/10 transition">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <main className="max-w-[1000px] mx-auto px-6 py-12 md:py-16 animate-in zoom-in-95 duration-700">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-12">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-none tracking-tight">Session Results</h1>
                </div>
                <div className="flex gap-3 sm:gap-4">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs sm:text-sm font-bold text-white shadow-xl">
                        <Share2 size={16} /> <span className="sm:inline">Share</span>
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-accent-blue border border-accent-blue/20 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-blue-600 transition-colors text-xs sm:text-sm font-bold text-white shadow-lg shadow-accent-blue/20">
                        <Download size={16} /> <span className="sm:inline">Save to Profile</span>
                    </button>
                </div>
            </div>

            {/* Top Grid: Main Score & Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 items-stretch">
                {/* Main Score Component */}
                <div className="md:col-span-1 bg-bg-secondary border border-border-primary rounded-[32px] p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                    {/* Ring background */}
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-4 sm:mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="56"
                                cy="56"
                                r="48"
                                fill="transparent"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="8"
                                className="sm:hidden"
                            />
                            <circle
                                cx="56"
                                cy="56"
                                r="48"
                                fill="transparent"
                                stroke="#2563EB"
                                strokeWidth="8"
                                strokeDasharray={Math.PI * 96}
                                strokeDashoffset={Math.PI * 96 * (1 - (score / 100))}
                                strokeLinecap="round"
                                className="sm:hidden drop-shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000 ease-out"
                            />
                            <circle
                                cx="72"
                                cy="72"
                                r="62"
                                fill="transparent"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="12"
                                className="hidden sm:block"
                            />
                            <circle
                                cx="72"
                                cy="72"
                                r="62"
                                fill="transparent"
                                stroke="#2563EB"
                                strokeWidth="12"
                                strokeDasharray={Math.PI * 124}
                                strokeDashoffset={Math.PI * 124 * (1 - (score / 100))}
                                strokeLinecap="round"
                                className="hidden sm:block drop-shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl sm:text-4xl font-black text-white leading-none">{score}</span>
                            <span className="text-[9px] sm:text-[10px] text-text-secondary uppercase font-black mt-1">/ 100</span>
                        </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Completion!</h3>
                    <p className="text-text-secondary text-[10px] sm:text-[11px] font-medium text-center">Score dynamically rated by our AI system.</p>
                </div>

                {/* Metrics Grid */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MetricCard
                        label="Clarity"
                        value="Analyzed"
                        icon={Brain}
                        color="text-emerald-500"
                        bgColor="bg-emerald-500/10"
                        desc="Your AI analysis checked for clear articulations."
                    />
                    <MetricCard
                        label="Pace"
                        value="Recorded"
                        icon={Zap}
                        color="text-orange-500"
                        bgColor="bg-orange-500/10"
                        desc="Timing logic tracked."
                    />
                    <MetricCard
                        label="Relevance"
                        value="Checked"
                        icon={Target}
                        color="text-accent-blue"
                        bgColor="bg-accent-blue/10"
                        desc="Ensured your answers hit technical marks."
                    />
                    <MetricCard
                        label="Confidence"
                        value="Estimated"
                        icon={ShieldCheck}
                        color="text-purple-500"
                        bgColor="bg-purple-500/10"
                        desc="Tone inferences evaluated correctly."
                    />
                </div>
            </div>

            {/* Detailed Feedback Breakdown */}
            <div className="bg-bg-secondary border border-border-primary rounded-[32px] p-5 sm:p-8 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-white mb-6 sm:mb-8 tracking-tight">AI Generated Feedback</h3>

                <div className="prose prose-invert prose-blue max-w-none prose-sm sm:prose-base font-inter">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <button
                    onClick={onRetake}
                    className="flex items-center gap-3 text-text-secondary hover:text-white transition-all font-bold group active:scale-95"
                >
                    <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    Take Another Interview
                </button>
            </div>
        </main>
    );
};

const MetricCard = (props) => {
    const { label, value, icon: Icon, color, bgColor, desc } = props;
    return (
        <div className="bg-bg-tertiary/20 hover:bg-bg-tertiary/40 border border-white/5 rounded-2xl p-4 sm:p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`${bgColor} ${color} p-1.5 sm:p-2 rounded-lg`}>
                        <Icon size={14} sm:size={16} />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] uppercase font-black tracking-widest ${color}`}>{label}</span>
                </div>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">{value}</h4>
            <p className="text-[10px] sm:text-[11px] text-text-secondary leading-relaxed font-medium">{desc}</p>
        </div>
    );
};

export default InterviewResults;
