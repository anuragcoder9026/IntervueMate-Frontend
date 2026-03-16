import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuizTopicPill from '../components/quizzes/QuizTopicPill';
import ChallengeCard from '../components/quizzes/ChallengeCard';
import CreateCustomQuizCard from '../components/quizzes/CreateCustomQuizCard';
import ActiveQuizSession from '../components/quizzes/ActiveQuizSession';
import PerformanceStats from '../components/quizzes/PerformanceStats';
import TopLearners from '../components/quizzes/TopLearners';
import DailyChallengeCard from '../components/quizzes/DailyChallengeCard';
import {
    History,
    Trophy,
    Search,
    Database,
    Code,
    Cpu,
    Brain,
    Globe,
    Layout,
    Loader,
    Inbox
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../store/quizSlice';

import { useNavigate } from 'react-router-dom';

const QuizzesPage = () => {
    const [activeTopic, setActiveTopic] = useState('All Topics');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes, recommendedQuizzes, activeSessions, loading } = useSelector((state) => state.quiz);

    const iconMap = {
        Globe,
        Database,
        Cpu,
        Brain,
        Layout,
        Code
    };

    useEffect(() => {
        dispatch(fetchQuizzes());
    }, [dispatch]);

    // Extract unique topics from fetched quizzes
    const fetchedTopics = quizzes ? Array.from(new Set(quizzes.map(q => q.topic))) : [];
    const topics = ['All Topics', ...fetchedTopics];

    const filteredQuizzes = activeTopic === 'All Topics'
        ? recommendedQuizzes
        : recommendedQuizzes?.filter(q => q.topic === activeTopic);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-inter">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">Quiz & Learning</h1>
                        <p className="text-text-secondary text-xs sm:text-base max-w-xl">
                            Sharpen your technical skills with targeted assessments and real-time performance tracking.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => navigate('/quiz-history')}
                            className="flex items-center gap-2 bg-bg-secondary hover:bg-bg-tertiary px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/5 transition-all text-xs sm:text-sm font-bold"
                        >
                            <History size={16} className="text-accent-blue sm:w-[18px] sm:h-[18px]" />
                            <span>History</span>
                        </button>
                        <button className="flex items-center gap-2 bg-bg-secondary hover:bg-bg-tertiary px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/5 transition-all text-xs sm:text-sm font-bold">
                            <Trophy size={16} className="text-amber-400 sm:w-[18px] sm:h-[18px]" />
                            <span>Leaderboard</span>
                        </button>
                    </div>
                </div>


                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Custom Generator */}
                        <div className="mb-12">
                            <CreateCustomQuizCard />
                        </div>

                        {/* Challenges Grid */}
                        <div className="mb-12">

                            {/* Topic Tabs */}
                            <div className="flex flex-wrap gap-2 pb-4 no-scrollbar">
                                {topics.map((topic) => (
                                    <QuizTopicPill
                                        key={topic}
                                        label={topic}
                                        isActive={activeTopic === topic}
                                        onClick={() => setActiveTopic(topic)}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm sm:text-xl font-bold text-white">Recommended Quizzes</h2>
                                <button className="text-accent-blue text-xs font-black uppercase tracking-widest hover:underline transition-all">View All</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {loading ? (
                                    <div className="col-span-1 md:col-span-2 py-10 flex justify-center text-text-secondary">
                                        <Loader className="animate-spin mb-2" />
                                    </div>
                                ) : filteredQuizzes?.length > 0 ? (
                                    filteredQuizzes.map((quiz) => {
                                        return (
                                            <ChallengeCard
                                                key={quiz._id}
                                                {...quiz}
                                                icon={iconMap[quiz.icon] || Brain}
                                                questions={quiz.questions?.length || 0}
                                                onStartClick={() => navigate('/play-quiz', { state: { challenge: { ...quiz, questions: quiz.questions?.length || 0 } } })}
                                            />
                                        );
                                    })
                                ) : (
                                    <div className="col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center bg-bg-secondary/30 rounded-3xl border border-white/5 border-dashed">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                            <Inbox size={32} className="text-text-secondary/40" />
                                        </div>
                                        <h3 className="text-white font-bold mb-1">No quizzes found</h3>
                                        <p className="text-text-secondary text-sm text-center max-w-[240px]">
                                            We couldn't find any quizzes for <span className="text-accent-blue">{activeTopic}</span> at the moment.
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                        {/* Active Sessions Slider Section */}
                        {activeSessions && activeSessions.length > 0 && (
                            <div className="mt-6 mb-12">
                                <h2 className="text-xl font-bold text-white mb-6">Resume Active Sessions</h2>
                                <ActiveQuizSession sessions={activeSessions} />
                            </div>
                        )}

                        </div>

                    </div>

                    {/* Right Sidebar Area */}
                    <div className="w-full lg:w-80 shrink-0 space-y-8">
                        <PerformanceStats />
                        <TopLearners />
                        <DailyChallengeCard />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default QuizzesPage;
