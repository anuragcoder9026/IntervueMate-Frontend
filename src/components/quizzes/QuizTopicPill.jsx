import React from 'react';

const QuizTopicPill = ({ label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-3xl text-sm font-semibold transition-all whitespace-nowrap ${isActive
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'bg-bg-tertiary text-text-secondary hover:text-white border border-white/5'
                }`}
        >
            {label}
        </button>
    );
};

export default QuizTopicPill;
