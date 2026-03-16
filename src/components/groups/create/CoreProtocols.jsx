import React from 'react';
import { Sparkles, RefreshCw, CheckCircle, X, Plus } from 'lucide-react';

const CoreProtocols = ({ rules, setRules }) => {
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [newRule, setNewRule] = React.useState({ title: '', description: '' });

    const handleRemoveRule = (idToRemove) => {
        setRules(rules.filter(rule => rule.id !== idToRemove));
    };

    const handleAddRule = () => {
        if (newRule.title && newRule.description) {
            setRules([...rules, { ...newRule, id: Date.now() }]);
            setNewRule({ title: '', description: '' });
            setShowAddForm(false);
        }
    };

    return (
        <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Sparkles size={24} className="text-purple-400" />
                    Community Guidelines
                </h2>
                <div className="px-3 py-1 bg-bg-secondary border border-border-primary rounded-full text-[10px] font-bold text-text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue"></span> Step 3
                </div>
            </div>

            <div className="bg-bg-secondary border border-border-primary rounded-2xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue via-purple-500 to-pink-500"></div>

                <div className="space-y-3">
                    {rules.map((rule) => (
                        <div key={rule.id} className="bg-bg-primary border border-white/5 rounded-xl p-4 flex gap-4 relative group hover:border-white/10 transition-colors">
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

                {showAddForm ? (
                    <div className="mt-4 p-4 bg-bg-primary border border-accent-blue/20 rounded-xl space-y-3">
                        <input
                            type="text"
                            placeholder="Rule Title"
                            value={newRule.title}
                            onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                            className="w-full bg-bg-secondary border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
                        />
                        <textarea
                            placeholder="Rule Description"
                            value={newRule.description}
                            onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                            className="w-full bg-bg-secondary border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-accent-blue h-20 resize-none"
                        ></textarea>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-[10px] font-bold text-text-secondary hover:text-white">Cancel</button>
                            <button onClick={handleAddRule} className="px-4 py-1.5 bg-accent-blue text-white rounded-lg text-[10px] font-bold">Add Rule</button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 border-dashed text-text-secondary hover:text-white hover:bg-white/5 transition-all text-xs font-bold"
                    >
                        <Plus size={16} /> Add Custom Rule
                    </button>
                )}
            </div>
        </div>
    );
};

export default CoreProtocols;
