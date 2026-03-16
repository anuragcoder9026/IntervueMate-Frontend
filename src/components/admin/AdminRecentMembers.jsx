import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AdminRecentMembers = ({ members = [] }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = members.filter(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Show latest 10 members by default
    const displayedMembers = filtered.slice(0, 10);

    const handleProfileClick = (member) => {
        const idToUse = member.userId || member._id;
        const nameSlug = member.name ? member.name.replace(/\s+/g, '').toLowerCase() : 'user';
        navigate(`/profile/${nameSlug}-${idToUse}`);
    };

    return (
        <div className="bg-[#1c2230] border border-border-primary rounded-xl overflow-hidden mt-6 shadow-sm">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-border-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 shrink-0">
                    <h3 className="text-white font-bold text-sm tracking-tight">Recent Members</h3>
                    <span className="bg-white/5 text-text-secondary text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {members.length}
                    </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#131821] border border-border-primary rounded-lg pl-9 pr-4 py-2 text-[11px] text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent-blue/50 transition-colors"
                        />
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center bg-[#131821] border border-border-primary rounded-lg text-text-secondary hover:text-white transition-colors shrink-0 active:scale-95 shadow-sm">
                        <Filter size={14} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="border-b border-border-primary/50 text-[10px] text-text-secondary font-bold uppercase tracking-wider bg-[#1a202d]">
                            <th className="px-5 sm:px-6 py-3.5 font-bold">Name</th>
                            <th className="px-5 sm:px-6 py-3.5 font-bold">ID</th>
                            <th className="px-5 sm:px-6 py-3.5 font-bold">Joined Date</th>
                            <th className="px-5 sm:px-6 py-3.5 font-bold">Status</th>
                            <th className="px-5 sm:px-6 py-3.5 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-primary/50 text-xs">
                        {displayedMembers.length > 0 ? (
                            displayedMembers.map((member) => (
                                <tr key={member._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-5 sm:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`}
                                                className="w-8 h-8 rounded-full shadow-sm object-cover"
                                                alt={member.name}
                                            />
                                            <div>
                                                <p
                                                    onClick={() => handleProfileClick(member)}
                                                    className="font-bold text-white text-[11px] leading-tight group-hover:text-accent-blue transition-colors cursor-pointer"
                                                >
                                                    {member.name}
                                                </p>
                                                <p className="text-[10px] text-text-secondary mt-0.5 font-medium opacity-70 truncate max-w-[150px]">{member.headline || 'Member'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 sm:px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-wide bg-white/5 text-text-secondary border border-white/10 uppercase">
                                            {member.userId || member._id.toString().substring(0, 6)}
                                        </span>
                                    </td>
                                    <td className="px-5 sm:px-6 py-4 text-[11px] text-text-secondary font-medium">
                                        {member.joinedAt ? format(new Date(member.joinedAt), 'MMM dd, yyyy') : (member.createdAt ? format(new Date(member.createdAt), 'MMM dd, yyyy') : 'N/A')}
                                    </td>
                                    <td className="px-5 sm:px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_1px_rgba(16,185,129,0.5)]"></span>
                                            <span className="text-[11px] font-bold text-white">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-5 sm:px-6 py-4 text-right">
                                        <button className="text-text-secondary hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5 active:scale-95 inline-flex">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-text-secondary">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users size={32} className="opacity-20" />
                                        <p className="text-sm font-medium">No members found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-border-primary flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-text-secondary font-medium">
                    Showing {displayedMembers.length} of {filtered.length} results
                </p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-border-primary bg-bg-primary text-text-secondary rounded text-[10px] font-bold hover:text-white hover:bg-[#242b3d] transition-colors shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none">Previous</button>
                    <button className="px-3 py-1.5 border border-border-primary bg-bg-primary text-text-secondary rounded text-[10px] font-bold hover:text-white hover:bg-[#242b3d] transition-colors shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none">Next</button>
                </div>
            </div>
        </div>
    );
};

export default AdminRecentMembers;
