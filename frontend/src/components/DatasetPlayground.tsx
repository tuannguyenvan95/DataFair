import React, { useState } from 'react';
import {
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Layers,
  Code2,
} from 'lucide-react';

const PRESET_SAMPLES = [
  {
    name: '🌟 Alpaca QA Instruction (Clean JSONL)',
    type: 'JSONL',
    content: `{"instruction": "Explain quantum entanglement.", "response": "Quantum entanglement occurs when pairs or groups of particles interact in ways such that the quantum state of each particle cannot be described independently of the state of the others."}
{"instruction": "How do zk-rollups scale Ethereum?", "response": "zk-Rollups bundle hundreds of transfers off-chain and generate a cryptographic validity proof (SNARK or STARK) posted on L1."}
{"instruction": "What is Optimistic Democracy in GenLayer?", "response": "Optimistic Democracy is an AI-powered consensus mechanism where validator nodes run LLMs and reach consensus on subjective verdicts through equivalence principles."}`,
    expectedVerdict: 'DATA_QUALIFIED',
    expectedScore: 94,
  },
  {
    name: '🩺 BioMed Clinical Knowledge (Valid)',
    type: 'JSONL',
    content: `{"topic": "Cardiology", "finding": "Troponin-I elevated beyond 0.04 ng/mL indicates acute myocardial infarction.", "level": "Grade-A"}
{"topic": "Neurology", "finding": "Transient ischemic attack requires immediate neurovascular imaging within 24 hours.", "level": "Grade-A"}
{"topic": "Endocrinology", "finding": "HbA1c target below 7.0% recommended for non-pregnant adults with type 2 diabetes.", "level": "Grade-B"}`,
    expectedVerdict: 'DATA_QUALIFIED',
    expectedScore: 92,
  },
  {
    name: '⚠️ Low-Quality Spam / Hallucination (Fails Rubric)',
    type: 'Malformed',
    content: `Buy crypto now click here http://spam.xyz
random words repeating repeating repeating repeating repeating
{"broken_json": "missing closing bracket`,
    expectedVerdict: 'DATA_REJECTED',
    expectedScore: 28,
  },
];

export const DatasetPlayground: React.FC = () => {
  const [datasetText, setDatasetText] = useState(PRESET_SAMPLES[0].content);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const runPreFlightAudit = () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const lines = datasetText.split('\n').filter((l) => l.trim().length > 0);
      let validJsonCount = 0;
      let totalTokens = 0;
      const detectedKeys = new Set<string>();

      lines.forEach((line) => {
        try {
          const parsed = JSON.parse(line.trim());
          validJsonCount++;
          Object.keys(parsed).forEach((k) => detectedKeys.add(k));
          totalTokens += line.split(' ').length;
        } catch (e) {
          totalTokens += line.split(' ').length;
        }
      });

      const jsonParseRate = lines.length > 0 ? (validJsonCount / lines.length) * 100 : 0;
      const isSpam =
        datasetText.toLowerCase().includes('spam') ||
        datasetText.toLowerCase().includes('repeating repeating') ||
        jsonParseRate < 60;

      const schemaScore = Math.round(jsonParseRate);
      const qualityScore = isSpam ? 25 : Math.min(98, 75 + Math.min(20, lines.length * 5));
      const predictedVerdict = schemaScore >= 70 && qualityScore >= 70 ? 'DATA_QUALIFIED' : 'DATA_REJECTED';

      setAnalysisResult({
        totalLines: lines.length,
        validJsonCount,
        jsonParseRate: Math.round(jsonParseRate),
        detectedKeys: Array.from(detectedKeys),
        approxTokens: totalTokens,
        schemaScore,
        qualityScore,
        predictedVerdict,
        reason: isSpam
          ? 'Pre-flight check detected malformed JSON structure or high frequency of repetitive/spam tokens. Likely to be REJECTED by GenLayer AI Jury.'
          : `Valid JSONL structure with ${detectedKeys.size} distinct schema keys. High semantic diversity. Ready for on-chain submission.`,
      });

      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="bg-dark-900/80 border border-dark-750 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
              <Code2 className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight font-display">
              AI Dataset Pre-Flight Inspector & Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulate how the GenLayer On-Chain AI Jury audits your JSONL dataset before submitting a deliverable or locking escrow.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          {PRESET_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDatasetText(sample.content);
                setAnalysisResult(null);
              }}
              className="px-3 py-1.5 rounded-xl border border-dark-700 bg-dark-850 hover:bg-dark-800 text-xs font-mono text-slate-300 hover:text-white transition"
            >
              {sample.name.split(' ')[0]} {sample.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-7 flex flex-col">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Raw Sample Dataset Preview (JSONL)</span>
            <span className="text-[11px] font-mono text-slate-500">Live Editor</span>
          </label>
          <textarea
            rows={10}
            value={datasetText}
            onChange={(e) => setDatasetText(e.target.value)}
            placeholder="Paste raw JSONL lines here to test schema parseability and quality..."
            className="w-full flex-1 bg-dark-950 border border-dark-700 rounded-2xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyber-blue resize-none shadow-inner leading-relaxed"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500">
              Lines: {datasetText.split('\n').filter((l) => l.trim().length > 0).length}
            </span>
            <button
              onClick={runPreFlightAudit}
              disabled={analyzing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-cyber-blue hover:from-primary-500 hover:to-cyan-400 text-dark-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>{analyzing ? 'Auditing...' : 'Run Pre-Flight AI Check'}</span>
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-dark-850 border border-dark-750 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Jury Simulation Telemetry
            </span>

            {analysisResult ? (
              <div className="space-y-4">
                {/* Predicted Verdict */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    analysisResult.predictedVerdict === 'DATA_QUALIFIED'
                      ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald'
                      : 'bg-accent-rose/10 border-accent-rose/30 text-accent-rose'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {analysisResult.predictedVerdict === 'DATA_QUALIFIED' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    <span className="font-mono font-black text-sm">
                      {analysisResult.predictedVerdict}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">
                    Predicted Verdict
                  </span>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-900 p-3 rounded-xl border border-dark-750">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Schema Score
                    </span>
                    <span className="text-xl font-bold font-mono text-cyber-blue">
                      {analysisResult.schemaScore}/100
                    </span>
                  </div>
                  <div className="bg-dark-900 p-3 rounded-xl border border-dark-750">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      Quality Score
                    </span>
                    <span className="text-xl font-bold font-mono text-cyber-neon">
                      {analysisResult.qualityScore}/100
                    </span>
                  </div>
                </div>

                {/* Detected Schema Keys */}
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                    Detected Schema Keys
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.detectedKeys.length > 0 ? (
                      analysisResult.detectedKeys.map((k: string) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 rounded-md bg-dark-900 border border-dark-700 font-mono text-[10px] text-primary-300"
                        >
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* Diagnostic Feedback */}
                <div className="bg-dark-900 p-3 rounded-xl border border-dark-750 text-xs font-mono text-slate-300 leading-relaxed">
                  {analysisResult.reason}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs font-mono">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <span>Click "Run Pre-Flight AI Check" to evaluate this dataset sample.</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-dark-750/60 text-[11px] text-slate-500 flex items-center justify-between">
            <span>GenLayer Equivalence Sandbox</span>
            <span className="text-cyber-blue font-mono">Rule R17 Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
