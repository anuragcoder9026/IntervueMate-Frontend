import React from 'react';
import {
    Search,
    ArrowUpRight,
} from 'lucide-react';
import { getFileMetaData } from './resourceUtils';

const ResourceSearchInput = ({
    isMobile = false,
    searchRef,
    searchQuery,
    setSearchQuery,
    isSearchFocused,
    setIsSearchFocused,
    setIsMobileSearchActive,
    searchResults,
    isSearching,
    resources,
    filesByFolder,
    setSelectedFileId,
    setSelectedFolderId,
}) => (
    <div className={`relative group ${isMobile ? 'flex-1' : 'w-full'}`} ref={isMobile ? null : searchRef}>
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-blue transition-colors" />
        <input
            autoFocus={isMobile}
            type="text"
            placeholder="Search resources..."
            onFocus={() => {
                setIsSearchFocused(true);
                if (isMobile) setIsMobileSearchActive(true);
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-[#131821] border ${isSearchFocused ? 'border-accent-blue/50 ring-2 ring-accent-blue/10' : 'border-border-primary'} rounded-xl pl-10 pr-4 py-1.5 text-xs focus:outline-none transition-all placeholder:text-text-secondary`}
        />
        {isSearchFocused && (
            <div className={`absolute top-full left-0 right-0 mt-2 bg-[#0E1420] border border-border-primary rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 ${isMobile ? 'fixed left-1/2 -translate-x-1/2 w-[90vw] top-[64px] h-fit md:absolute md:inset-auto md:top-full md:translate-x-0 md:left-0 md:right-0 md:w-full md:mt-2' : ''}`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary opacity-60">
                            {isSearching ? 'Searching...' : searchQuery.length < 2 ? 'Search for resources' : `Found ${searchResults.length} results`}
                        </h4>
                        {isSearching && <div className="w-3 h-3 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto no-scrollbar space-y-1">
                        {searchResults.length > 0 ? (
                            searchResults.map((item) => {
                                const meta = getFileMetaData(item.fileType, item?.name);
                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => {
                                            setSelectedFileId(item._id);
                                            for (const folderId in filesByFolder) {
                                                if (filesByFolder[folderId].some(f => f.id === item._id)) {
                                                    setSelectedFolderId(folderId);
                                                    break;
                                                }
                                            }
                                            setIsSearchFocused(false);
                                            setSearchQuery('');
                                        }}
                                        className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/5 cursor-pointer group transition-all"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`w-9 h-9 rounded-lg ${meta.bgColor} flex items-center justify-center shrink-0`}>
                                                <meta.icon size={18} className={meta.color} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[13px] font-bold text-white group-hover:text-accent-blue transition-colors truncate">{item?.title || item?.name}</span>
                                                <span className="text-[10px] text-text-secondary font-medium truncate opacity-60">
                                                    {item.tags?.join(', ') || item.description?.substring(0, 50) + '...' || 'No tags'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {item.score && (
                                                <span className="text-[9px] font-black text-accent-blue/40 uppercase tracking-tighter">
                                                    Match: {Math.round(item.score * 100)}%
                                                </span>
                                            )}
                                            <ArrowUpRight size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    </div>
                                );
                            })
                        ) : searchQuery.length >= 2 && !isSearching ? (
                            <div className="py-8 text-center bg-white/5 rounded-2xl border border-dashed border-border-primary/50 mx-2">
                                <Search size={24} className="mx-auto mb-2 opacity-10" />
                                <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-40">No results found for "{searchQuery}"</p>
                            </div>
                        ) : searchQuery.length < 2 ? (
                            <div className="py-6 px-2 text-text-secondary/50 text-[11px] font-medium leading-relaxed italic">
                                Type at least 2 characters to search by title, description, or tags using our AI-powered vector search...
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default ResourceSearchInput;
