import React from 'react';
import { FileText, Sparkles, CheckCircle, RotateCw, X, UploadCloud } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume, updateProfile } from '../../store/authSlice';

const ResumeUpload = ({ isUploading, setIsUploading, resumeFile, setResumeFile }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const hasResume = resumeFile || user?.resumeUrl;

    const getFileName = () => {
        if (resumeFile) return resumeFile.name;
        if (user?.resumeUrl) {
            const parts = user.resumeUrl.split('/');
            const lastPart = parts[parts.length - 1];
            // Remove the resume-userId-timestamp- prefix
            // Format is resume-ID-TIME-FILENAME
            const nameParts = lastPart.split('-');
            if (nameParts.length >= 4) {
                return nameParts.slice(3).join('-');
            }
            return lastPart;
        }
        return '';
    };

    const fileName = getFileName();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            try {
                await dispatch(uploadResume(file)).unwrap();
                setResumeFile(file);
            } catch (err) {
                console.error('Failed to upload resume:', err);
            } finally {
                setIsUploading(false);
            }
        }
    };
    return (
        <div className="relative group overflow-hidden rounded-2xl p-0.5 bg-gradient-to-r from-accent-blue via-purple-500 to-indigo-600 shadow-xl shadow-accent-blue/10">
            <div className="bg-bg-secondary rounded-[14px] overflow-hidden relative">
                {/* Subtle Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-blue/5 rounded-full -mr-24 -mt-24 blur-[60px]"></div>

                <div className="relative z-10 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-bg-tertiary border border-white/5 rounded-xl flex items-center justify-center text-accent-blue shadow-inner relative group-hover:scale-105 transition-transform">
                                <FileText size={24} strokeWidth={1.5} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center border-2 border-bg-secondary text-white shadow-lg">
                                <Sparkles size={10} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5">
                                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">AI Resume Scan</h3>
                                <span className="px-1.5 py-0.5 bg-accent-blue/10 text-accent-blue text-[8px] font-black uppercase tracking-widest rounded border border-accent-blue/20">New Feature</span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed max-w-md">
                                Our AI analyzes your experience to personalize interview questions for you.
                            </p>
                        </div>

                        <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0 min-w-[140px]">
                            {isUploading ? (
                                <div className="flex items-center gap-3 bg-bg-primary/50 backdrop-blur-xl border border-accent-blue/30 p-2 px-6 rounded-xl shadow-lg">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-accent-blue rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-black text-accent-blue uppercase tracking-widest">Scanning...</span>
                                </div>
                            ) : hasResume ? (
                                <div className="flex items-center gap-3 bg-bg-primary/50 backdrop-blur-xl border border-emerald-500/20 p-1.5 pr-4 rounded-xl shadow-lg">
                                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                                        <CheckCircle size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-[10px] font-bold text-white truncate max-w-[120px]">{fileName}</p>
                                        <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-black uppercase tracking-widest">
                                            <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                                            Ready
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                                        <label className="p-1.5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-all cursor-pointer group/re" title="Reupload Resume">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                            />
                                            <RotateCw size={14} className="group-hover/re:rotate-180 transition-transform duration-500" />
                                        </label>
                                        <button
                                            onClick={() => {
                                                setResumeFile(null);
                                                dispatch(updateProfile({ resumeUrl: null, resumeInfo: null }));
                                            }}
                                            className="p-1.5 hover:bg-red-500/10 rounded-lg text-text-secondary hover:text-red-400 transition-all"
                                            title="Remove Resume"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="relative flex items-center justify-center px-6 py-2.5 bg-accent-blue text-white rounded-xl cursor-pointer transition-all shadow-md hover:bg-blue-600 active:scale-95 group/btn overflow-hidden border border-white/10 w-full md:w-auto">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                    <div className="flex items-center gap-2 font-black text-[10px] sm:text-xs z-10 uppercase tracking-widest transition-all">
                                        <UploadCloud size={16} />
                                        <span>Upload Resume</span>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
