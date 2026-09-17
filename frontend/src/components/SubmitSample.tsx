import React, { useState } from 'react';
import { UploadCloud, X, Link2, AlertCircle, FileText } from 'lucide-react';

interface SubmitSampleProps {
  isOpen: boolean;
  orderId: string | null;
  onClose: () => void;
  onSubmit: (orderId: string, sampleUrl: string) => Promise<void>;
  isSubmitting: boolean;
}

const SAMPLE_DATASET_URLS = [
  {
    name: 'High-Quality JSONL Sample (GitHub Raw)',
    url: 'https://raw.githubusercontent.com/tatsu-lab/stanford_alpaca/main/alpaca_data.json',
    desc: 'Instruction tuning sample data with diverse QA pairs.',
  },
  {
    name: 'Synthetic Spam Dataset (For Testing Rejection)',
    url: 'https://raw.githubusercontent.com/datasets/spam-test/main/bad_sample.txt',
    desc: 'Malformed raw text failing formatting and quality standards.',
  },
];

export const SubmitSample: React.FC<SubmitSampleProps> = ({
  isOpen,
  orderId,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [url, setUrl] = useState(SAMPLE_DATASET_URLS[0].url);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !orderId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      setError('Please provide a valid publicly accessible URL starting with http:// or https://');
      return;
    }

    try {
      await onSubmit(orderId, cleanUrl);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Submission failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-accent-amber/10 text-accent-amber border border-accent-amber/20">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Submit Dataset Deliverable</h2>
            <p className="text-xs text-slate-400">Order Reference: <span className="font-mono text-primary-400">{orderId}</span></p>
          </div>
        </div>

        {/* Preset Sample URLs for easy hackathon demo */}
        <div className="mb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1 mb-2">
            <FileText className="w-3.5 h-3.5 text-accent-amber" />
            <span>Sample Demo Deliverables</span>
          </label>
          <div className="space-y-2">
            {SAMPLE_DATASET_URLS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrl(s.url)}
                className="w-full text-left p-3 rounded-xl border border-dark-600 bg-dark-900/50 hover:border-accent-amber/40 hover:bg-dark-700/60 transition group"
              >
                <p className="text-xs font-semibold text-slate-200 group-hover:text-accent-amber">
                  {s.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{s.url}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Raw Sample Dataset URL
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://raw.githubusercontent.com/.../data.jsonl"
                className="w-full bg-dark-900 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-accent-amber transition"
              />
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Must be a publicly accessible raw file (GitHub Raw, Gist, or Hugging Face dataset preview).
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-amber to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-900 text-sm font-bold shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming in MetaMask...' : 'Submit Deliverable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
