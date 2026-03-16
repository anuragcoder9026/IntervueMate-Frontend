import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-bg-secondary py-16 border-t border-border-primary mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between gap-12">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-7 h-7 bg-accent-blue rounded-md flex items-center justify-center">
                                <Layout size={16} className="text-white" />
                            </div>
                            <span className="font-outfit font-bold text-lg">Interview_Mate</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            The ultimate platform for tech interview preparation and professional networking.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 flex-1 md:ml-24 max-w-2xl">
                        <div>
                            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Product</h4>
                            <ul className="space-y-4 text-xs text-text-secondary">
                                <Link to="/interview" className="block hover:text-white cursor-pointer transition-colors">AI Mock Interview</Link>
                                <li className="hover:text-white cursor-pointer transition-colors">Practice Sessions</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Question Bank</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Peer Matches</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Resources</h4>
                            <ul className="space-y-4 text-xs text-text-secondary">
                                <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Success Stories</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Interview Guide</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Community</li>
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Company</h4>
                            <ul className="space-y-4 text-xs text-text-secondary">
                                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border-primary flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] text-text-secondary">
                    <p>© 2024 Interview_Mate Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Cookie Settings</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
