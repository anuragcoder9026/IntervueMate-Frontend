import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatCard from '../components/dashboard/StatCard';
import ConsistencyGraph from '../components/dashboard/ConsistencyGraph';
import PerformanceTrend from '../components/dashboard/PerformanceTrend';
import SkillAnalysis from '../components/dashboard/SkillAnalysis';
import { AISuggestions, DailyGoalBox } from '../components/dashboard/AISuggestions';
import RecentActivity from '../components/dashboard/RecentActivity';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';

import { useSelector } from 'react-redux';
import {
    Video, BarChart2, Eye, Network, Plus, Download, History, Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const DashboardPage = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [activity, setActivity] = useState({ interviews: [], quizzes: [] });

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const { data } = await api.get('/users/profile/activity');
                if (data.success) {
                    setActivity({
                        interviews: data.interviews,
                        quizzes: data.quizzes
                    });
                }
            } catch (err) {
                console.error('Failed to fetch activity:', err);
            }
        };
        fetchActivity();
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0F1A] text-text-primary font-inter">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8 mb-8">

                    {/* Welcome Text & Action Buttons */}
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-[32px] font-black text-white leading-tight mb-2 tracking-tight">
                            Welcome back, {user?.name?.split(' ')[0] || 'User'}
                        </h1>
                        <p className="text-[#a3aed0] text-sm tracking-wide">
                            Personal Data Wall Analytics Overview
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-6">

                            <button
                                onClick={() => navigate('/interview/history')}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white bg-[#171c28] hover:bg-white/10 hover:border-white/20 transition-all shadow-sm text-sm font-bold tracking-wide"
                            >
                                <History size={18} className="text-emerald-400" />
                                <span>Interview History</span>
                            </button>
                            <button
                                onClick={() => navigate('/quiz-history')}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white bg-[#171c28] hover:bg-white/10 hover:border-white/20 transition-all shadow-sm text-sm font-bold tracking-wide"
                            >
                                <Code size={18} className="text-purple-400" />
                                <span>Quiz History</span>
                            </button>

                        </div>
                    </div>

                    {/* Stats Cards grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-[2]">
                        <StatCard
                            title="INTERVIEWS"
                            value={user?.interviews?.length}
                            icon={Video}
                            theme={{ bg: 'bg-[#1a2b4b]', text: 'text-accent-blue' }}
                        />
                        <StatCard
                            title="AVG SCORE"
                            value="8.4"
                            icon={BarChart2}
                            theme={{ bg: 'bg-[#2d214a]', text: 'text-purple-400' }}
                        />
                        <StatCard
                            title="VIEWS"
                            value="842"
                            icon={Eye}
                            theme={{ bg: 'bg-[#3b1c31]', text: 'text-pink-500' }}
                        />
                        <StatCard
                            title="NETWORK"
                            value={user?.following?.length}
                            icon={Network}
                            theme={{ bg: 'bg-[#3b2219]', text: 'text-orange-500' }}
                        />
                    </div>
                </div>

                {/* Main Content Grid Layers */}
                <div className="flex flex-col gap-6">

                    {/* Consistency Graph Full Width */}
                    <div>
                        <ConsistencyGraph 
                            interviews={activity.interviews} 
                            quizzes={activity.quizzes} 
                            signupDate={user?.createdAt}
                        />
                    </div>

                    {/* Middle Row (Trend + Skill) */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                            <PerformanceTrend />
                        </div>
                        <div className="lg:col-span-2">
                            <SkillAnalysis />
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-3">
                            <AISuggestions />
                            <DailyGoalBox />
                        </div>
                        <div className="lg:col-span-6">
                            <RecentActivity />
                        </div>
                        <div className="lg:col-span-3">
                            <UpcomingEvents />
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage;
