import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getGroup, getGroupJoinRequests, approveJoinRequest, rejectJoinRequest } from '../store/groupSlice';
import Navbar from '../components/Navbar';
import { History, SlidersHorizontal, Check, X, Trash2, ChevronDown, Rocket } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JoinRequestsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { joinRequests, isRequestsLoading, currentGroup, isLoading } = useSelector((state) => state.group);
    const { user } = useSelector((state) => state.auth);


    const [selectedIds, setSelectedIds] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All Requests');

    useEffect(() => {
        if (id) {
            dispatch(getGroup(id));
            dispatch(getGroupJoinRequests(id));
        }
    }, [dispatch, id]);

    const isAdmin = currentGroup?.admins?.some(adminId =>
        adminId === user?._id || adminId === user?.id ||
        (typeof adminId === 'object' && adminId._id === user?._id)
    );

    useEffect(() => {
        if (!isLoading && currentGroup && !isAdmin) {
            navigate(`/groups/${id}`, { replace: true });
        }
    }, [isLoading, currentGroup, isAdmin, navigate, id]);

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Filter requests based on active category
    const filteredRequests = joinRequests.filter(req => {
        if (activeFilter === 'All Requests') return true;
        if (activeFilter === 'Students') return req.role === 'student';
        if (activeFilter === 'Professionals') return req.role === 'professional';
        return true;
    });

    const isAllSelected = selectedIds.length === filteredRequests.length && filteredRequests.length > 0;

    const toggleAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredRequests.map(r => r._id));
        }
    };

    const handleApprove = (userId) => {
        dispatch(approveJoinRequest({ groupId: id, userId }));
    };

    const handleReject = (userId) => {
        dispatch(rejectJoinRequest({ groupId: id, userId }));
    };

    const handleBulkApprove = () => {
        selectedIds.forEach(userId => {
            dispatch(approveJoinRequest({ groupId: id, userId }));
        });
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        selectedIds.forEach(userId => {
            dispatch(rejectJoinRequest({ groupId: id, userId }));
        });
        setSelectedIds([]);
    };

    if (isRequestsLoading) {
        return (
            <div className="bg-[#131821] min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#131821] min-h-screen text-text-primary overflow-x-hidden flex flex-col font-inter pb-24">
            <Navbar />

            <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-8 md:py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-black text-white tracking-tight">Join Requests</h1>
                            {joinRequests.length > 0 && (
                                <span className="bg-accent-blue/20 text-accent-blue text-xs font-bold px-3 py-1 rounded-full">{joinRequests.length} Pending</span>
                            )}
                        </div>
                        <p className="text-text-secondary text-base">Manage incoming requests to join your professional network group.</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 border-b border-border-primary/0">
                        {['All Requests', 'Students', 'Professionals'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setActiveFilter(filter);
                                    setSelectedIds([]);
                                }}
                                className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeFilter === filter
                                    ? 'bg-accent-blue text-white'
                                    : 'bg-[#1c2230] border border-border-primary text-text-secondary hover:text-white hover:border-white/20'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${isAllSelected ? 'bg-accent-blue border-accent-blue' : 'border-text-secondary/50 group-hover:border-white'}`}>
                                {isAllSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-text-secondary group-hover:text-white transition-colors font-medium">Select All</span>
                            <input type="checkbox" className="hidden" checked={isAllSelected} onChange={toggleAll} />
                        </label>
                        <div className="w-px h-4 bg-border-primary"></div>
                        <div className="flex items-center gap-1.5 text-text-secondary hover:text-white cursor-pointer transition-colors font-medium">
                            Sort by: Date <ChevronDown size={14} />
                        </div>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(req => {
                            const isSelected = selectedIds.includes(req._id);

                            return (
                                <div key={req._id} className={`bg-[#1c2230] border ${isSelected ? 'border-accent-blue/50' : 'border-border-primary'} rounded-xl p-4 sm:p-5 flex flex-wrap sm:flex-nowrap gap-x-4 gap-y-4 transition-all hover:bg-[#212839]`}>
                                    {/* Checkbox */}
                                    <div className="pt-1">
                                        <label className="cursor-pointer group">
                                            <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${isSelected ? 'bg-accent-blue border-accent-blue' : 'border-text-secondary/50 group-hover:border-white'
                                                }`}>
                                                {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isSelected}
                                                onChange={() => toggleSelection(req._id)}
                                            />
                                        </label>
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <img src={req.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.name)}&background=random&color=fff`} alt={req.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border-primary/50 object-cover" />
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:flex-1 min-w-0">
                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                                                <div>
                                                    <h3 className={`text-sm sm:text-base font-bold text-white flex items-center gap-1.5`}>
                                                        {req.name}
                                                    </h3>
                                                    <p className="text-[13px] text-text-secondary mt-0.5">{req.headline || 'Member'}</p>
                                                </div>
                                                <span className={`self-start shrink-0 text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 flex items-center rounded border ${req.role === 'student' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                    }`}>
                                                    {req.role || 'User'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 mt-4 text-[11px] font-medium text-text-secondary">
                                                <span>{req?.education || 'No education info'}</span>
                                                <div className="hidden sm:block w-1 h-1 rounded-full bg-border-primary"></div>
                                                <span className="sm:inline block mt-1 sm:mt-0">
                                                    Requested {req.requestedAt ? formatDistanceToNow(new Date(req.requestedAt), { addSuffix: true }) : 'Recently'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex sm:flex-col flex-row gap-2 shrink-0 w-full sm:w-32 mt-4 sm:mt-0 items-center justify-start sm:items-end border-t sm:border-t-0 border-border-primary/30 pt-4 sm:pt-0">
                                            <button
                                                onClick={() => handleApprove(req._id)}
                                                className="flex-1 sm:flex-none sm:w-full flex items-center justify-center gap-1.5 bg-accent-blue hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs transition-colors shadow-md shadow-accent-blue/10 active:scale-95"
                                            >
                                                <Check size={14} strokeWidth={3} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(req._id)}
                                                className="flex-1 sm:flex-none sm:w-full flex items-center justify-center gap-1.5 bg-transparent border border-border-primary hover:bg-[#242b3d] hover:border-text-secondary text-text-secondary hover:text-white font-bold py-2 rounded-lg text-xs transition-colors active:scale-95"
                                            >
                                                <X size={14} strokeWidth={3} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-[#1c2230] border border-border-primary rounded-2xl text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                <Rocket size={32} className="text-white/20" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">No pending requests</h3>
                                <p className="text-text-secondary text-sm max-w-xs mx-auto mt-1">When people request to join your group, they will appear here for your review.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Floating Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 w-full max-w-[90%] sm:max-w-max">
                    <div className="bg-white rounded-full shadow-2xl shadow-black/50 px-4 sm:px-5 py-3 flex items-center justify-between sm:justify-start gap-3 sm:gap-4 border border-gray-200">
                        <div className="flex items-center gap-2 sm:gap-3 pr-3 sm:pr-4 border-r border-gray-200 shrink-0">
                            <span className="text-black font-black text-xs sm:text-sm tracking-tight">{selectedIds.length} <span className="hidden sm:inline">Selected</span></span>
                            <button onClick={() => setSelectedIds([])} className="text-gray-500 font-medium text-[10px] sm:text-xs hover:text-black transition-colors">Unselect</button>
                        </div>
                        <button
                            onClick={handleBulkApprove}
                            className="flex items-center gap-2 text-black font-bold text-xs sm:text-sm tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap"
                        >
                            <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
                                <Check size={10} strokeWidth={4} />
                            </div>
                            Approve All
                        </button>
                        <button
                            onClick={handleBulkReject}
                            className="text-gray-600 hover:text-black font-medium text-xs sm:text-sm transition-colors pl-1 sm:pl-2 shrink-0"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinRequestsPage;
