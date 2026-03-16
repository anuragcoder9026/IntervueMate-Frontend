import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';
import { approveJoinRequest, rejectJoinRequest } from '../../store/groupSlice';

const AdminPendingRequests = ({ requests = [] }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const handleApprove = (userId) => {
        dispatch(approveJoinRequest({ groupId: id, userId }));
    };

    const handleReject = (userId) => {
        dispatch(rejectJoinRequest({ groupId: id, userId }));
    };

    // Limit to maximum 3 requests for the dashboard view
    const displayedRequests = requests.slice(0, 3);

    return (
        <div className="bg-[#1c2230] border border-border-primary rounded-xl p-5 h-full flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-sm tracking-tight">Pending Requests</h3>
                    {requests.length > 0 && (
                        <span className="bg-accent-blue/20 text-accent-blue text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {requests.length}
                        </span>
                    )}
                </div>
                {requests.length > 3 && (
                    <button
                        onClick={() => navigate(`/admin/groups/${id}/requests`)}
                        className="text-accent-blue hover:text-blue-400 text-[10px] font-bold transition-colors"
                    >
                        View All
                    </button>
                )}
            </div>

            <div className="space-y-4 flex-1">
                {displayedRequests.length > 0 ? (
                    displayedRequests.map((request, index) => (
                        <React.Fragment key={request._id || index}>
                            <div className="flex gap-3 items-start group">
                                <img
                                    src={request.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.name)}&background=random&color=fff`}
                                    className="w-9 h-9 rounded-full shrink-0 shadow-sm object-cover"
                                    alt={request.name}
                                />
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[11px] font-bold text-white truncate group-hover:text-accent-blue transition-colors cursor-pointer">
                                            {request.name}
                                        </h4>
                                        <span className="text-[8px] text-text-secondary whitespace-nowrap font-medium">
                                            {request.requestedAt ? formatDistanceToNow(new Date(request.requestedAt), { addSuffix: true }) : 'Recent'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-text-secondary truncate mt-0.5 font-medium">
                                        {request.headline || 'Member'}
                                    </p>
                                    <div className="flex gap-2 mt-2.5">
                                        <button
                                            onClick={() => handleApprove(request._id)}
                                            className="flex-1 bg-accent-blue hover:bg-blue-600 text-white text-[10px] font-bold py-1.5 rounded-md transition-colors shadow-sm active:scale-95 transition-all"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(request._id)}
                                            className="flex-1 bg-[#242b3d] hover:bg-[#38435d] text-text-secondary hover:text-white text-[10px] font-bold py-1.5 rounded-md transition-colors active:scale-95 transition-all"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {index < displayedRequests.length - 1 && (
                                <div className="h-px bg-border-primary/50 mx-2"></div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <span className="text-white/20 text-lg font-black">0</span>
                        </div>
                        <p className="text-[10px] text-text-secondary font-medium">No pending join requests</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPendingRequests;
