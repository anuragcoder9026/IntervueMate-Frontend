import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Target, Mic, MicOff, Video, VideoOff, Loader, MessageSquare, Lightbulb, ChevronRight, Keyboard, X } from 'lucide-react';
import { SarvamAIClient } from "sarvamai";
import { toast } from 'react-toastify';

const client = new SarvamAIClient({
    apiSubscriptionKey: import.meta.env.VITE_SARVAM_API_KEY
});

// Context-aware tips based on question phase
const TIPS_MAP = {
    intro: [
        "Keep your introduction under 2 minutes",
        "Mention your name, current role, and key expertise",
        "Highlight 1-2 achievements relevant to the position",
        "End with why you're excited about this opportunity"
    ],
    main: [
        "Use the STAR method: Situation, Task, Action, Result",
        "Be specific — use numbers, metrics, and real examples",
        "Think aloud if you need a moment to gather thoughts",
        "Keep answers focused and under 3 minutes"
    ],
    followup: [
        "Expand on the specific aspect the interviewer is probing",
        "It's okay to add new details you didn't mention before",
        "Stay consistent with your previous answer",
        "Be honest if you don't have a specific example"
    ],
    closure: [
        "Ask 1-2 thoughtful questions about the role or team",
        "Thank the interviewer for their time",
        "Reiterate your enthusiasm for the position",
        "Mention a specific thing you learned during the interview"
    ]
};

// Tiny sound generator (no external files needed)
const playSound = (type) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.08;

        if (type === 'start') {
            osc.frequency.value = 520;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } else if (type === 'turn') {
            osc.frequency.value = 660;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.25);
        } else if (type === 'end') {
            osc.frequency.value = 440;
            osc.type = 'triangle';
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.8);
        }
    } catch (e) { /* silent fail */ }
};

const InterviewLive = ({ onEnd, interviewId, initialQuestion, config }) => {
    const [timeLeft, setTimeLeft] = useState(1200);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [question, setQuestion] = useState(initialQuestion || "");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [questionType, setQuestionType] = useState('intro');
    const [mainQuestionNum, setMainQuestionNum] = useState(0);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [showTips, setShowTips] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(true);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [streamingText, setStreamingText] = useState('');
    const [isStreamingAI, setIsStreamingAI] = useState(false);
    const [isClosurePhase, setIsClosurePhase] = useState(false);

    const [chatHistory, setChatHistory] = useState([]);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [userStream, setUserStream] = useState(null);
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const latestTranscriptRef = useRef('')
    const audioRef = useRef(null);
    const activeStreamRef = useRef(null);
    const volumeAnalyserRef = useRef(null);
    const volumeAnimRef = useRef(null);
    const hasPlayedStartRef = useRef(false);
    const pendingAITextRef = useRef(null);
    const streamingTimerRef = useRef(null);

    // Request camera on mount + Confidence meter analyser
    useEffect(() => {
        let isMounted = true;
        const getMedia = async () => {
            try {
                let stream;
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                } catch (camErr) {
                    console.warn("Camera failed or denied, trying audio only", camErr);
                    stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                    setIsVideoOn(false);
                }

                if (isMounted) {
                    activeStreamRef.current = stream;
                    setUserStream(stream);

                    // Setup volume analyser for confidence meter
                    try {
                        const actx = new (window.AudioContext || window.webkitAudioContext)();
                        const analyser = actx.createAnalyser();
                        const source = actx.createMediaStreamSource(stream);
                        source.connect(analyser);
                        analyser.fftSize = 256;
                        volumeAnalyserRef.current = analyser;
                        const dataArray = new Uint8Array(analyser.frequencyBinCount);

                        const tick = () => {
                            if (!isMounted) return;
                            analyser.getByteFrequencyData(dataArray);
                            let sum = 0;
                            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                            const avg = sum / dataArray.length;
                            setVolumeLevel(Math.min(avg / 60, 1));
                            volumeAnimRef.current = requestAnimationFrame(tick);
                        };
                        tick();
                    } catch (e) { /* audio context unsupported */ }

                    // Play start chime
                    if (!hasPlayedStartRef.current) {
                        hasPlayedStartRef.current = true;
                        playSound('start');
                    }
                } else {
                    stream.getTracks().forEach(t => t.stop());
                }
            } catch (err) {
                console.error("Failed to access camera/mic:", err);
            }
        };
        getMedia();
        return () => {
            isMounted = false;
            if (volumeAnimRef.current) cancelAnimationFrame(volumeAnimRef.current);
            if (activeStreamRef.current) activeStreamRef.current.getTracks().forEach(t => t.stop());
            if (recognitionRef.current) recognitionRef.current.stop();
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    const toggleVideo = () => {
        if (userStream) {
            const videoTracks = userStream.getVideoTracks();
            if (videoTracks.length > 0) {
                videoTracks.forEach(track => {
                    track.enabled = !isVideoOn;
                });
                setIsVideoOn(!isVideoOn);
            } else {
                toast.error("No camera available or permission denied.");
            }
        }
    };

    const videoRefCallback = useCallback((node) => {
        if (node && userStream) {
            node.srcObject = userStream;
        }
    }, [userStream]);

    // Auto-scroll chat history (also during streaming and loading) — scoped to chat panel only
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, interimTranscript, streamingText, isSpeaking, isLoading]);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) handleEndSession();
    }, [timeLeft, interviewId]);

    const handleEndSession = () => {
        playSound('end');
        if (userStream) {
            userStream.getTracks().forEach(t => t.stop());
        }
        if (activeStreamRef.current) {
            activeStreamRef.current.getTracks().forEach(t => t.stop());
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeAttribute('src');
        }
        if (volumeAnimRef.current) cancelAnimationFrame(volumeAnimRef.current);
        window.speechSynthesis.cancel();

        onEnd(interviewId);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.code === 'Escape') {
                e.preventDefault();
                handleEndSession();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [userStream, interviewId]);

    // Auto-hide shortcut hint after 8s
    useEffect(() => {
        const t = setTimeout(() => setShowShortcuts(false), 8000);
        return () => clearTimeout(t);
    }, []);

    const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

    // Speech Recognition setup
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        // Play turn sound
        playSound('turn');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
            setInterimTranscript('');
            latestTranscriptRef.current = '';
        };

        recognition.onresult = (event) => {
            let finalText = '';
            let interimText = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalText += event.results[i][0].transcript;
                } else {
                    interimText += event.results[i][0].transcript;
                }
            }

            if (finalText) {
                const newFull = latestTranscriptRef.current + " " + finalText;
                latestTranscriptRef.current = newFull;
                setTranscript(newFull);
            }
            setInterimTranscript(interimText);

            // Reset silence timer every time we hear something
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
                // User stopped speaking for 3 seconds
                recognition.stop();
            }, 3000);
        };

        recognition.onend = () => {
            setIsListening(false);
            clearTimeout(silenceTimerRef.current);
            // If we have collected speech, submit it automatically
            if (latestTranscriptRef.current.trim()) {
                submitAnswer(latestTranscriptRef.current.trim());
            } else {
                if (!isLoading && !isSpeaking) {
                    setTimeout(() => {
                        if (!isSpeaking && !isLoading) recognitionRef.current?.start();
                    }, 1000);
                }
            }
        };

        recognition.onerror = (e) => {
            console.error("Speech Recog Error:", e.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        clearTimeout(silenceTimerRef.current);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const submitAnswer = async (textToSubmit) => {
        if (!textToSubmit) return;

        // If in closure phase, check if user explicitly confirmed ending
        if (isClosurePhase) {
            const lower = textToSubmit.toLowerCase().trim();
            const words = lower.split(/\s+/);

            // Phrases that explicitly mean "end the interview" (including common STS typos)
            const endPhrases = [
                'end session', 'end interview', "let's end", 'no question', 'no questions',
                "that's all", 'that is all', 'i am done', "i'm done", 'nothing', 'nope',
                'goodbye', 'bye', 'buy', 'wrap it up', 'wrap up', "no i don't", 'no i do not',
                'no more', 'we can end', 'i have no', 'none', 'i do not have any'
            ];

            const hasStrongEnd = endPhrases.some(sp => lower.includes(sp));

            // If it's a short response containing thanks, bye, or no
            const isShortEnd = words.length <= 6 && ['bye', 'buy', 'goodbye', 'thanks', 'thank', 'nope', 'no'].some(w => words.includes(w));

            // If user explicitly asks a question, don't end — UNLESS they clearly said "no question"
            const isAskingQuestion = (lower.includes('ask') || lower.includes('question') || lower.includes('curious'))
                && !lower.includes('no question')
                && !lower.includes('no further');

            // Strong ends override the 'isAskingQuestion' check
            if (hasStrongEnd || (isShortEnd && !isAskingQuestion)) {
                handleEndSession();
                return;
            }
            // User has more to say (or asked a question) — send to AI
        }

        setIsLoading(true);
        setIsListening(false);

        // Add user response to chat history immediately
        setChatHistory(prev => [...prev, { role: 'user', text: textToSubmit }]);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/interview/next`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ interviewId, transcript: textToSubmit, timeLeft })
            });

            const data = await response.json();
            if (data.success) {
                // Store AI text as pending — don't add to chatHistory yet
                // It will be added when TTS audio is ready to play
                pendingAITextRef.current = data.question;
                setQuestion(data.question);
                setTranscript('');
                latestTranscriptRef.current = '';
                setQuestionType(data.questionType || 'followup');
                // Update mainQuestionNum: use returned mainNum for main questions,
                // keep current value for follow-ups (don't reset to 0)
                if (data.mainNum && data.mainNum > 0) {
                    setMainQuestionNum(data.mainNum);
                }

                // Mark closure phase but DON'T auto-end
                if (data.questionType === 'closure') {
                    setIsClosurePhase(true);
                }
            } else {
                toast.error("Failed to get next question: " + (data.error || "Unknown error"));
                startListening();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error communicating with server.");
            startListening();
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-speak new questions
    useEffect(() => {
        if (question && !isLoading) {
            stopListening();
            // Always just speak — no auto-ending on closure
            speakQuestion(question);
        }
    }, [question, isLoading, questionType, interviewId, onEnd]);

    // Helper: start streaming words into chat
    const startWordStream = (fullText, audioDuration) => {
        const words = fullText.split(/\s+/);
        if (words.length === 0) return;
        // Calculate interval: spread words across ~90% of audio duration
        const totalMs = audioDuration ? audioDuration * 900 : words.length * 120;
        const interval = Math.max(50, totalMs / words.length);
        let wordIndex = 0;
        setStreamingText('');
        setIsStreamingAI(true);

        streamingTimerRef.current = setInterval(() => {
            wordIndex++;
            if (wordIndex >= words.length) {
                clearInterval(streamingTimerRef.current);
                streamingTimerRef.current = null;
                // Move completed streaming text into chatHistory
                setIsStreamingAI(false);
                setStreamingText('');
                setChatHistory(prev => [...prev, { role: 'ai', text: fullText }]);
            } else {
                setStreamingText(words.slice(0, wordIndex + 1).join(' '));
            }
        }, interval);
    };

    // Helper: stop streaming and finalize text
    const finalizeStream = (fullText) => {
        if (streamingTimerRef.current) {
            clearInterval(streamingTimerRef.current);
            streamingTimerRef.current = null;
        }
        setIsStreamingAI(false);
        setStreamingText('');
        // Only add if not already in history
        setChatHistory(prev => {
            const lastAI = prev.filter(m => m.role === 'ai').pop();
            if (lastAI && lastAI.text === fullText) return prev;
            return [...prev, { role: 'ai', text: fullText }];
        });
    };

    const speakQuestion = async (text, onComplete) => {
        setIsSpeaking(true);
        try {
            const response = await client.textToSpeech.convert({
                text: text,
                model: "bulbul:v3",
                speaker: config?.interviewerVoice || "manan",
                target_language_code: "en-IN"
            });

            if (response.audios && response.audios.length > 0) {
                const audio = new Audio(`data:audio/wav;base64,${response.audios[0]}`);
                audioRef.current = audio;
                pendingAITextRef.current = null;

                // Get audio duration for word timing sync
                audio.onloadedmetadata = () => {
                    startWordStream(text, audio.duration);
                };

                audio.onended = () => {
                    finalizeStream(text);
                    setIsSpeaking(false);
                    if (onComplete) onComplete();
                    else startListening();
                };
                audio.onerror = () => {
                    finalizeStream(text);
                    setIsSpeaking(false);
                    if (onComplete) onComplete();
                    else startListening();
                };
                await audio.play();
                // Fallback if onloadedmetadata didn't fire (data URI)
                if (!streamingTimerRef.current) {
                    startWordStream(text, null);
                }
            } else {
                // No audio — show text immediately
                pendingAITextRef.current = null;
                setChatHistory(prev => [...prev, { role: 'ai', text }]);
                setIsSpeaking(false);
                if (onComplete) onComplete();
                else startListening();
            }
        } catch (error) {
            console.error("TTS Fallback", error);
            pendingAITextRef.current = null;
            setChatHistory(prev => [...prev, { role: 'ai', text }]);
            setIsSpeaking(false);
            const msg = new SpeechSynthesisUtterance(text);
            msg.onend = () => {
                setIsSpeaking(false);
                if (onComplete) onComplete();
                else startListening();
            };
            window.speechSynthesis.speak(msg);
        }
    };

    // Progress calculation: intro=0%, Q1=20%, Q2=40%, Q3=60%, Q4=80%, Q5=100%
    const progressPercent = questionType === 'intro' ? 0
        : questionType === 'closure' ? 100
            : Math.min((mainQuestionNum / 5) * 100, 100);

    // Progress label
    const progressLabel = questionType === 'intro' ? "Introduction"
        : questionType === 'closure' ? "Closing"
            : questionType === 'followup' ? `Follow-up (Q${mainQuestionNum})`
                : mainQuestionNum > 0 ? `Question ${mainQuestionNum} of 5`
                    : "Introduction";
    const currentTips = TIPS_MAP[questionType === 'main' ? 'main' : questionType] || TIPS_MAP.main;

    // Confidence meter bars
    const volumeBars = Array.from({ length: 20 }, (_, i) => {
        const threshold = i / 20;
        const active = volumeLevel > threshold && isListening;
        return active;
    });

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 animate-in slide-in-from-bottom-5 duration-500 mb-20">
            {/* Top Navigation Bar */}
            <div className="bg-bg-secondary p-4 rounded-2xl border border-border-primary flex items-center justify-between mb-6 shadow-sm gap-4 lg:gap-8">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Progress</span>
                        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">
                            {progressLabel}
                        </span>
                    </div>
                    <div className="h-2 bg-border-primary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent-blue rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Tips Toggle */}
                    <button
                        onClick={() => setShowTips(!showTips)}
                        className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold transition-all ${showTips ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-[#0A0F1A] border-border-primary text-text-secondary hover:text-white'}`}
                        title="Interview Tips"
                    >
                        <Lightbulb size={14} />
                        <span className="text-[10px] uppercase tracking-wider">Tips</span>
                    </button>

                    <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-3 text-red-500">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <button onClick={handleEndSession} className="bg-[#0A0F1A] border border-border-primary px-4 py-2 rounded-xl text-text-secondary hover:text-white transition-colors text-sm font-bold uppercase tracking-wider">
                        End Session
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Side: Video Streams (AI & User) */}
                <div className="w-full lg:w-[65%] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[450px]">

                        {/* AI Box */}
                        <div className="bg-[#0F172A] border border-border-primary rounded-xl p-6 flex flex-col justify-center items-center relative overflow-hidden shadow-lg group">

                            <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 z-10 backdrop-blur-sm">
                                <Target size={14} className="text-blue-400" />
                                <div className="flex flex-col">
                                    <span className="text-white text-[10px] uppercase font-bold tracking-wider leading-none">
                                        {config?.interviewerName || 'AI Interviewer'}
                                    </span>
                                    <span className="text-blue-400 text-[9px] font-bold leading-none mt-1">{isSpeaking ? 'Speaking...' : isLoading ? 'Thinking...' : 'Listening'}</span>
                                </div>
                            </div>

                            {/* AI Image & Animator */}
                            <div className="relative flex items-center justify-center h-32 w-full mt-6 z-10 text-center">

                                {/* The Person's static image floating in center */}
                                <div className={`relative w-24 h-24 rounded-full border-2 transition-all duration-300 ${isSpeaking ? 'border-accent-blue shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'border-gray-600'}`}>
                                    <img
                                        src={config?.interviewerImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"}
                                        alt={`${config?.interviewerName || 'Reva'} - AI Recruiter`}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                    {isSpeaking && (
                                        <div className="absolute -bottom-2 -right-2 bg-accent-blue w-6 h-6 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_10px_rgba(37,99,235,1)] border-2 border-[#0F172A]">
                                            <Mic size={12} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Orbiting effects depending on state */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {isSpeaking ? (
                                        // Speaking Waves spreading out from portrait
                                        <div className="absolute w-40 h-40 border border-accent-blue/40 rounded-full animate-[ping_1.5s_linear_infinite]"></div>
                                    ) : isLoading ? (
                                        // Thinking Rings
                                        <div className="absolute w-[130px] h-[130px] border-b-2 border-l-2 border-accent-blue/80 rounded-full animate-spin"></div>
                                    ) : (
                                        // Listening Pulse
                                        <>
                                            <div className="absolute w-36 h-36 border border-emerald-500/30 rounded-full animate-[ping_2s_linear_infinite]"></div>
                                            <div className="absolute w-[130px] h-[130px] border border-emerald-500/50 rounded-full"></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Box */}
                        <div className="bg-black/90 border border-border-primary rounded-xl relative flex flex-col items-center justify-center overflow-hidden shadow-lg">

                            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-10">
                                <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)] animate-pulse' : 'bg-red-500'}`}></div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                    {isListening ? 'Recording' : 'Muted'}
                                </span>
                            </div>

                            {/* Video Controls overlay */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={toggleVideo}
                                    className="w-9 h-9 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                                    title={isVideoOn ? "Turn off camera" : "Turn on camera"}
                                >
                                    {isVideoOn ? <Video size={18} className="text-white" /> : <VideoOff size={18} className="text-red-400" />}
                                </button>
                            </div>

                            {userStream && isVideoOn ? (
                                <video
                                    ref={videoRefCallback}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-4 text-text-secondary select-none">
                                    <div className="w-32 h-32 bg-[#1E293B] rounded-full border border-gray-700 flex items-center justify-center">
                                        <VideoOff size={48} className="opacity-50" />
                                    </div>
                                    <span className="font-bold uppercase tracking-widest text-sm text-gray-500">Camera Off</span>
                                </div>
                            )}

                            {/* Live speaking text overlay */}
                            {(transcript || interimTranscript) && isListening && (
                                <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 transition-all">
                                    <p className="text-white text-sm italic">
                                        {transcript} <span className="text-white/60">{interimTranscript}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Confidence Meter — Audio Waveform */}
                    <div className="bg-bg-secondary border border-border-primary rounded-xl p-3 flex items-center gap-3">
                        <div className="flex items-center gap-2 shrink-0">
                            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`}></div>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Voice Level</span>
                        </div>
                        <div className="flex-1 flex items-end gap-[3px] h-6">
                            {volumeBars.map((active, i) => (
                                <div
                                    key={i}
                                    className="flex-1 rounded-sm transition-all duration-75"
                                    style={{
                                        height: active ? `${Math.max(20, Math.min(100, volumeLevel * 100 + Math.random() * 30))}%` : '15%',
                                        backgroundColor: active
                                            ? (volumeLevel > 0.7 ? '#10B981' : volumeLevel > 0.4 ? '#F59E0B' : '#2563EB')
                                            : 'rgba(255,255,255,0.05)'
                                    }}
                                ></div>
                            ))}
                        </div>
                        <span className="text-[9px] text-text-secondary font-mono shrink-0">
                            {isListening ? `${Math.round(volumeLevel * 100)}%` : '--'}
                        </span>
                    </div>
                </div>

                {/* Right Side: Chat History + Tips Panel */}
                <div className="w-full lg:w-[35%] flex flex-col gap-4 h-[520px]">

                    {/* Tips Panel (Collapsible) */}
                    {showTips && (
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 animate-in slide-in-from-right-5 duration-300 shrink-0">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                    <Lightbulb size={12} /> Quick Tips
                                </h4>
                                <button onClick={() => setShowTips(false)} className="text-amber-400/50 hover:text-amber-400 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {currentTips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[11px] text-amber-200/70 leading-relaxed">
                                        <ChevronRight size={10} className="mt-0.5 shrink-0 text-amber-500" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Chat History */}
                    <div className="bg-[#0F172A] border border-border-primary rounded-xl flex flex-col flex-1 relative shadow-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-border-primary bg-black/20">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={16} className="text-text-secondary" />
                                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Interview Transcript</h3>
                            </div>
                        </div>

                        {/* Closure Phase Hint */}
                        {isClosurePhase && (
                            <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-200/90 p-3 text-xs flex items-start gap-2 animate-in slide-in-from-top-2">
                                <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                <span>
                                    <strong>Interview Complete.</strong> You can ask final questions, or say <i>"bye"</i>, <i>"no questions"</i>, <i>"that's all"</i>, or <i>"let's end"</i> to finish the session.
                                </span>
                            </div>
                        )}

                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 flex flex-col">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className="flex flex-col w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-accent-blue' : 'text-emerald-500'}`}>
                                            {msg.role === 'user' ? 'Candidate' : (config?.interviewerName || 'Interviewer')}
                                        </span>
                                    </div>
                                    <div className={`text-sm leading-relaxed p-3 rounded-lg border-l-2 ${msg.role === 'user'
                                        ? 'bg-blue-500/5 border-accent-blue text-white'
                                        : 'bg-emerald-500/5 border-emerald-500 text-gray-200'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* AI Streaming Text — word by word */}
                            {isStreamingAI && streamingText && (
                                <div className="flex flex-col w-full animate-in fade-in duration-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                                            {config?.interviewerName || 'Interviewer'}
                                        </span>
                                    </div>
                                    <div className="text-sm leading-relaxed p-3 rounded-lg border-l-2 bg-emerald-500/5 border-emerald-500 text-gray-200">
                                        {streamingText}<span className="inline-block w-1.5 h-4 bg-emerald-400 ml-1 animate-pulse rounded-sm"></span>
                                    </div>
                                </div>
                            )}

                            {/* Live Transcribing Indicator in Chat */}
                            {(transcript || interimTranscript) && isListening && (
                                <div className="flex flex-col w-full animate-in fade-in duration-300 mt-2">
                                    <div className="flex items-center gap-2 mb-2 text-accent-blue">
                                        <span className="text-[10px] uppercase font-bold tracking-wider animate-pulse pt-1">
                                            Candidate is responding...
                                        </span>
                                    </div>
                                    <div className="p-3 bg-blue-500/5 border-l-2 border-accent-blue/50 rounded-lg text-sm text-white/80 italic font-mono">
                                        {transcript} <span className="opacity-50">{interimTranscript}</span>
                                    </div>
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex flex-col w-full animate-in fade-in duration-300 mt-2">
                                    <div className="flex items-center gap-2 mb-2 text-emerald-500">
                                        <span className="text-[10px] uppercase font-bold tracking-wider">{(config?.interviewerName || 'Interviewer')} is typing...</span>
                                    </div>
                                    <div className="p-4 bg-emerald-500/5 border-l-2 border-emerald-500/50 rounded-lg flex items-center gap-2 w-max">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Keyboard Shortcut Hint */}
            {showShortcuts && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-3 duration-500 z-50">
                    <div className="flex items-center gap-2">
                        <Keyboard size={14} className="text-text-secondary" />
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Shortcuts</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white font-mono border border-white/20">ESC</kbd>
                            <span className="text-[10px] text-text-secondary">End Session</span>
                        </div>
                    </div>
                    <button onClick={() => setShowShortcuts(false)} className="text-text-secondary hover:text-white transition-colors ml-2">
                        <X size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default InterviewLive;
