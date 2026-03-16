import React, { useState } from 'react';
import {
    Briefcase,
    ChevronDown,
    Plus,
    Check,
    Brain,
    ArrowRight,
    Activity,
    UploadCloud,
    FileText
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadResume } from '../../store/authSlice';
import { toast } from 'react-toastify';

const InterviewConfig = ({ onStart }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [role, setRole] = useState('Frontend Engineer');
    const [experience, setExperience] = useState('Junior');
    const [type, setType] = useState('Behavioral (STAR Method)');
    const [focusAreas, setFocusAreas] = useState(['React js', 'javascript', 'Express js']);
    const [jobDescription, setJobDescription] = useState('');
    const [newTopic, setNewTopic] = useState('');
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [showTopicInput, setShowTopicInput] = useState(false);

    // Resume states
    const [resumeFile, setResumeFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleAddTopic = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            if (newTopic.trim() && !focusAreas.includes(newTopic.trim())) {
                setFocusAreas([...focusAreas, newTopic.trim()]);
                setNewTopic('');
                setShowTopicInput(false);
            }
        }
    };

    const handleGenerateDesc = async () => {
        setIsGeneratingDesc(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/interview/generate-desc`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ role, experience, type, focusAreas })
            });
            const data = await response.json();
            if (data.success) {
                setJobDescription(data.description);
            } else {
                alert("Failed to generate description: " + data.error);
            }
        } catch (err) {
            console.error("Gen Desc Error", err);
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    return (
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-500 mb-20">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">Configure Your Session</h1>
                <p className="text-text-secondary text-sm sm:text-base lg:text-lg">Customize your AI mock interview parameters to simulate a real environment.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                {/* Left Side: Forms */}
                <div className="lg:col-span-7 bg-bg-secondary border border-border-primary rounded-2xl p-8 space-y-8 h-fit">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary mb-3">Target Role / Domain</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Briefcase size={18} className="text-text-secondary group-hover:text-accent-blue transition-colors" />
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl py-3 pl-10 pr-10 text-white text-sm sm:text-base font-bold appearance-none hover:border-accent-blue/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
                            >
                                <option>Frontend Engineer</option>
                                <option>Backend Engineer</option>
                                <option>Fullstack Developer</option>
                                <option>Product Manager</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <ChevronDown size={18} className="text-text-secondary" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary mb-3">Experience Level</label>
                        <div className="flex bg-[#0A0F1A] p-1.5 border border-border-primary rounded-xl">
                            {['Junior', 'Mid-Level', 'Senior'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setExperience(level)}
                                    className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${experience === level ? 'bg-accent-blue text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary mb-3">Interview Type</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Activity size={18} className="text-text-secondary group-hover:text-accent-blue transition-colors" />
                            </div>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl py-3 pl-10 pr-10 text-white text-sm sm:text-base font-bold appearance-none hover:border-accent-blue/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
                            >
                                <option>Behavioral (STAR Method)</option>
                                <option>Technical Algorithm</option>
                                <option>System Design</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <ChevronDown size={18} className="text-text-secondary" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary mb-3">Focus Areas</label>
                        <div className="flex flex-wrap gap-2">
                            {focusAreas.map(area => (
                                <div key={area} className="bg-accent-blue/10 border border-accent-blue/20 text-accent-blue px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2">
                                    {area}
                                    <button onClick={() => setFocusAreas(prev => prev.filter(f => f !== area))} className="hover:text-white transition-colors">
                                        <Plus size={14} className="rotate-45" />
                                    </button>
                                </div>
                            ))}
                            {showTopicInput ? (
                                <input
                                    type="text"
                                    value={newTopic}
                                    onChange={(e) => setNewTopic(e.target.value)}
                                    onKeyDown={handleAddTopic}
                                    onBlur={(e) => {
                                        if (!newTopic.trim()) setShowTopicInput(false);
                                    }}
                                    autoFocus
                                    placeholder="Type & press Enter"
                                    className="bg-[#0A0F1A] border border-accent-blue/50 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold focus:outline-none w-36"
                                />
                            ) : (
                                <button
                                    onClick={() => setShowTopicInput(true)}
                                    className="bg-[#0A0F1A] border border-border-primary hover:border-white/20 text-text-secondary hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
                                >
                                    <Plus size={16} /> Add Topic
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary">Job Description</label>
                            <button
                                onClick={handleGenerateDesc}
                                disabled={isGeneratingDesc}
                                className="text-[10px] uppercase font-bold text-accent-blue flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <Brain size={12} className={isGeneratingDesc ? "animate-pulse" : ""} />
                                {isGeneratingDesc ? "Generating..." : "Auto Generate with AI"}
                            </button>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description or requirements here..."
                            rows={4}
                            className="w-full bg-[#0A0F1A] border border-border-primary rounded-xl p-4 text-white text-sm sm:text-base font-medium resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue/20 custom-scrollbar hover:border-accent-blue/50 transition-colors"
                        ></textarea>
                    </div>

                    {(!user?.resumeInfo || uploadSuccess) && (
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary mb-3">Resume Upload (PDF)</label>
                            <div className="bg-[#0A0F1A] border border-dashed border-border-primary rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all hover:border-accent-blue/50">
                                {uploadSuccess ? (
                                    <div className="flex flex-col items-center gap-2 text-emerald-500">
                                        <Check size={32} />
                                        <span className="font-bold text-sm">Resume successfully extracted!</span>
                                        <span className="text-xs opacity-80">Reva will adapt questions based on your profile.</span>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud size={32} className="text-text-secondary mb-3" />
                                        <p className="text-sm font-bold text-white mb-1">We can fetch questions relevant to your resume.</p>
                                        <p className="text-xs text-text-secondary mb-4">You can upload a PDF and we'll automatically transcript it.</p>

                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            id="resume-upload"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                setIsUploading(true);

                                                try {
                                                    const resultAction = await dispatch(uploadResume(file));
                                                    if (uploadResume.fulfilled.match(resultAction)) {
                                                        setUploadSuccess(true);
                                                        toast.success("Resume uploaded successfully!");
                                                    } else {
                                                        toast.error("Upload failed: " + (resultAction.payload || "Unknown error"));
                                                    }
                                                } catch (error) {
                                                    console.error(error);
                                                    toast.error("Upload error.");
                                                } finally {
                                                    setIsUploading(false);
                                                }
                                            }
                                            }
                                        />
                                        <label
                                            htmlFor="resume-upload"
                                            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${isUploading ? 'bg-text-secondary text-white cursor-wait' : 'bg-accent-blue/10 border border-accent-blue/20 text-accent-blue hover:text-white'}`}
                                        >
                                            {isUploading ? "Extracting to Gemini..." : "Upload Resume (PDF)"}
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Preview */}
                <div className="lg:col-span-5 relative">
                    <div className="space-y-6 lg:sticky lg:top-24">
                        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-accent-blue/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                            {/* Glow Decorations */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent-blue/20 blur-3xl rounded-full"></div>
                            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 text-accent-blue">
                                    <Brain size={24} className="animate-pulse" />
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black">AI Session Preview</span>
                                </div>

                                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-6 leading-tight">
                                    You're about to start a <span className="text-accent-blue">{type.split(' ')[0]} Interview</span> for a <span className="text-accent-blue">{experience} {role.replace(' Engineer', '')}</span> role.
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-accent-blue/20 p-1 rounded-full mt-1 shrink-0">
                                            <Check size={12} className="text-accent-blue" strokeWidth={4} />
                                        </div>
                                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">5 Questions focused on leadership & conflict resolution.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-accent-blue/20 p-1 rounded-full mt-1 shrink-0">
                                            <Check size={12} className="text-accent-blue" strokeWidth={4} />
                                        </div>
                                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">Real-time speech analysis for tone and pace.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-accent-blue/20 p-1 rounded-full mt-1 shrink-0">
                                            <Check size={12} className="text-accent-blue" strokeWidth={4} />
                                        </div>
                                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">Estimated duration: ~15 minutes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onStart({ role, experience, type, focusAreas, jobDescription })}
                            className="w-full bg-accent-blue hover:bg-blue-600 text-white font-black py-4 lg:py-5 rounded-2xl transition-all shadow-xl shadow-accent-blue/20 flex items-center justify-center gap-3 active:scale-[0.98] text-base md:text-lg lg:text-xl lg:mt-4"
                        >
                            Start Interview Session <ArrowRight size={20} className="sm:size-6" strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </main >
    );
};

export default InterviewConfig;
