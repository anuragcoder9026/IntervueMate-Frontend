import React, { useState, useRef, useEffect } from 'react';
import { 
    Heart, 
    MessageCircle, 
    UserPlus, 
    Users, 
    Calendar, 
    Layers, 
    Bot, 
    Trophy,
    CheckCircle2,
    Clock,
    Share2,
    ExternalLink,
    Settings,
    MoreHorizontal,
    Bell,
    Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { markNotificationRead, deleteNotification } from '../../store/notificationSlice';

const NotificationCard = ({ data }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = () => {
        const iconSize = 18;
        switch (data.type) {
            case 'follow':
                return { icon: <UserPlus size={iconSize} />, color: 'bg-accent-blue', text: 'text-accent-blue' };
            case 'like_post':
            case 'group_like':
                return { icon: <Heart size={iconSize} />, color: 'bg-rose-500', text: 'text-rose-500' };
            case 'comment_post':
            case 'group_comment':
                return { icon: <MessageCircle size={iconSize} />, color: 'bg-emerald-500', text: 'text-emerald-500' };
            case 'new_post_following':
            case 'group_post':
                return { icon: <Share2 size={iconSize} />, color: 'bg-indigo-500', text: 'text-indigo-500' };
            case 'group_resource':
                return { icon: <Layers size={iconSize} />, color: 'bg-amber-500', text: 'text-amber-500' };
            case 'event_created_following':
            case 'event_created_group':
            case 'event_request':
            case 'event_approved':
            case 'event_live':
                return { icon: <Calendar size={iconSize} />, color: 'bg-purple-500', text: 'text-purple-500' };
            default:
                return { icon: <Bell size={iconSize} />, color: 'bg-gray-500', text: 'text-gray-500' };
        }
    };

    const { icon, color, text } = getIcon();

    const handleMarkRead = (e) => {
        if (e) e.stopPropagation();
        if (!data.isRead) {
            dispatch(markNotificationRead(data._id));
        }
    };

    const handleViewDetails = (e) => {
        e.stopPropagation();
        handleMarkRead();
        
        if (!data.relatedId) return;

        switch (data.relatedType) {
            case 'Post':
                navigate(`/post/${data.relatedId}`);
                break;
            case 'Event':
                navigate(`/events/join/${data.relatedId}`);
                break;
            case 'Group':
                navigate(`/groups/${data.groupId || data.relatedId}`);
                break;
            case 'Resource':
                if (data.groupId) {
                    navigate(`/groups/${data.groupId}/resources`);
                }
                break;
            case 'User':
                if (data.sender && data.sender.userId) {
                    const slug = `${data.sender.name.toLowerCase().replace(/\s+/g, '-')}-${data.sender.userId}`;
                    navigate(`/profile/${slug}`);
                } else {
                    navigate(`/profile/${data.relatedId}`);
                }
                break;
            default:
                break;
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        dispatch(deleteNotification(data._id));
        setShowMenu(false);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    return (
        <div 
            onClick={() => handleMarkRead()}
            className={`group relative transition-all rounded-2xl p-4 sm:p-5 flex items-start gap-4 w-full mb-3 cursor-pointer border ${
                data.isRead 
                ? 'bg-[#171c28] border-white/5 opacity-80' 
                : 'bg-accent-blue/5 border-accent-blue/20 shadow-[0_0_20px_rgba(37,99,235,0.05)]'
            }`}
        >
            {/* Left Side: Avatar or Icon */}
            <div className="relative shrink-0">
                {data.sender ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <img 
                            src={data.sender.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${data.sender.name}`} 
                            alt={data.sender.name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                ) : (
                    <div className={`w-10 h-10 rounded-xl ${color}/10 border ${color}/20 ${text} flex items-center justify-center`}>
                        {icon}
                    </div>
                )}
                
                {data.sender && (
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-md ${color} border-2 border-[#171c28] flex items-center justify-center text-white shadow-sm`}>
                        {React.cloneElement(icon, { size: 10 })}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-12">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                    <h4 className="text-[13px] font-bold text-white tracking-tight">
                        {data.sender ? data.sender.name : 'System'}
                    </h4>
                    <span className="text-[11px] text-[#64748b] font-medium">
                        {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
                    </span>
                    {!data.isRead && (
                        <div className="w-2 h-2 bg-accent-blue rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-pulse" />
                    )}
                </div>

                <p className="text-[13px] text-[#a3aed0] leading-relaxed">
                    {data.message}
                </p>

                {/* Optional Action Button */}
                {data.relatedId && (
                    <div className="mt-3">
                        <button 
                            onClick={handleViewDetails}
                            className="flex items-center gap-1.5 text-accent-blue hover:text-white text-[11px] font-bold transition-all group/btn"
                        >
                            <span>View Details</span>
                            <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

            {/* Right Side Options */}
            <div className="absolute right-4 top-4 flex items-center" ref={menuRef}>
                <button 
                    onClick={toggleMenu}
                    className={`p-1.5 text-[#64748b] hover:text-white transition-all rounded-lg hover:bg-white/5 ${showMenu ? 'opacity-100 bg-white/5 text-white' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    <MoreHorizontal size={14} />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <button 
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                            <Trash2 size={16} />
                            <span>Remove notification</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationCard;
