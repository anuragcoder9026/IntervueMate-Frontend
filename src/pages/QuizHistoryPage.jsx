import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAttempts } from '../store/quizSlice';
import {
    History,
    Calendar,
    Trophy,
    HelpCircle,
    ArrowLeft,
    ChevronRight,
    Loader,
    Brain,
    Globe,
    Database,
    Cpu,
    Layout,
    Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizHistoryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userAttempts, loading } = useSelector((state) => state.quiz);

    const iconMap = {
        Globe,
        Database,
        Cpu,
        Brain,
        Layout,
        Code
    };

    useEffect(() => {
        dispatch(fetchMyAttempts());
    }, [dispatch]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-inter">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <button
                    onClick={() => navigate('/quizzes')}
                    className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Quizzes</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue">
                                <History size={24} />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Quiz History</h1>
                        </div>
                        <p className="text-text-secondary text-sm sm:text-base max-w-xl">
                            Review your past core performances and track your technical growth over time.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-10 h-10 text-accent-blue animate-spin mb-4" />
                        <p className="text-text-secondary font-medium">Retrieving your attempt history...</p>
                    </div>
                ) : userAttempts.length > 0 ? (
                    <div className="space-y-4">
                        {userAttempts.map((attempt) => {
                            const QuizIcon = iconMap[attempt.quiz?.icon] || Brain;
                            const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);

                            return (
                                <div
                                    key={attempt._id}
                                    className="bg-bg-secondary border border-white/5 rounded-2xl p-5 sm:p-6 hover:border-accent-blue/20 transition-all group"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                        <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${attempt.quiz?.iconBg || 'bg-indigo-500/10 text-indigo-400'}`}>
                                            <QuizIcon size={28} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between">
                                                <span className="text-white font-bold text-lg mb-1 truncate group-hover:text-accent-blue transition-colors mr-2">
                                                    {attempt.quiz?.title || 'Personalized Assessment'}
                                                </span>
                                                {attempt.status && attempt.status === 'active' &&
                                                    <span className="text-right ">
                                                        <span className="px-3  py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                                                            Active
                                                        </span>
                                                        <span className="ml-2 text-[11px] font-bold text-text-secondary mt-1">
                                                            In Progress
                                                        </span>
                                                    </span>

                                                }
                                            </div>
                                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                    <Calendar size={14} className="text-accent-blue" />
                                                    <span>{formatDate(attempt.completedAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                                    <HelpCircle size={14} className="text-accent-blue" />
                                                    <span>{attempt.totalQuestions} Questions</span>
                                                </div>
                                                <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/5 text-text-secondary border border-white/5">
                                                    {attempt.quiz?.difficulty || 'MEDIUM'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 sm:pl-6 sm:border-l border-white/5">
                                            {attempt.status !== 'active' && (
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-white leading-none mb-1">
                                                        {attempt.score}<span className="text-text-secondary text-sm font-bold ml-1">/{attempt.totalQuestions}</span>
                                                    </div>
                                                    <div className={`text-[11px] font-black uppercase tracking-widest ${percentage >= 70 ? 'text-emerald-400' : percentage >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                        {percentage}% Score
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (attempt.status === 'active') {
                                                        navigate('/play-quiz', { state: { challenge: { ...attempt.quiz, questions: attempt.quiz?.questions?.length || attempt.totalQuestions } } });
                                                    }
                                                }}
                                                className={`w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center group-hover:border-accent-blue/30 transition-all ${attempt.status === 'active' ? 'cursor-pointer' : ''}`}
                                            >
                                                <ChevronRight size={20} className="text-text-secondary group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-bg-secondary border border-white/5 rounded-3xl p-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <Trophy size={40} className="text-white/20" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No attempts found</h2>
                        <p className="text-text-secondary text-sm max-w-xs mx-auto mb-8">
                            You haven't completed any quizzes yet. Start your first assessment to begin tracking your progress.
                        </p>
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="bg-accent-blue hover:bg-accent-blue-hover text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-accent-blue/20"
                        >
                            Explore Quizzes
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default QuizHistoryPage;
