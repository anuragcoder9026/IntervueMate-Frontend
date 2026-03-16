import React from 'react';
import { Maximize2, Settings, UserSquare2, LayoutGrid, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoomHeader = ({ viewMode, setViewMode, title }) => {
    const navigate = useNavigate();

    return (
        <div className="h-14 bg-[#111622]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-2 sm:px-4 z-10 shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                <button onClick={() => navigate('/events')} className="p-1.5 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors lg:hidden shrink-0">
                    <ChevronLeft size={20} />
                </button>
                <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2.5 py-1 rounded uppercase tracking-widest flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0" />
                    REC
                </span>
                <h1 className="font-bold text-xs sm:text-base tracking-tight text-white truncate max-w-[120px] sm:max-w-md md:max-w-lg lg:max-w-2xl shrink">
                    {title || 'Loading Session...'}
                </h1>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="flex bg-[#1C2436] p-0.5 sm:p-1 rounded-lg border border-white/5 shrink-0">
                    <button
                        onClick={() => setViewMode('speaker')}
                        className={`p-1.5 sm:p-1.5 rounded-md transition-colors ${viewMode === 'speaker' ? 'bg-[#2563EB] text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <UserSquare2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 sm:p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#2563EB] text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <LayoutGrid size={14} className="sm:w-4 sm:h-4" />
                    </button>
                </div>
                <button onClick={() => navigate('/events')} className="p-1.5 sm:p-2 text-text-secondary hover:text-white transition-colors shrink-0" title="Exit Full Screen">
                    <Maximize2 size={16} className="sm:w-4 sm:h-4" />
                </button>
                <button className="hidden sm:block p-1.5 sm:p-2 text-text-secondary hover:text-white transition-colors shrink-0">
                    <Settings size={16} className="sm:w-4 sm:h-4" />
                </button>
            </div>
        </div>
    );
};

export default RoomHeader;
