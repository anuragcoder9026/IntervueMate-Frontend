import React from 'react';
import Navbar from '../components/Navbar';
import { Search, ChevronDown } from 'lucide-react';
import ConnectionRow from '../components/friends/ConnectionRow';
import FriendsLeftSidebar from '../components/friends/FriendsLeftSidebar';
import FriendsRightSidebar from '../components/friends/FriendsRightSidebar';

const FriendsPage = () => {
    const connections = [
        {
            name: "Divyanshu Varshney",
            university: "NIT Jalandhar CSE '27",
            role: "DSA || CP || Web Developer",
            connectedDate: "February 3, 2026",
            image: "https://ui-avatars.com/api/?name=Divyanshu+Varshney&background=0284c7&color=fff",
        },
        {
            name: "Prachi Goyal",
            university: "NITJ",
            role: "Cybersecurity Enthusiast",
            connectedDate: "February 3, 2026",
            image: "https://ui-avatars.com/api/?name=Prachi+Goyal&background=d946ef&color=fff",
        },
        {
            name: "Raviteja Eluri",
            university: "Final year student at NIT Jalandhar",
            connectedDate: "January 25, 2026",
            image: "https://ui-avatars.com/api/?name=Raviteja+Eluri&background=f59e0b&color=fff",
        },
        {
            name: "Sai Charan L",
            university: "building elevatebox | ClickPe (Y Combinator W'23)",
            role: "AIR 86 ICPC - Regionalist | Expert (1740) @Codeforces",
            connectedDate: "January 19, 2026",
            image: "https://ui-avatars.com/api/?name=Sai+Charan&background=10b981&color=fff",
        },
        {
            name: "Hritika Verma",
            university: "Undergraduate Computer Engineering Student at TIET",
            connectedDate: "January 16, 2026",
            image: "https://ui-avatars.com/api/?name=Hritika+Verma&background=6366f1&color=fff",
        }
    ];

    return (
        <div className="bg-[#0A0F1A] min-h-screen text-text-primary pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6 items-start">

                <FriendsLeftSidebar />

                {/* Center Column */}
                <div className="flex-1 w-full space-y-4">
                    {/* Search Bar */}
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-2 shadow-sm">
                        <div className="relative flex items-center gap-4 bg-bg-primary px-4 py-2 rounded-xl border border-transparent focus-within:border-accent-blue/30 transition-all">
                            <Search size={18} className="text-text-secondary" />
                            <input
                                type="text"
                                placeholder="Search by name, college, or role"
                                className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-text-secondary/60 text-text-primary h-6"
                            />
                        </div>
                    </div>

                    {/* Connections List Card */}
                    <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8 border-b border-border-primary/50 pb-4">
                            <h2 className="text-xl font-bold text-white tracking-tight">1,248 Connections</h2>
                            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary cursor-pointer hover:text-white transition-colors">
                                <span>Sort by: <span className="text-white">Recently added</span></span>
                                <ChevronDown size={14} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {connections.map((c, i) => (
                                <ConnectionRow key={i} {...c} />
                            ))}
                        </div>

                        <button className="w-full py-4 mt-6 text-sm font-bold text-accent-blue hover:text-white hover:bg-bg-tertiary transition-all rounded-xl">
                            Show more connections
                        </button>
                    </div>
                </div>

                <FriendsRightSidebar />
            </div>
        </div>
    );
};

export default FriendsPage;
