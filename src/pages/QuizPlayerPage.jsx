import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuizLiveSession from '../components/quizzes/QuizLiveSession';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizById, clearCurrentQuiz, generateCustomQuiz, startQuiz } from '../store/quizSlice';
import { ArrowLeft, Loader, AlertCircle, RefreshCw } from 'lucide-react';

const DEFAULT_CHALLENGE = {
    title: 'Data Structures & Algorithms Basics',
    duration: 30, // 30 minutes
};

const QuizPlayerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const challenge = location.state?.challenge;
    const quizId = challenge?._id;
    const { currentQuiz, loading, generating, error } = useSelector((state) => state.quiz);
    const loadStarted = React.useRef(false);

    // Clear quiz only on unmount
    React.useEffect(() => {
        return () => {
            dispatch(clearCurrentQuiz());
        };
    }, [dispatch]);

    React.useEffect(() => {
        if (loadStarted.current) return;

        if (quizId && !loading && !currentQuiz && !error) {
            loadStarted.current = true;
            dispatch(fetchQuizById(quizId));
            dispatch(startQuiz(quizId));
        } else if (challenge?.isCustom && !generating && !currentQuiz && !error) {
            loadStarted.current = true;
            dispatch(generateCustomQuiz({
                topic: challenge.title,
                difficulty: challenge.difficulty,
                questionsCount: challenge.questions
            }));
        }
    }, [dispatch, quizId, loading, challenge?.title, challenge?.difficulty, challenge?.questions, generating, currentQuiz, error]);

    if (!quizId && !challenge?.isCustom) {
        navigate('/quizzes');
        return null;
    }

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-inter flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 lg:py-16">

                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/quizzes')}
                            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold uppercase tracking-widest">Back to Quizzes</span>
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                            Live Assessment Environment
                        </h1>
                        <p className="text-text-secondary text-sm sm:text-base mt-2">
                            Stay focused. Do not refresh this page during your active attempt.
                        </p>
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white mb-3">Something went wrong!</h2>
                        <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto mb-8">
                            We encountered an issue while {generating ? 'generating your quiz' : 'loading the assessment'}. Please try again later or choose another topic.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
                            >
                                <RefreshCw size={18} /> Retry
                            </button>
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="px-6 py-3 rounded-xl bg-accent-blue hover:bg-accent-blue-hover text-white font-bold transition-all shadow-lg shadow-accent-blue/20"
                            >
                                Browse Other Quizzes
                            </button>
                        </div>
                    </div>
                ) : (loading || generating || !currentQuiz) ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-8 h-8 text-accent-blue animate-spin mb-4" />
                        <p className="text-text-secondary">
                            {generating ? 'AI is crafting your personalized assessment...' : 'Loading your quiz environment...'}
                        </p>
                    </div>
                ) : (
                    <QuizLiveSession
                        challenge={currentQuiz}
                        onExit={() => navigate('/quizzes')}
                    />
                )}

            </main>

            <Footer />
        </div>
    );
};

export default QuizPlayerPage;
