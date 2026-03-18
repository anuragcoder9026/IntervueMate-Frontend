import React, { useState } from 'react';
import {
    Bell,
    Shield,
    UserX,
    Image,
    Lock,
    Eye,
    Volume2,
    Smartphone,
    CheckCircle2,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingItem = ({ icon: Icon, title, description, toggle, checked, onChange, onClick }) => (
    <div
        className={`flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group rounded-xl border border-transparent hover:border-white/5`}
        onClick={onClick}
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1C2436] flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                <Icon size={20} />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-white">{title}</h4>
                <p className="text-xs text-text-secondary/60 mt-0.5">{description}</p>
            </div>
        </div>
        {toggle ? (
            <button
                onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
                className={`w-11 h-6 rounded-full transition-all relative ${checked ? 'bg-accent-blue' : 'bg-gray-700'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
            </button>
        ) : (
            <ChevronRight size={18} className="text-text-secondary/40 group-hover:text-text-secondary transition-colors" />
        )}
    </div>
);

const SectionHeader = ({ title }) => (
    <h3 className="text-[11px] font-bold text-accent-blue uppercase tracking-[0.1em] px-4 mb-3 mt-8 first:mt-0">
        {title}
    </h3>
);

const MessageSettings = ({ isMobileChatOpen }) => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        readReceipts: true,
        onlineStatus: true,
        typingIndicators: true,
        pushNotifications: true,
        soundEnabled: true,
        previewMessage: true,
        highQualityMedia: false,
    });

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className={`flex-1 flex-col bg-[#0d1220] overflow-hidden ${isMobileChatOpen ? 'flex' : 'hidden md:flex'}`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#1E293B]/60 bg-[#111827]/50 backdrop-blur-md flex items-center gap-4">
                <button
                    onClick={() => navigate('/messages')}
                    className="md:hidden p-2 -ml-2 text-text-secondary hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Message Settings</h2>
                    <p className="text-xs text-text-secondary/60 mt-0.5">Manage your messaging experience and privacy</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 max-w-3xl mx-auto w-full">
                <SectionHeader title="Privacy & Visibility" />
                <div className="grid gap-2">
                    <SettingItem
                        icon={CheckCircle2}
                        title="Read Receipts"
                        description="Allow others to see when you've read their messages"
                        toggle
                        checked={settings.readReceipts}
                        onChange={(v) => updateSetting('readReceipts', v)}
                    />
                    <SettingItem
                        icon={Eye}
                        title="Online Status"
                        description="Show when you are active on InterviewMate"
                        toggle
                        checked={settings.onlineStatus}
                        onChange={(v) => updateSetting('onlineStatus', v)}
                    />
                    <SettingItem
                        icon={Lock}
                        title="End-to-End Encryption"
                        description="Learn more about how your messages are secured"
                    />
                </div>

                <SectionHeader title="Notifications" />
                <div className="grid gap-2">
                    <SettingItem
                        icon={Bell}
                        title="Push Notifications"
                        description="Receive alerts for new messages on this device"
                        toggle
                        checked={settings.pushNotifications}
                        onChange={(v) => updateSetting('pushNotifications', v)}
                    />
                    <SettingItem
                        icon={Volume2}
                        title="Notification Sounds"
                        description="Play a sound for incoming messages"
                        toggle
                        checked={settings.soundEnabled}
                        onChange={(v) => updateSetting('soundEnabled', v)}
                    />
                    <SettingItem
                        icon={Smartphone}
                        title="Message Previews"
                        description="Show message content in system notifications"
                        toggle
                        checked={settings.previewMessage}
                        onChange={(v) => updateSetting('previewMessage', v)}
                    />
                </div>

                <SectionHeader title="Chat & Media" />
                <div className="grid gap-2">
                    <SettingItem
                        icon={Image}
                        title="Media Quality"
                        description="Send images and videos in high resolution"
                        toggle
                        checked={settings.highQualityMedia}
                        onChange={(v) => updateSetting('highQualityMedia', v)}
                    />
                    <SettingItem
                        icon={UserX}
                        title="Blocked Accounts"
                        description="Manage the users you have previously blocked"
                    />
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-[#1a3a5c]/20 to-transparent border border-[#1a3a5c]/30">
                    <div className="flex items-center gap-4">
                        <div className="bg-accent-blue/20 p-3 rounded-full text-accent-blue">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold">Privacy Policy</h4>
                            <p className="text-sm text-text-secondary/60 mt-1">
                                Your privacy is our priority. Read our full policy to understand how we protect your data.
                            </p>
                            <button className="text-accent-blue text-sm font-medium mt-3 hover:underline">
                                Read Privacy Policy
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pb-10 mt-10 text-center">
                    <p className="text-xs text-text-secondary/30">InterviewMate Messaging v1.2.0 • Build ID: 8829</p>
                </div>
            </div>
        </div>
    );
};

export default MessageSettings;
