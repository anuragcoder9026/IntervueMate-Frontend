import React from 'react';
import { Link, FileText } from 'lucide-react';

const PostBody = ({ displayText, shouldTruncate, isExpanded, setIsExpanded, links, files, tags, isSinglePostView }) => {
    return (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3">
            <p className="text-sm text-text-primary/90 leading-relaxed whitespace-pre-wrap break-words">
                {displayText}
                {shouldTruncate && !isSinglePostView && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-text-secondary hover:text-accent-blue font-bold ml-1 transition-colors"
                    >
                        {isExpanded ? 'See less' : 'See more'}
                    </button>
                )}
            </p>
            {/* Minimalist Embedded Attachments - Only visible if fully expanded or if post is short */}
            {(!shouldTruncate || isExpanded) && (links?.length > 0 || files?.length > 0) && (
                <div className="flex flex-col gap-1 -mt-1 animation-slide-down">
                    {/* Embedded Links */}
                    {links?.map((linkObj, idx) => (
                        <a
                            key={`link-${idx}`}
                            href={linkObj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 py-0.5 text-xs font-bold text-accent-blue transition-all w-full group/min"
                        >
                            <Link size={12} className="text-accent-blue shrink-0" />
                            <span className="truncate hover:underline min-w-0">{linkObj.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        </a>
                    ))}

                    {/* Embedded Files */}
                    {files?.map((fileObj, idx) => (
                        <a
                            key={`file-${idx}`}
                            href={fileObj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 py-0.5 text-xs font-bold text-accent-blue transition-all w-full cursor-pointer group/min hover:underline"
                        >
                            <FileText size={12} className="text-accent-blue shrink-0" />
                            <span className="truncate min-w-0">{fileObj.name}</span>
                        </a>
                    ))}
                </div>
            )}

            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-accent-blue bg-accent-blue/5 px-2 py-0.5 rounded-full hover:bg-accent-blue/10 cursor-pointer transition-colors">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostBody;
