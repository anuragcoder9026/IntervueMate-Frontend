import React from 'react';

const AboutTab = () => {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-white mb-4">About</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Passionate Software Engineer with 5+ years of experience in building scalable distributed systems. Currently working at Google on Google Cloud infrastructure. I love solving complex algorithmic challenges and mentoring junior developers.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
                On Interview_Mate, I'm looking to connect with aspiring engineers, share my interview experiences, and practice system design for my next big career move. I specialize in backend development, microservices, and high-performance computing.
            </p>

            <h3 className="text-xs font-bold text-white mb-3 tracking-wide">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-all cursor-pointer">System Design</span>
                <span className="px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-all cursor-pointer">Distributed Systems</span>
                <span className="px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-all cursor-pointer">Golang</span>
                <span className="px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-all cursor-pointer">Python</span>
                <span className="px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-all cursor-pointer">Kubernetes</span>
                <span className="px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-white/20 transition-all cursor-pointer">Mentorship</span>
            </div>
        </div>
    );
};

export default AboutTab;
