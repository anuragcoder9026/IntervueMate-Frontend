import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InterviewConfig from '../components/practice/InterviewConfig';
import InterviewLive from '../components/practice/InterviewLive';
import InterviewResults from '../components/practice/InterviewResults';
import InterviewPreparation from '../components/practice/InterviewPreparation';
import InterviewerSelection from '../components/practice/InterviewerSelection';
import { toast } from 'react-toastify';
import { Lightbulb, Sparkles } from 'lucide-react';

const PROCESSING_TIPS = [
    { title: "Body Language", tip: "Maintain eye contact and good posture. Non-verbal cues account for 55% of communication." },
    { title: "STAR Method", tip: "Structure answers: Situation → Task → Action → Result. This keeps responses focused and impactful." },
    { title: "Know Your Resume", tip: "Be ready to discuss every item on your resume in detail, especially recent projects and achievements." },
    { title: "Ask Smart Questions", tip: "Prepare 2-3 thoughtful questions about the team, culture, or challenges. It shows genuine interest." },
    { title: "Handle Nerves", tip: "Take a deep breath before answering. It's perfectly normal to pause and think — interviewers appreciate thoughtfulness." },
    { title: "Quantify Impact", tip: "Use numbers and metrics: 'Improved load time by 40%' is far more powerful than 'Made it faster.'" },
    { title: "Research the Company", tip: "Know the company's mission, recent news, and products. Tie your answers back to how you'd contribute." },
    { title: "Follow Up", tip: "Always send a thank-you email within 24 hours. Reference specific discussion points to stand out." },
];

const ProcessingScreen = () => {
    const [visibleTip, setVisibleTip] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleTip(prev => (prev + 1) % PROCESSING_TIPS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const tip = PROCESSING_TIPS[visibleTip];

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
            {/* Spinner */}
            <div className="relative">
                <div className="w-16 h-16 border-4 border-accent-blue/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent-blue animate-pulse" />
            </div>
            <div className="text-center">
                <p className="text-white font-bold text-lg mb-1">Analyzing Your Performance</p>
                <p className="text-text-secondary text-sm">Our AI is generating detailed, personalized feedback...</p>
            </div>

            {/* Tip Card */}
            <div className="w-full max-w-md bg-bg-secondary border border-border-primary rounded-2xl p-6 animate-in fade-in duration-500" key={visibleTip}>
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={14} className="text-amber-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Interview Tip</span>
                </div>
                <h4 className="text-white font-bold text-sm mb-2">{tip.title}</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{tip.tip}</p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
                {PROCESSING_TIPS.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === visibleTip ? 'bg-accent-blue w-4' : 'bg-white/10'}`}></div>
                ))}
            </div>
        </div>
    );
};

const PracticePage = () => {
    const [phase, setPhase] = useState('config'); // config, prep, interview, results
    const [interviewConfig, setInterviewConfig] = useState(null);
    const [interviewId, setInterviewId] = useState(null);
    const [initialQuestion, setInitialQuestion] = useState("");
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfigSubmit = (config) => {
        setInterviewConfig(config);
        setPhase('prep');
    };

    const handlePrepComplete = () => {
        setPhase('selection');
    };

    const handleStartInterview = async (selectedInterviewer) => {
        const finalConfig = { ...interviewConfig, ...selectedInterviewer };
        setInterviewConfig(finalConfig);
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:5000/api/interview/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(finalConfig)
            });
            const data = await response.json();

            if (data.success) {
                setInterviewId(data.interviewId);
                setInitialQuestion(data.question);
                setPhase('interview');
            } else {
                toast.error("Failed to start interview: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error starting interview:", error);
            toast.error("Error starting the interview session.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEndInterview = async (id) => {
        setPhase('processing');
        try {
            const response = await fetch('http://localhost:5000/api/interview/finish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify({ interviewId: id || interviewId })
            });

            const data = await response.json();
            if (data.success && data.feedbackId) {
                navigate(`/interview/feedback/${data.feedbackId}`);
            } else if (data.success && data.feedback) {
                // Fallback for old feedback format currently in DB if it arises during testing
                toast.error("Format changed: Legacy feedback found.");
                setPhase('results');
            } else {
                toast.error(data.error || "Failed to finalize session.");
                setPhase('config');
            }
        } catch (err) {
            console.error("Error fetching results", err);
            toast.error("Network error saving results.");
            setPhase('config');
        }
    };

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary font-inter overflow-x-hidden">
            <Navbar />

            {phase === 'config' && (
                <InterviewConfig onStart={handleConfigSubmit} />
            )}

            {phase === 'prep' && (
                <InterviewPreparation
                    config={interviewConfig}
                    onConfirm={handlePrepComplete}
                />
            )}

            {phase === 'selection' && (
                <InterviewerSelection
                    onSelect={handleStartInterview}
                    isSubmitting={isSubmitting}
                />
            )}

            {phase === 'interview' && (
                <InterviewLive
                    onEnd={handleEndInterview}
                    interviewId={interviewId}
                    initialQuestion={initialQuestion}
                    config={interviewConfig}
                />
            )}

            {phase === 'processing' && (
                <ProcessingScreen />
            )}

            {phase === 'results' && (
                <InterviewResults
                    onRetake={() => setPhase('config')}
                    interviewId={interviewId}
                />
            )}
        </div>
    );
};

export default PracticePage;
