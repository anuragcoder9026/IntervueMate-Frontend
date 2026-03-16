import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, CheckCircle, AlertTriangle, Play, Loader } from 'lucide-react';

const InterviewPreparation = ({ config, onConfirm }) => {
    const [cameraStream, setCameraStream] = useState(null);
    const [micStream, setMicStream] = useState(null);
    const [error, setError] = useState('');
    const [cameraGranted, setCameraGranted] = useState(false);
    const [micGranted, setMicGranted] = useState(false);
    const [isGrantingCamera, setIsGrantingCamera] = useState(false);
    const [isGrantingMic, setIsGrantingMic] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const videoRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);
    const micBarsRef = useRef([]);

    // Keep refs for cleanup so we don't depend on state in the unmount effect
    const cameraStreamRef = useRef(null);
    const micStreamRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && cameraStream && cameraGranted) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [cameraStream, cameraGranted]);

    const requestCamera = async () => {
        setIsGrantingCamera(true);
        setError('');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraStream(mediaStream);
            cameraStreamRef.current = mediaStream;
            setCameraGranted(true);
        } catch (err) {
            console.error("Camera permission error:", err);
            setError("Camera permission denied. Please allow access.");
        } finally {
            setIsGrantingCamera(false);
        }
    };

    const requestMic = async () => {
        setIsGrantingMic(true);
        setError('');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicStream(mediaStream);
            micStreamRef.current = mediaStream;
            setMicGranted(true);

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(mediaStream);
            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateVolume = () => {
                if (analyserRef.current) {
                    analyserRef.current.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < analyser.frequencyBinCount; i++) {
                        sum += dataArray[i];
                    }
                    // Overall loudness
                    const average = (sum / analyser.frequencyBinCount);
                    const volume = average * 3.5; // Boosted

                    if (micBarsRef.current && micBarsRef.current.length > 0) {
                        micBarsRef.current.forEach((bar, i) => {
                            if (bar) {
                                // Create an independent wavy height driven by overall volume
                                const normalizedSine = Math.sin((i / 40) * Math.PI);
                                // A new random factor per frame makes it bouncy
                                const randomFactor = 0.4 + Math.random() * 0.8;

                                const baseH = Math.max(4, (volume / 255) * 80 * normalizedSine * randomFactor);
                                const heightToUse = volume > 2 ? baseH : 4;

                                bar.style.height = `${heightToUse}px`;
                                if (heightToUse > 6) {
                                    bar.classList.add('bg-[#10B981]');
                                    bar.classList.remove('bg-gray-600');
                                } else {
                                    bar.classList.add('bg-gray-600');
                                    bar.classList.remove('bg-[#10B981]');
                                }
                            }
                        });
                    }
                    animationRef.current = requestAnimationFrame(updateVolume);
                }
            };
            updateVolume();

        } catch (err) {
            console.error("Microphone permission error:", err);
            setError("Microphone permission denied. Please allow access.");
        } finally {
            setIsGrantingMic(false);
        }
    };

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false); // In case it fails, otherwise phase unmounts this
        }
    };

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            if (cameraStreamRef.current) {
                cameraStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (micStreamRef.current) {
                micStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(e => console.error(e));
            }
        };
    }, []);

    return (
        <div className="max-w-[900px] mx-auto px-4 py-8 mb-20 font-inter">
            <div className="mb-8 border-b border-border-primary pb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Equipment Check</h1>
                <p className="text-text-secondary text-sm">Please ensure your media devices are functioning properly before starting the assessment.</p>
            </div>

            <div className="bg-[#0F172A] border border-border-primary rounded-xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-stretch">

                {/* Media Preview Section (Left) */}
                <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-border-primary bg-black/20 flex flex-col gap-6">

                    {/* Camera Check */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            {cameraGranted && <CheckCircle size={20} className="text-[#10B981]" />}
                            <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-[#94A3B8]">Camera Check</h3>
                        </div>

                        <div className="bg-[#0A0F1A] border-2 border-border-primary/50 rounded-2xl aspect-video flex items-center justify-center overflow-hidden relative">
                            {cameraGranted ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-4 text-text-secondary">
                                    <Camera size={48} className="opacity-50" />
                                </div>
                            )}

                            {!cameraGranted && !error && (
                                <button
                                    onClick={requestCamera}
                                    disabled={isGrantingCamera}
                                    className="absolute bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded text-sm font-semibold transition-colors flex items-center gap-2 z-20 shadow-lg"
                                >
                                    {isGrantingCamera ? <Loader className="animate-spin" size={16} /> : <Camera size={16} />}
                                    {isGrantingCamera ? "Requesting..." : "Enable Camera"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Microphone Check */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            {micGranted && <CheckCircle size={20} className="text-[#10B981]" />}
                            <h3 className="text-white font-semibold text-sm uppercase tracking-widest text-[#94A3B8]">Microphone Check</h3>
                        </div>

                        <div className="bg-[#0A0F1A] border-2 border-border-primary/50 rounded-2xl h-28 flex items-center justify-center overflow-hidden relative">
                            {!micGranted && !error && (
                                <button
                                    onClick={requestMic}
                                    disabled={isGrantingMic}
                                    className="absolute bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded text-sm font-semibold transition-colors flex items-center gap-2 z-20 shadow-lg"
                                >
                                    {isGrantingMic ? <Loader className="animate-spin" size={16} /> : <Mic size={16} />}
                                    {isGrantingMic ? "Requesting..." : "Enable Microphone"}
                                </button>
                            )}

                            {micGranted && (
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                    <div className="flex items-center justify-center gap-[3px] h-12 w-full px-4 mb-2">
                                        {[...Array(40)].map((_, i) => {
                                            return (
                                                <div
                                                    key={i}
                                                    ref={el => micBarsRef.current[i] = el}
                                                    className="w-1.5 rounded-full transition-all duration-75 bg-gray-600"
                                                    style={{ height: `4px` }}>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <span className="text-text-secondary text-xs uppercase tracking-widest font-bold">Try Speaking...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-3 text-xs font-medium flex items-start gap-2">
                            <AlertTriangle size={16} className="shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                {/* Instructions Section (Right) */}
                <div className="w-full md:w-1/2 p-0 flex flex-col">
                    <div className="p-6 flex-1">
                        <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest text-[#94A3B8]">Assessment Guidelines</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm">
                                <CheckCircle size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-white block mb-0.5">Quiet Environment</strong>
                                    <span className="text-[#94A3B8]">Ensure you are in a quiet room with no background noise.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <CheckCircle size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-white block mb-0.5">Stable Connection</strong>
                                    <span className="text-[#94A3B8]">Check your internet connection. Drops may forfeit the session.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <CheckCircle size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-white block mb-0.5">Automated AI Evaluation</strong>
                                    <span className="text-[#94A3B8]">The AI processes your voice actively. Speak cleanly.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <CheckCircle size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-white block mb-0.5">Session Limits</strong>
                                    <span className="text-[#94A3B8]">5 structured questions with a 20-minute maximum allowance.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Start Button */}
                    <div className="p-6 border-t border-border-primary bg-black/20 flex justify-end">
                        <button
                            onClick={handleConfirm}
                            disabled={!(cameraGranted && micGranted) || isSubmitting}
                            className={`px-6 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2 ${!(cameraGranted && micGranted) || isSubmitting ? 'bg-border-primary text-text-secondary cursor-not-allowed' : 'bg-[#10B981] text-white hover:bg-[#059669]'}`}
                        >
                            {isSubmitting ? <Loader className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                            {isSubmitting ? "Starting..." : "Begin Assessment"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPreparation;
