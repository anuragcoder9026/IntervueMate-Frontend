import React from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';

const PostsTab = () => {
    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-5 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-white mb-6">Recent Posts</h2>
            <div className="space-y-6">
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <p className="text-xs text-text-secondary mb-2">Posted 2 days ago</p>
                        <p className="text-sm text-white mb-3 leading-relaxed">Just completed a mock interview for System Design focusing on a rate limiter. The feedback was super helpful! Highly recommend practicing consistently here.</p>
                        <div className="flex gap-4 text-xs font-bold text-text-secondary">
                            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"><ThumbsUp size={14} /> 45</span>
                            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"><MessageSquare size={14} /> 12</span>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-border-primary/50"></div>
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <p className="text-xs text-text-secondary mb-2">Posted 1 week ago</p>
                        <p className="text-sm text-white mb-3 leading-relaxed">Anyone preparing for Google L5 backend roles? Let's connect and do some mock interviews next week.</p>
                        <div className="flex gap-4 text-xs font-bold text-text-secondary">
                            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"><ThumbsUp size={14} /> 89</span>
                            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"><MessageSquare size={14} /> 34</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsTab;
