import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Layers, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateCustomQuizCard = () => {
    const navigate = useNavigate();
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState(10);
    const [difficulty, setDifficulty] = useState('MEDIUM');

    const handleStart = () => {
        if (!topic.trim()) return;

        const customChallenge = {
            title: `${topic}`,
            difficulty,
            description: `A personalized ${difficulty.toLowerCase()} difficulty quiz focusing on ${topic}.`,
            questions: parseInt(questions),
            duration: parseInt(questions) * 2, // 2 mins per question
            attempts: '0',
            isCustom: true
        };

        navigate('/play-quiz', { state: { challenge: customChallenge } });
    };

    return (
        <div className="bg-[#171c28] border border-accent-blue/30 rounded-2xl p-6 relative overflow-hidden group shadow-lg shadow-accent-blue/5">
            {/* Background Effects */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-blue/20 rounded-full blur-3xl group-hover:bg-accent-blue/30 transition-all pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue ring-1 ring-accent-blue/30">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Create Custom Quiz</h3>
                    <p className="text-[#a3aed0] text-xs">Generate a personalized AI assessment</p>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#a3aed0] uppercase tracking-wider pl-1">Topic / Technology</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BrainCircuit size={16} className="text-[#a3aed0]" />
                        </div>
                        <input
                            type="text"
                            placeholder="e.g., React Hooks, AWS, System Design..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full bg-[#0F1523] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-colors placeholder:text-white/20"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="space-y-1.5 flex-1">
                        <label className="text-[11px] font-black text-[#a3aed0] uppercase tracking-wider pl-1">Questions</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Layers size={14} className="text-[#a3aed0]" />
                            </div>
                            <select
                                value={questions}
                                onChange={(e) => setQuestions(e.target.value)}
                                className="w-full bg-[#0F1523] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-colors appearance-none"
                            >
                                <option value={5}>5 Questions</option>
                                <option value={10}>10 Questions</option>
                                <option value={15}>15 Questions</option>
                                <option value={20}>20 Questions</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                        <label className="text-[11px] font-black text-[#a3aed0] uppercase tracking-wider pl-1">Difficulty</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Target size={14} className="text-[#a3aed0]" />
                            </div>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full bg-[#0F1523] border border-white/5 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-colors appearance-none"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    disabled={!topic.trim()}
                    className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm ${topic.trim() ? 'bg-accent-blue hover:bg-accent-blue-hover text-white shadow-accent-blue/20 cursor-pointer' : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                        }`}
                >
                    <Sparkles size={16} /> Generate & Start Quiz
                </button>
            </div>
        </div>
    );
};

export default CreateCustomQuizCard;
