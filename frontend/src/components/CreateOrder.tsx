import React, { useState, useMemo } from 'react';
import {
  PlusCircle,
  Sparkles,
  X,
  AlertCircle,
  ShieldCheck,
  Coins,
  ChevronDown,
  Eye,
  Info,
} from 'lucide-react';

interface CreateOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (specRequirements: string, escrowGen: string) => Promise<void>;
  isSubmitting: boolean;
}

interface TemplateDef {
  title: string;
  category: string;
  format: string;
  bounty: string;
  minSamples: string;
  schema: string;
  rubric: string;
}

const TEMPLATES: TemplateDef[] = [
  {
    title: 'Web3 Smart Contract Instruction Tuning',
    category: 'Web3 & Smart Contracts',
    format: 'JSONL',
    bounty: '1.5',
    minSamples: '10 valid pairs',
    schema: '{"instruction": str, "input": str, "output": str}',
    rubric: 'Clean JSONL formatting, zero synthetic spam. Output must contain secure Solidity/GenLayer smart contract logic with proper comments and error handling.',
  },
  {
    title: 'Multi-Turn Customer Dispute Dialogue',
    category: 'Conversational Dialogue',
    format: 'JSON (Turns)',
    bounty: '1.0',
    minSamples: '5 realistic conversations',
    schema: '{"conversation_id": str, "turns": [{"role": "user"|"assistant", "text": str}]}',
    rubric: 'High conversational nuance, natural conflict resolution, professional customer advocacy tone without robotic repetition.',
  },
  {
    title: 'Python Algorithmic Benchmark & Tests',
    category: 'Code & Algorithms',
    format: 'JSONL',
    bounty: '2.0',
    minSamples: '15 algorithmic tasks',
    schema: '{"task_id": str, "prompt": str, "canonical_solution": str, "test": str}',
    rubric: 'PEP8 compliant Python code, complete docstrings, time complexity analysis, and at least 3 non-trivial test cases per task.',
  },
  {
    title: 'BioMed Clinical Q&A Diagnostic Synthesis',
    category: 'BioMed & Reasoning',
    format: 'JSONL',
    bounty: '2.5',
    minSamples: '8 verified clinical cases',
    schema: '{"case_id": str, "patient_vignette": str, "differential_diagnosis": [str], "rationale": str}',
    rubric: 'Evidence-based clinical reasoning, proper medical nomenclature, zero hallucinated pharmacology references.',
  },
];

const CATEGORIES = [
  'Web3 & Smart Contracts',
  'Code & Algorithms',
  'Conversational Dialogue',
  'BioMed & Reasoning',
  'Finance & Quantitative',
  'General LLM Tuning',
];

const FORMAT_OPTIONS = [
  'JSONL',
  'JSON (Turns)',
  'CSV / TSV',
  'Parquet / Tabular',
  'Custom Schema',
];

export const CreateOrder: React.FC<CreateOrderProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  // Mode: 'guided' or 'advanced' (raw prompt)
  const [mode, setMode] = useState<'guided' | 'advanced'>('guided');

  // Guided fields
  const [title, setTitle] = useState(TEMPLATES[0].title);
  const [category, setCategory] = useState(TEMPLATES[0].category);
  const [format, setFormat] = useState(TEMPLATES[0].format);
  const [schema, setSchema] = useState(TEMPLATES[0].schema);
  const [minSamples, setMinSamples] = useState(TEMPLATES[0].minSamples);
  const [rubric, setRubric] = useState(TEMPLATES[0].rubric);
  const [bounty, setBounty] = useState(TEMPLATES[0].bounty);

  // Raw mode fallback
  const [rawSpec, setRawSpec] = useState('');

  // UI helpers
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compile final spec string for on-chain storage & AI Jury prompt
  const compiledSpec = useMemo(() => {
    if (mode === 'advanced') {
      return rawSpec.trim();
    }
    return `[Task Title]: ${title.trim()}
[Domain Category]: ${category}
[Target Format]: ${format}
[Required Schema]: ${schema.trim()}
[Minimum Volume]: ${minSamples.trim()}
[Quality & Anti-Spam Rubric]: ${rubric.trim()}

Strict Evaluation Rules:
1. Strict schema adherence: Must match the declared format and key structure without parsing failures.
2. Semantic richness: Deliver genuine domain depth, zero repetitive spam tokens, and high factual accuracy.`;
  }, [mode, rawSpec, title, category, format, schema, minSamples, rubric]);

  if (!isOpen) return null;

  const handleApplyTemplate = (t: TemplateDef) => {
    setTitle(t.title);
    setCategory(t.category);
    setFormat(t.format);
    setSchema(t.schema);
    setMinSamples(t.minSamples);
    setRubric(t.rubric);
    setBounty(t.bounty);
    if (mode === 'advanced') {
      setRawSpec(`[Task Title]: ${t.title}\n[Domain]: ${t.category}\n[Format]: ${t.format}\n[Schema]: ${t.schema}\n[Volume]: ${t.minSamples}\n[Rubric]: ${t.rubric}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const specToSend = compiledSpec.trim();
    if (!specToSend) {
      setError('Dataset specification requirements cannot be empty.');
      return;
    }

    // Normalize comma to period
    const sanitizedBounty = bounty.replace(',', '.').trim();
    const numBounty = parseFloat(sanitizedBounty);
    if (isNaN(numBounty) || numBounty <= 0) {
      setError('Escrow bounty must be a valid number greater than 0 GEN.');
      return;
    }

    try {
      await onSubmit(specToSend, sanitizedBounty);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Transaction was rejected or failed. Check MetaMask.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-dark-900 border border-dark-600 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Create Dataset Escrow Bounty
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                On-Chain Escrow
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Lock GEN into smart escrow. The GenLayer AI Jury autonomously inspects submitted deliverables against your quality rubric.
            </p>
          </div>
        </div>

        {/* Template Quick Selection */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Presets & Benchmarks</span>
            </label>
            <div className="flex items-center space-x-1 bg-dark-950 p-1 rounded-xl border border-dark-700">
              <button
                type="button"
                onClick={() => setMode('guided')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  mode === 'guided'
                    ? 'bg-cyan-500 text-dark-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Guided Form
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('advanced');
                  if (!rawSpec) setRawSpec(compiledSpec);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  mode === 'advanced'
                    ? 'bg-cyan-500 text-dark-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Raw Spec
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTemplate(t)}
                className="text-left p-2 rounded-xl border border-dark-700 bg-dark-950/60 hover:border-cyan-500/40 hover:bg-dark-800 transition group"
              >
                <p className="text-[11px] font-semibold text-slate-300 group-hover:text-cyan-300 truncate">
                  {t.title}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400/90 font-bold">{t.bounty} GEN</span>
                  <span>{t.format}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'guided' ? (
            <>
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Bounty Task Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. DeFi Vulnerability Dataset (Solidity)"
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Domain Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Format, Minimum Volume & Bounty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
                  >
                    {FORMAT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Min Volume / Scope
                  </label>
                  <input
                    type="text"
                    value={minSamples}
                    onChange={(e) => setMinSamples(e.target.value)}
                    placeholder="e.g. 10 clean rows"
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Escrow Bounty (GEN)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={bounty}
                      onChange={(e) => setBounty(e.target.value)}
                      placeholder="1.5"
                      className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3.5 py-2.5 text-sm text-cyan-300 font-mono font-bold placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      GEN
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Schema Definition */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>Required Schema & Keys</span>
                  <span className="text-[10px] text-slate-500 font-mono lowercase">validated by AI jury</span>
                </label>
                <input
                  type="text"
                  required
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  placeholder='e.g. {"instruction": str, "input": str, "output": str}'
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Row 4: Quality & Anti-Spam Rubric */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Quality Rubric & Acceptance Standards
                </label>
                <textarea
                  rows={3}
                  required
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  placeholder="Detail accuracy standards, acceptable error margins, spam filters, and domain depth requirements..."
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition resize-none"
                />
              </div>
            </>
          ) : (
            /* Advanced Raw Mode */
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                <span>Direct Specification Prompt</span>
                <span className="text-[10px] text-slate-500 font-mono">Raw string for on-chain contract</span>
              </label>
              <textarea
                rows={7}
                required
                value={rawSpec}
                onChange={(e) => setRawSpec(e.target.value)}
                placeholder="Full dataset specifications, rubric criteria, schemas..."
                className="w-full bg-dark-950 border border-dark-700 rounded-xl p-3.5 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition resize-none"
              />
              <div className="mt-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Escrow Bounty (GEN)
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="text"
                    required
                    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                    placeholder="1.5"
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3.5 py-2.5 text-sm text-cyan-300 font-mono font-bold placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                    GEN
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Collapsible Prompt Preview */}
          <div className="border border-dark-700/80 rounded-2xl p-3 bg-dark-950/50">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-cyan-300 font-medium transition"
            >
              <div className="flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Inspect On-Chain Evaluation Prompt Preview</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPreview ? 'rotate-180' : ''}`} />
            </button>
            {showPreview && (
              <pre className="mt-2 p-2.5 bg-dark-950 rounded-xl text-[11px] font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed border border-dark-700 overflow-x-auto max-h-36">
                {compiledSpec}
              </pre>
            )}
          </div>

          {/* Two-Sided Safety Protocol Guarantee Badges */}
          <div className="p-3 rounded-2xl bg-dark-950 border border-cyan-500/20 text-xs">
            <div className="flex items-center space-x-1.5 text-cyan-300 font-bold text-[11px] mb-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Two-Sided Fairness Settlement Protocol</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono text-slate-300">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-emerald-400 font-bold">Score ≥ 80</p>
                <p className="text-slate-400">100% Payout to Curator</p>
              </div>
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-purple-400 font-bold">Score 60 - 79</p>
                <p className="text-slate-400">65% Curator / 35% Refund</p>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-amber-400 font-bold">Syntax Flaw</p>
                <p className="text-slate-400">1 Retry Opportunity</p>
              </div>
              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <p className="text-rose-400 font-bold">Score &lt; 60</p>
                <p className="text-slate-400">100% Escrow Refund</p>
              </div>
            </div>
          </div>

          {/* CRITICAL: MetaMask Alert Helper Notice */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-amber-300">MetaMask Signing Notice: </span>
              If MetaMask displays a red <strong className="text-rose-400 font-mono">"Review alerts"</strong> button instead of "Confirm", please click <strong className="text-white">"Review alerts"</strong> ➔ <strong className="text-white">"Continue anyway"</strong> (or "I accept the risk"). This is MetaMask's standard warning for custom testnets with 0 gas fee.
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs font-mono text-slate-400">
              Total Escrow: <span className="text-cyan-300 font-bold text-sm">{bounty} GEN</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-dark-600 text-slate-300 hover:bg-dark-800 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-dark-950 font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.3)] transition disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming in MetaMask...</span>
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    <span>Lock Escrow & Deploy Bounty</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
