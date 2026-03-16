import React from 'react';
import { ArrowUpRight, AlertCircle } from 'lucide-react';

const AdminStatCard = ({ title, value, trend, isTrendingDown, isAction, icon: Icon }) => {
    return (
        <div className="bg-[#1c2230] border border-border-primary rounded-xl p-5 relative overflow-hidden group hover:border-[#38435d] transition-all flex flex-col justify-between min-h-[120px]">
            <h4 className="text-xs font-bold text-text-secondary relative z-10">{title}</h4>
            <div className="flex items-end gap-3 relative z-10">
                <span className="text-3xl font-black text-white leading-none tracking-tight">{value}</span>
                {trend && (
                    <div className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${isAction ? 'bg-red-500/10 text-red-500' :
                            isTrendingDown ? 'bg-white/5 text-text-secondary w-12 justify-center' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                        {isAction ? <AlertCircle size={10} /> : !isTrendingDown && <ArrowUpRight size={10} strokeWidth={3} />}
                        {trend}
                    </div>
                )}
            </div>
            {/* Background faded icon overlay */}
            {Icon && (
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none group-hover:scale-110 duration-500">
                    <Icon size={120} strokeWidth={3} />
                </div>
            )}
        </div>
    );
};

export default AdminStatCard;
