import React from 'react';
import { Sparkles, RefreshCw, CheckCircle, X, Plus } from 'lucide-react';

const AIRulesGenerator = ({ rules, setRules }) => {
    const handleRemoveRule = (idToRemove) => {
        setRules(rules.filter(rule => rule.id !== idToRemove));
    };

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6 shadow-sm mt-6 relative overflow-hidden">
            {/* Top gradient glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue via-purple-500 to-pink-500"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 text-white font-bold text-lg mb-1">
                        <Sparkles size={18} className="text-purple-400" />
                        <h2>AI Rules Generator</h2>
                    </div>
                    <p className="text-xs text-text-secondary">
                        Automatically suggest community guidelines based on your description.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-bold text-xs rounded-lg transition-colors border border-purple-500/30 shrink-0">
                    <RefreshCw size={14} /> Regenerate
                </button>
            </div>

            <div className="space-y-3">
                {rules.map((rule) => (
                    <div key={rule.id} className="bg-bg-primary border border-white/5 rounded-xl p-4 flex gap-4 relative group">
                        <div className="shrink-0 mt-0.5">
                            <CheckCircle size={16} className="text-emerald-500" />
                        </div>
                        <div className="flex-1 pr-6">
                            <h4 className="text-sm font-bold text-white mb-1">{rule.title}</h4>
                            <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed">{rule.description}</p>
                        </div>
                        <button
                            onClick={() => handleRemoveRule(rule.id)}
                            className="absolute top-4 right-4 text-text-secondary hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Rule"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 border-dashed text-text-secondary hover:text-white hover:bg-white/5 transition-all text-xs font-bold">
                <Plus size={16} /> Add Custom Rule
            </button>
        </div>
    );
};

export default AIRulesGenerator;
