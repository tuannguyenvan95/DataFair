import React, { useState } from 'react';
import { PlusCircle, Sparkles, X, AlertCircle } from 'lucide-react';

interface CreateOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (specRequirements: string, escrowGen: string) => Promise<void>;
  isSubmitting: boolean;
}

const TEMPLATES = [
  {
    title: 'Instruction Tuning (JSONL)',
    bounty: '1.5',
    spec: 'Format: JSONL. Schema requires keys: {"instruction": str, "input": str, "output": str}. Minimum 3 diverse samples. Topic: Web3 & Smart Contracts. Strict rubric: Clean formatting, zero synthetic spam, high technical depth.',
  },
  {
    title: 'Customer Support Dialogue',
    bounty: '1.0',
    spec: 'Format: JSONL. Schema: {"conversation_id": str, "turns": [{"role": "user"|"assistant", "text": str}]}. Topic: E-commerce dispute resolution. Must demonstrate realistic conversational nuance and problem-solving flow.',
  },
  {
    title: 'Python Coding Benchmark',
    bounty: '2.0',
    spec: 'Format: JSONL. Schema: {"task_id": str, "prompt": str, "canonical_solution": str, "test": str}. High quality code without syntax errors. Rubric: Clean docstrings, PEP8 compliant, non-trivial algorithmic test cases.',
  },
];

export const CreateOrder: React.FC<CreateOrderProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [spec, setSpec] = useState(TEMPLATES[0].spec);
  const [bounty, setBounty] = useState(TEMPLATES[0].bounty);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!spec.trim()) {
      setError('Please provide dataset specification and quality requirements.');
      return;
    }

    const numBounty = parseFloat(bounty);
    if (isNaN(numBounty) || numBounty <= 0) {
      setError('Escrow bounty must be greater than 0 GEN.');
      return;
    }

    try {
      await onSubmit(spec.trim(), bounty.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Transaction failed. Check console for details.');
    }
  };

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setSpec(t.spec);
    setBounty(t.bounty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-600 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Create Dataset Escrow Bounty</h2>
            <p className="text-xs text-slate-400">
              Lock GEN in escrow. Funds are paid only if AI Jury certifies dataset quality.
            </p>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="mb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>Fast Templates</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(t)}
                className="text-left p-2.5 rounded-xl border border-dark-600 bg-dark-900/50 hover:border-primary-500/40 hover:bg-dark-700/60 transition group"
              >
                <p className="text-xs font-medium text-slate-300 group-hover:text-primary-400 truncate">
                  {t.title}
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">{t.bounty} GEN</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Escrow Bounty (GEN)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={bounty}
                onChange={(e) => setBounty(e.target.value)}
                placeholder="1.0"
                className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-primary-500 transition"
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                GEN
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Dataset Specification & Quality Rubric
            </label>
            <textarea
              rows={5}
              required
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              placeholder="Describe required schema (e.g. JSONL), keys, domain topic, and quality standards..."
              className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500 transition resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              The GenLayer AI validator jury will fetch the deliverable on-chain and measure adherence against this prompt.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-dark-600 text-slate-300 hover:bg-dark-700 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-sm font-semibold shadow-lg shadow-primary-600/25 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming in MetaMask...' : 'Lock Escrow & Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
