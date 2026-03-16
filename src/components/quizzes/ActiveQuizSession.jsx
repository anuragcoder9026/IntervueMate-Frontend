import React, { useState } from 'react';
import { Clock, AlertCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActiveQuizCard = ({ session }) => {
    const navigate = useNavigate();
    if (!session || !session.quiz) return null;

    const quiz = session.quiz;
    const progress = Math.round((session.attemptedQuestions / session.totalQuestions) * 100);

    // Show the last answered question if it exists, otherwise the first
    const displayIndex = session.attemptedQuestions > 0
        ? session.attemptedQuestions - 1
        : 0;

    const displayQuestion = quiz.questions?.[displayIndex];
    const selectedOption = session.answers?.[displayIndex];

    return (
        <div className="bg-bg-secondary border border-accent-blue/20 rounded-2xl overflow-hidden relative shadow-2xl h-full flex flex-col">
            {/* Progress Bar */}
            <div
                className="absolute top-0 left-0 h-1 bg-accent-blue transition-all duration-700"
                style={{ width: `${progress}%` }}
            />

            <div className="p-6 sm:p-10 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
                    <div>
                        <h3 className="text-white font-black text-sm sm:text-lg tracking-tight">{quiz.title}</h3>
                        <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                            {session.attemptedQuestions > 0 ? `LAST ANSWERED: QUESTION ${displayIndex + 1}` : 'NOT STARTED YET'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-widest">SCORE: {session.score || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-blue/20 bg-accent-blue/10 text-accent-blue shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-widest">{progress}% DONE</span>
                        </div>
                    </div>
                </div>

                {displayQuestion && (
                    <div className="mb-6 animate-fade-in flex-1">
                        <h2 className="text-white text-base sm:text-xl font-black mb-6 leading-relaxed tracking-tight line-clamp-2">
                            {displayQuestion.question}
                        </h2>

                        <div className="space-y-2">
                            {displayQuestion.options.slice(0, 4).map((option) => {
                                const isSelected = selectedOption === option.id;
                                return (
                                    <div
                                        key={option.id}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left relative overflow-hidden ${isSelected
                                            ? 'bg-accent-blue/10 border-accent-blue text-white'
                                            : 'bg-bg-tertiary/50 border-white/5 text-text-secondary opacity-60'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-accent-blue bg-accent-blue' : 'border-text-secondary/50'
                                            }`}>
                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium truncate">
                                            <span className={`mr-1 font-bold ${isSelected ? 'text-accent-blue' : 'text-text-secondary'}`}>{option.id}.</span>
                                            {option.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-4 text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-accent-blue" />
                            <span>{quiz.duration} MINS</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/play-quiz', { state: { challenge: { ...quiz, questions: quiz.questions?.length || session.totalQuestions } } })}
                        className="text-[10px] sm:text-xs bg-accent-blue hover:bg-accent-blue-hover text-white px-5 py-2.5 rounded-lg font-black flex items-center gap-2 transition-all shadow-xl shadow-accent-blue/20 group"
                    >
                        RESUME <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ActiveQuizSession = ({ sessions = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!sessions || sessions.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sessions.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + sessions.length) % sessions.length);
    };

    return (
        <div className="relative group">
            {/* Cards Container */}
            <div className="overflow-hidden rounded-2xl">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {sessions.map((session, index) => (
                        <div key={session._id} className="w-full shrink-0 px-1">
                            <ActiveQuizCard session={session} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {sessions.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center text-white hover:bg-accent-blue hover:border-accent-blue transition-all z-10 shadow-2xl opacity-0 group-hover:opacity-100 group-hover:-translate-x-4"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center text-white hover:bg-accent-blue hover:border-accent-blue transition-all z-10 shadow-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-4"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-4">
                        {sessions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all ${currentIndex === index ? 'w-8 bg-accent-blue' : 'w-2 bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ActiveQuizSession;
