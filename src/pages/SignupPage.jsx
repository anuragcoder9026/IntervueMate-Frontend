import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, reset } from '../store/authSlice';
import { toast } from 'react-toastify';
import {
    Briefcase,
    Mic,
    FileCheck,
    Users,
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    User,
    Loader2
} from 'lucide-react';

const SignupPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/dashboard');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (isLogin) {
            const userData = {
                email: formData.email,
                password: formData.password,
            };
            dispatch(login(userData));
        } else {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            };
            dispatch(register(userData));
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    return (
        <div className="min-h-screen bg-[#0A0F1A] flex flex-col-reverse md:flex-row font-inter">
            {/* Left Column - Information */}
            <div className="flex-1 p-8 md:p-16 lg:p-24 lg:py-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>

                <div className="relative z-10 text-white">
                    <div className="flex items-center gap-3 mb-20 ">
                        <div className="w-10 h-10 bg-[#0d59f2] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Briefcase size={22} className="text-white" />
                        </div>
                        <span className="font-outfit font-bold text-2xl tracking-tight">Interview_Mate</span>
                    </div>

                    <div className="max-w-xl mb-12">
                        <h1 className="text-5xl lg:text-6xl font-outfit font-bold leading-[1.1] mb-6 tracking-tight">
                            Your AI Interview <br /> Coach & <span className="text-[#0d59f2]">Professional Network</span>
                        </h1>
                        <p className="text-[#94A3B8] text-lg leading-relaxed">
                            Master your next interview with real-time AI feedback, connect with peers for mock sessions, and optimize your resume for ATS systems.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-md">
                        <FeatureCard
                            icon={<Mic className="text-blue-500" size={20} />}
                            title="AI Mock Interviews"
                            desc="Get instant feedback on your tone, pace, and answers."
                        />
                        <FeatureCard
                            icon={<FileCheck className="text-blue-500" size={20} />}
                            title="Live Community sessions"
                            desc="Connect with peers for mock sessions."
                        />
                        <FeatureCard
                            icon={<FileCheck className="text-blue-500" size={20} />}
                            title="Resources sharing"
                            desc="Share your resources with peers."
                        />
                        <FeatureCard
                            icon={<Users className="text-blue-500" size={20} />}
                            title="Peer Networking"
                            desc="Connect with students and professionals worldwide."
                        />
                    </div>
                </div>

                <div className="relative z-10 mt-12 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
                    <ShieldCheck size={16} className="text-[#0d59f2]" />
                    <span>Trusted by 50,000+ candidates</span>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex-1 bg-[#121826]/30 md:bg-transparent p-4 md:p-8 lg:p-24 lg:py-10 flex flex-col items-center justify-start md:pt-32 relative overflow-y-auto">
                <div className="w-full max-w-md mb-8 flex p-1 bg-[#0A0F1A] border border-[#1E293B] rounded-xl shadow-inner">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-[#0d59f2] text-white shadow-lg shadow-blue-500/10' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-[#0d59f2] text-white shadow-lg shadow-blue-500/10' : 'text-[#94A3B8] hover:text-white'}`}
                    >
                        Register
                    </button>
                </div>

                <div className="w-full max-w-md bg-[#121826] border border-[#1E293B] rounded-3xl p-8 lg:p-10 shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-outfit font-bold text-white mb-2">
                            {isLogin ? 'Welcome back' : 'Create Account'}
                        </h2>
                        <p className="text-sm text-[#94A3B8]">
                            {isLogin ? 'Enter your credentials to access your account.' : 'Join 50k+ professionals and start your journey.'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div className={`space-y-6 overflow-hidden transition-all duration-300 ease-in-out ${!isLogin ? 'max-h-[100px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0d59f2] transition-colors" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={onChange}
                                        placeholder="Alex Miller"
                                        className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-[#94A3B8]/40 focus:outline-none focus:border-[#0d59f2]/50 transition-all shadow-inner"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0d59f2] transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onChange}
                                    placeholder="name@example.com"
                                    className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-[#94A3B8]/40 focus:outline-none focus:border-[#0d59f2]/50 transition-all shadow-inner"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Password</label>
                                {isLogin && <button type="button" className="text-[10px] font-bold text-[#0d59f2] hover:underline uppercase tracking-tight">Forgot Password?</button>}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0d59f2] transition-colors" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={onChange}
                                    placeholder="Enter your password"
                                    className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-[#94A3B8]/40 focus:outline-none focus:border-[#0d59f2]/50 transition-all shadow-inner"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-[#0d59f2] hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-70 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#1E293B]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs font-bold uppercase tracking-[0.2em] text-[#94A3B8]">
                            <span className="bg-[#121826] px-4">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-[#0A0F1A] border border-[#1E293B] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#1E293B]/50 transition-all shadow-md"
                    >
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
                        Google
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-[#94A3B8]">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#0d59f2] font-bold hover:underline ml-1"
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-[#121826] border border-[#1E293B] rounded-2xl p-5 flex items-start gap-5 hover:border-[#0d59f2]/30 transition-all group">
        <div className="p-3 bg-[#0A0F1A] rounded-xl shadow-inner border border-[#1E293B] group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white text-base mb-1">{title}</h4>
            <p className="text-[#94A3B8] text-xs leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default SignupPage;
