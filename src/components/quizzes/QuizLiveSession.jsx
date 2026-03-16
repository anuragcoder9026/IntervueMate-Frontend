import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, ArrowRight, CheckCircle2, XCircle, RotateCcw, Home, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { submitQuiz, clearQuizResult, submitCustomQuiz, saveQuizProgress } from '../../store/quizSlice';

const QuizLiveSession = ({ challenge, onExit }) => {
    const dispatch = useDispatch();
    const { submitting, quizResult, currentActiveSession } = useSelector((state) => state.quiz);

    const questions = challenge.questions || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState({}); // { questionIndex: selectedOptionId }
    const [isFinished, setIsFinished] = useState(false);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(challenge.duration * 60 || 600);

    // Initialize state if resuming from an active session
    useEffect(() => {
        if (currentActiveSession && currentActiveSession.quiz?._id === challenge._id) {
            const savedAnswers = currentActiveSession.answers || {};
            setAnswers(savedAnswers);

            // Initialize timer from remaining duration if it exists
            if (currentActiveSession.remainingDuration !== null && currentActiveSession.remainingDuration !== undefined) {
                setTimeLeft(currentActiveSession.remainingDuration);
            }

            // Move to the next unanswered question if possible
            const answersCount = Object.keys(savedAnswers).length;
            const attemptedCount = currentActiveSession.attemptedQuestions || answersCount;

            if (attemptedCount < questions.length) {
                setCurrentIndex(attemptedCount);
            }
        }
    }, [currentActiveSession, challenge?._id, questions.length]);

    useEffect(() => {
        if (isFinished || quizResult || submitting) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isFinished, quizResult, submitting]);

    const handleAutoSubmit = () => {
        setIsFinished(true);
        if (challenge._id) {
            dispatch(submitQuiz({ quizId: challenge._id, answers }));
        } else {
            // For custom quizzes that were just generated, we should use the _id from the saved quiz
            dispatch(submitCustomQuiz({ quizId: challenge._id, answers }));
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (optionId) => {
        if (answers[currentIndex]) return; // prevent changing answer after submission if we wanted sequential feedback, but let's allow it before clicking next.
        setSelectedOption(optionId);
    };

    const handleNext = () => {
        if (!selectedOption) return;

        const updatedAnswers = { ...answers, [currentIndex]: selectedOption };
        setAnswers(updatedAnswers);
        setSelectedOption(null);

        if (currentIndex < questions.length - 1) {
            // Only save intermediate progress if we are NOT on the last question
            if (challenge._id) {
                dispatch(saveQuizProgress({
                    quizId: challenge._id,
                    answers: updatedAnswers,
                    remainingDuration: timeLeft
                }));
            }
            setCurrentIndex(prev => prev + 1);
        } else {
            // For the final question, we directly submit which handles the final save and status change
            setIsFinished(true);
            if (challenge._id) {
                dispatch(submitQuiz({ quizId: challenge._id, answers: updatedAnswers }));
            } else {
                dispatch(submitCustomQuiz({ quizId: challenge._id, answers: updatedAnswers }));
            }
        }
    };

    if (submitting || (isFinished && !quizResult)) {
        return (
            <div className="bg-bg-secondary border border-accent-blue/20 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                <Loader className="w-12 h-12 text-accent-blue animate-spin mb-6" />
                <h2 className="text-xl font-bold text-white mb-2">Grading your assessment...</h2>
                <p className="text-text-secondary text-sm">Please wait while we calculate your score and save your progress.</p>
            </div>
        );
    }

    if (quizResult) {
        const { score, total } = quizResult;

        return (
            <div className="bg-bg-secondary border border-accent-blue/20 rounded-2xl p-6 sm:p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-accent-blue" />
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Quiz Completed!</h2>
                <p className="text-text-secondary text-sm mb-8">{challenge.title}</p>

                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="w-32 h-32 rounded-full border-4 border-accent-blue/20 flex items-center justify-center relative mb-4">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                                cx="60" cy="60" r="58"
                                className="fill-none stroke-accent-blue w-full h-full stroke-[4px]"
                                strokeDasharray="364"
                                strokeDashoffset={364 - (364 * score / total)}
                                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                            />
                        </svg>
                        <div className="text-center">
                            <span className="text-4xl font-black text-white">{score}</span>
                            <span className="text-text-secondary">/{total}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-400/10 px-4 py-2 rounded-xl">
                        <CheckCircle2 size={18} />
                        <span>Great Effort!</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => {
                            dispatch(clearQuizResult());
                            setCurrentIndex(0);
                            setAnswers({});
                            setSelectedOption(null);
                            setIsFinished(false);
                            setTimeLeft(challenge.duration * 60 || 600);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors text-sm"
                    >
                        <RotateCcw size={16} /> Retry
                    </button>
                    <button
                        onClick={onExit}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blue-hover text-white font-bold transition-colors shadow-lg shadow-accent-blue/20 text-sm"
                    >
                        <Home size={16} /> Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="bg-bg-secondary border border-accent-blue/20 rounded-2xl p-10 text-center">
                <h2 className="text-xl font-bold text-white mb-2">No questions available</h2>
                <p className="text-text-secondary text-sm mb-8">This quiz has not been fully configured yet.</p>
                <button
                    onClick={onExit}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blue-hover text-white font-bold transition-colors shadow-lg shadow-accent-blue/20 text-sm"
                >
                    <Home size={16} /> Back to Quizzes
                </button>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const progressPercent = ((currentIndex) / questions.length) * 100;

    return (
        <div className="bg-bg-secondary border border-accent-blue/20 rounded-2xl overflow-hidden relative">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1 bg-accent-blue transition-all duration-300" style={{ width: `${progressPercent}%` }} />

            <div className="p-4 sm:p-8">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div>
                        <h3 className="text-white font-bold text-sm sm:text-base">{challenge.title}</h3>
                        <span className="text-text-secondary text-xs font-medium mt-1 inline-block">Question {currentIndex + 1} of {questions.length}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${timeLeft < 60 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-400/10 text-amber-400 border-amber-400/20'}`}>
                        <Clock size={16} />
                        <span className="text-xs font-bold font-mono">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <h2 className="text-white text-lg sm:text-2xl font-bold mb-8 leading-relaxed">
                    {currentQ.question}
                </h2>

                <div className="space-y-3 mb-10">
                    {currentQ.options.map((option) => {
                        const isSelected = selectedOption === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelectOption(option.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left overflow-hidden relative group ${isSelected
                                    ? 'bg-accent-blue/10 border-accent-blue text-white shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                                    : 'bg-bg-tertiary/50 border-white/5 text-text-secondary hover:border-white/20 hover:bg-bg-tertiary hover:text-white'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-accent-blue bg-accent-blue' : 'border-text-secondary/50 group-hover:border-white/50'
                                    }`}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white scale-in" />}
                                </div>
                                <span className="text-sm sm:text-base font-medium">
                                    <span className={`mr-2 font-bold ${isSelected ? 'text-accent-blue' : 'text-text-secondary group-hover:text-white'}`}>{option.id}.</span>
                                    {option.text}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button onClick={onExit} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm">
                        <span>Quit Session</span>
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className={`text-xs sm:text-sm px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all group ${selectedOption
                            ? 'bg-accent-blue hover:bg-accent-blue-hover text-white shadow-lg shadow-accent-blue/20 cursor-pointer'
                            : 'bg-white/5 text-text-secondary cursor-not-allowed'
                            }`}
                    >
                        {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ArrowRight size={18} className={selectedOption ? "group-hover:translate-x-1 transition-transform" : ""} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizLiveSession;
