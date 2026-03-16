import React from 'react';

const UpcomingEvents = () => {
    const events = [
        {
            title: 'Group Mock: Distributed Systems',
            time: 'Today, 4:00 PM',
            color: 'bg-blue-500'
        },
        {
            title: 'Webinar: Cracking FAANG',
            time: 'Tomorrow, 10:00 AM',
            color: 'bg-emerald-500'
        },
        {
            title: 'Weekly Coding Contest',
            time: 'Fri, 23 Oct',
            color: 'bg-[rgb(113,85,185)]'
        }
    ];

    return (
        <div className="bg-[#171c28] rounded-2xl p-6 sm:p-8 border border-white/5">
            <h2 className="text-[14px] font-black tracking-tight text-white mb-8">Upcoming</h2>

            <div className="flex flex-col gap-6">
                {events.map((e, i) => (
                    <div key={i} className="flex gap-4 relative cursor-pointer group items-center">
                        <div className={`w-1 rounded-full ${e.color} h-10 shrink-0 z-10 transition-transform group-hover:scale-y-110`} />
                        <div className="flex flex-col justify-center z-10 py-1">
                            <h3 className="text-[13px] font-bold text-white leading-tight group-hover:text-accent-blue transition-colors mb-1">
                                {e.title}
                            </h3>
                            <span className="text-[10px] text-[#a3aed0] tracking-widest uppercase">{e.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingEvents;
