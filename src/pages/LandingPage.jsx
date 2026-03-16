import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
    Layout, Mic, Globe, Users, MessageSquare, Video, FileText,
    CheckCircle, Navigation, UserPlus, Expand, Trophy, Star,
    Menu, X, LogOut, User as UserIcon
} from 'lucide-react';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-bg-primary min-h-screen text-text-primary">
            {/* Header */}
            <nav className="bg-bg-secondary border-b border-border-primary sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
                            <Layout size={18} className="text-white" />
                        </div>
                        <span className="font-outfit font-bold text-xl leading-none">Interview_Mate</span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-8 items-center text-sm font-medium">
                        <a href="#features" className="cursor-pointer text-text-secondary hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="cursor-pointer text-text-secondary hover:text-white transition-colors">How it Works</a>
                        <a href="#community" className="cursor-pointer text-text-secondary hover:text-white transition-colors">Community</a>
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        <Link to="/signup" className="px-4 py-2 border border-border-primary rounded-md text-sm font-medium hover:bg-bg-tertiary transition-colors">Login</Link>
                        <Link to="/signup" className="px-4 py-2 bg-accent-blue rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">Get Started Free</Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-bg-secondary border-b border-border-primary px-4 py-4 flex flex-col gap-4">
                        <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-text-secondary text-sm">Features</a>
                        <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-text-secondary text-sm">How it Works</a>
                        <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-text-secondary text-sm">Pricing</a>
                        <a href="#community" onClick={() => setIsMenuOpen(false)} className="text-text-secondary text-sm">Community</a>
                        <div className="flex flex-col gap-2 pt-2 border-t border-border-primary">
                            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full py-2 text-center border border-border-primary rounded-md text-sm font-medium">Login</Link>
                            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full py-2 text-center bg-accent-blue rounded-md text-sm font-medium">Get Started Free</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-block px-3 py-1 bg-bg-secondary border border-border-primary rounded-full text-xs font-bold text-accent-blue mb-6">
                            ✨ New: Live Mock Group Analysis
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-outfit font-bold leading-tight mb-8 tracking-tight">
                            Ace Every <br className="hidden lg:block" /> Interview.<br />
                            <span className="text-accent-blue">Build Your Network.</span>
                        </h1>
                        <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
                            The only platform combining AI-driven mock interviews with a global community of professionals. Prepare solo with our advanced AI coach or practice in real-time groups.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
                            <Link to="/signup" className="px-8 py-4 bg-accent-blue rounded-md font-medium text-lg hover:bg-blue-700 transition-all flex items-center">Get Started Free →</Link>
                            <button className="px-8 py-4 bg-transparent border border-border-primary rounded-md font-medium text-lg hover:bg-bg-tertiary transition-all flex items-center gap-2">
                                <Video size={20} /> See How It Works
                            </button>
                        </div>
                        <div className="mt-12 flex items-center gap-3 justify-center md:justify-start">
                            <div className="flex -space-x-2">
                                <img src="https://ui-avatars.com/api/?name=A" className="w-9 h-9 rounded-full border-2 border-bg-primary" />
                                <img src="https://ui-avatars.com/api/?name=B" className="w-9 h-9 rounded-full border-2 border-bg-primary" />
                                <img src="https://ui-avatars.com/api/?name=C" className="w-9 h-9 rounded-full border-2 border-bg-primary" />
                                <div className="w-9 h-9 rounded-full border-2 border-bg-primary bg-bg-tertiary flex items-center justify-center text-[10px] font-bold">+1k</div>
                            </div>
                            <span className="text-xs text-text-secondary">Join 20k+ professionals prepped today.</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-xl relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img
                            src="/landing.png"
                            alt="Interview Mate Platform Preview"
                            className="relative w-full rounded-2xl shadow-2xl border border-border-primary transform transition-all duration-500 group-hover:scale-[1.01]"
                        />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="bg-bg-secondary py-24 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-5xl font-outfit font-bold mb-4">Everything you need to succeed</h2>
                    <p className="text-text-secondary mb-16 max-w-2xl mx-auto">Prepare smarter with AI tools and connect deeper with a professional network. A complete ecosystem for your career growth.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        {[
                            { icon: <Mic />, title: "AI Mock Interviews", desc: "Practice with adaptive AI that gives real-time feedback on your answers, tone, and pacing." },
                            { icon: <Globe />, title: "Global Network Feed", desc: "Connect with peers, mentors, and industry leaders worldwide through a professional content feed." },
                            { icon: <Users />, title: "Private Communities", desc: "Join focused study groups tailored for your specific industry, role, or target company." },
                            { icon: <MessageSquare />, title: "Real-Time Messaging", desc: "Instant communication with study partners and professional connections to coordinate prep." },
                            { icon: <Video />, title: "Live Discussions", desc: "Participate in live audio and video discussions on trending topics and interview strategies." },
                            { icon: <FileText />, title: "Quiz Learning", desc: "Test your technical knowledge with interactive quizzes designed by FAANG experts." }
                        ].map((item, i) => (
                            <div key={i} className="bg-bg-primary border border-border-primary rounded-2xl p-8 hover:border-accent-blue transition-colors group">
                                <div className="w-12 h-12 bg-accent-blue/10 text-accent-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {React.cloneElement(item.icon, { size: 24 })}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-outfit font-bold mb-4">Start your journey in 3 steps</h2>
                    <p className="text-text-secondary">Simple, effective, and career-changing.</p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Connecting Line - desktop only */}
                    <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-border-primary z-0"></div>

                    {[
                        { icon: <UserPlus />, color: "text-accent-blue", step: 1, title: "Create Profile & Set Goals", desc: "Sign up and define your career targets, desired roles, and interview types." },
                        { icon: <Expand />, color: "text-accent-blue", step: 2, title: "Practice & Connect", desc: "Practice with our AI coach or join a study group to mock interview with peers." },
                        { icon: <Trophy />, color: "text-emerald-500", step: 3, title: "Land the Job", desc: "Use your refined skills, confidence score, and new network to secure your dream role." }
                    ].map((item, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center mb-6 border border-border-primary relative shadow-xl">
                                {React.cloneElement(item.icon, { size: 30, className: item.color })}
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-blue text-white rounded-full flex items-center justify-center text-xs font-bold leading-none">{item.step}</div>
                            </div>
                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                            <p className="text-text-secondary text-sm max-w-[250px]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section id="community" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: "Sarah J.", role: "PM @ Amazon", text: "The AI feedback is frighteningly accurate. Helped me crush my Amazon behavioral round." },
                        { name: "David L.", role: "Product Manager", text: "I found my study partner here and we both got offers from Google. Best community ever." },
                        { name: "Elena R.", role: "Senior Dev", text: "The system design mock interviews are top tier. Worth every penny for the premier plan." }
                    ].map((item, i) => (
                        <div key={i} className="bg-bg-secondary border border-border-primary rounded-2xl p-6 flex flex-col justify-between hover:bg-bg-tertiary transition-colors">
                            <div>
                                <div className="flex gap-1 mb-4 text-amber-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-sm italic leading-relaxed mb-6 text-text-primary">"{item.text}"</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src={`https://ui-avatars.com/api/?name=${item.name}&background=random`} className="w-10 h-10 rounded-full" />
                                <div>
                                    <h4 className="text-sm font-bold leading-none">{item.name}</h4>
                                    <p className="text-[10px] text-text-secondary mt-1">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner">
                        <span className="text-5xl font-outfit font-bold mb-2">50k+</span>
                        <p className="text-xs text-text-secondary mb-6 leading-tight">Interviews practiced on our platform this month...</p>
                        <Link to="/signup" className="text-accent-blue text-sm font-bold hover:underline">Join them now →</Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="pricing" className="py-24 pt-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 rounded-3xl p-12 md:p-20 md:py-16 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-white/10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl lg:text-5xl font-outfit font-bold mb-6">Ready to level up your career?</h2>
                        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">Join Interview_Mate today and get unlimited access to basic AI mock interviews and our global community.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup" className="px-10 py-3 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">Get Started For Free</Link>
                            <button className="px-10 py-3 bg-transparent border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">View Pricing Plans</button>
                        </div>
                        <p className="mt-8 text-white/50 text-xs">No credit card required for free tier.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
