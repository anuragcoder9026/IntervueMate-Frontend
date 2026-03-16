import React, { useState, useRef } from 'react';
import { Play, Check, Volume2, Loader2, Square } from 'lucide-react';
import { SarvamAIClient } from "sarvamai";
import { toast } from 'react-toastify';

const client = new SarvamAIClient({
    apiSubscriptionKey: import.meta.env.VITE_SARVAM_API_KEY
});

const rawData = [
    { name: 'Shubh', gender: 'male', desc: 'Friendly default voice', imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ritu', gender: 'female', desc: 'Soft, approachable voice', imgUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
    { name: 'Amit', gender: 'male', desc: 'Formal voice', imgUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
    { name: 'Sumit', gender: 'male', desc: 'Balanced warmth with professionalism', imgUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
    { name: 'Pooja', gender: 'female', desc: 'Encouraging voice', imgUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
    { name: 'Manan', gender: 'male', desc: 'Consistence voice', imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Simran', gender: 'female', desc: 'Warm Voice', imgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
    { name: 'Rahul', gender: 'male', desc: 'Composed voice with builds trust', imgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    { name: 'Kavya', gender: 'female', desc: 'Everyday conversational tone', imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ratan', gender: 'male', desc: 'Sharp articulation for clarity', imgUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200' },
    { name: 'Priya', gender: 'female', desc: 'Upbeat voice with personality', imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ishita', gender: 'female', desc: 'Polished voice', imgUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
    { name: 'Shreya', gender: 'female', desc: 'Precise pronunciation and enunciation', imgUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200' },
    { name: 'Shruti', gender: 'female', desc: 'Sweet and melodious voice', imgUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=200' },
    { name: 'Aditya', gender: 'male', desc: 'Captivating voice', imgUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' },
    { name: 'Ashutosh', gender: 'male', desc: 'Traditional narration voice', imgUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=200' },
    { name: 'Advait', gender: 'male', desc: 'Contemporary voice', imgUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200' },
    { name: 'Roopa', gender: 'female', desc: 'Gentile voice', imgUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=200' },
    { name: 'Tanya', gender: 'female', desc: 'Friendly and modern voice', imgUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200' },
    { name: 'Gokul', gender: 'male', desc: 'Trustworthy and dependable voice', imgUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=200' },
    { name: 'Suhani', gender: 'female', desc: 'Pleasant and soothing voice', imgUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200' },
    { name: 'Kavitha', gender: 'female', desc: 'Graceful and articulate voice', imgUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200' }
];

const INTERVIEWERS = rawData.map(data => {
    return {
        id: data.name.toLowerCase(),
        interviewerName: data.name,
        interviewerVoice: data.name.toLowerCase(),
        interviewerTone: data.desc,
        interviewerSpeed: 'Normal',
        interviewerImage: data.imgUrl
    };
});

const InterviewerSelection = ({ onSelect, isSubmitting }) => {
    const [selectedId, setSelectedId] = useState(INTERVIEWERS[0].id);
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(null);

    const handleConfirm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const selected = INTERVIEWERS.find(i => i.id === selectedId);
        onSelect(selected);
    };

    const handlePlayVoice = async (e, interviewer) => {
        e.stopPropagation();

        if (playingId === interviewer.id) {
            if (audioRef.current) {
                audioRef.current.pause();
                setPlayingId(null);
            }
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        setPlayingId('loading-' + interviewer.id);

        try {
            const text = `Hello, I am ${interviewer.interviewerName}. I will be your interviewer today.`;
            const response = await client.textToSpeech.convert({
                text: text,
                model: "bulbul:v3",
                speaker: interviewer.interviewerVoice,
                target_language_code: "en-IN"
            });

            if (response.audios && response.audios.length > 0) {
                const audio = new Audio(`data:audio/wav;base64,${response.audios[0]}`);
                audioRef.current = audio;

                audio.onended = () => {
                    setPlayingId(null);
                };
                audio.onerror = () => {
                    setPlayingId(null);
                    toast.error("Audio playback error.");
                }

                setPlayingId(interviewer.id);
                await audio.play();
            } else {
                setPlayingId(null);
                toast.error("Failed to load voice.");
            }
        } catch (error) {
            console.error("Voice Sample error:", error);
            setPlayingId(null);

            // Temporary fallback using browser TTS so users can still preview something
            const msg = new SpeechSynthesisUtterance(`Hello, I am ${interviewer.interviewerName}. I will be your interviewer today.`);
            msg.onend = () => setPlayingId(null);
            setPlayingId(interviewer.id);
            window.speechSynthesis.speak(msg);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 mb-20 font-inter animate-in slide-in-from-bottom-5 duration-500">
            <div className="mb-10 text-center border-b border-border-primary pb-8">
                <h1 className="text-3xl font-bold text-white mb-3">Choose Your Interviewer</h1>
                <p className="text-text-secondary text-sm max-w-xl mx-auto">Select the AI persona that best fits the interview style you want to practice. Their voice tone and speed will adapt to match the selected persona.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {INTERVIEWERS.map(interviewer => (
                    <div
                        key={interviewer.id}
                        onClick={() => !isSubmitting && setSelectedId(interviewer.id)}
                        className={`bg-[#0F172A] border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center
                            ${selectedId === interviewer.id ? 'border-[#2563EB] shadow-[0_0_20px_rgba(37,99,235,0.25)] scale-[1.02]' : 'border-border-primary hover:border-gray-500'}
                            ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <button
                            onClick={(e) => handlePlayVoice(e, interviewer)}
                            className="absolute top-3 left-3 bg-[#1e293b] hover:bg-[#334155] border border-gray-600 text-white rounded-full p-2 transition-all z-10 shadow-lg"
                            title={playingId === interviewer.id ? "Stop voice" : "Listen to voice sample"}
                        >
                            {playingId === 'loading-' + interviewer.id ? (
                                <Loader2 size={14} className="animate-spin text-blue-400" />
                            ) : playingId === interviewer.id ? (
                                <Square size={14} className="text-red-400 fill-red-400 animate-pulse" />
                            ) : (
                                <Volume2 size={14} className="text-gray-400 hover:text-white" />
                            )}
                        </button>

                        {selectedId === interviewer.id && (
                            <div className="absolute top-3 right-3 bg-[#2563EB] text-white rounded-full p-1 shadow-lg z-10">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        )}

                        <div className={`relative w-20 h-20 rounded-full border-[3px] mb-4 p-1 transition-colors ${selectedId === interviewer.id ? 'border-[#2563EB]' : 'border-gray-600'}`}>
                            <img src={interviewer.interviewerImage} alt={interviewer.interviewerName} className="w-full h-full object-cover rounded-full" />
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{interviewer.interviewerName}</h3>
                        <p className={`text-[10px] font-bold tracking-wider uppercase leading-tight mb-4 flex-1 ${selectedId === interviewer.id ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                            {interviewer.interviewerTone}
                        </p>

                        <div className="w-full bg-black/40 rounded-xl p-3 flex flex-col gap-2 border border-white/5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-[#94A3B8] font-medium">Voice Code:</span>
                                <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{interviewer.interviewerVoice}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
                <div className="pointer-events-auto shadow-[0_0_40px_rgba(15,23,42,0.8)] rounded-xl">
                    <button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="bg-[#10B981] hover:bg-[#059669] disabled:bg-gray-600 text-white px-12 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.6)] transform hover:-translate-y-1"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Play size={20} fill="currentColor" />
                        )}
                        {isSubmitting ? 'Preparing Session...' : 'Start Interview'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewerSelection;
