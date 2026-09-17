import React from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Scale,
  ExternalLink,
  Code2,
  FileCheck,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';
import { CONTRACT_ADDRESS } from '../config/genlayer';

export const ArchitectureTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Value Comparison: Solidity vs GenLayer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legacy Solidity */}
        <div className="bg-dark-900/60 border border-dark-750 p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-rose/10 text-accent-rose border border-accent-rose/20 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Traditional Solidity Contracts</h4>
              <p className="text-xs text-slate-400">Strictly Deterministic EVM Limitations</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-accent-rose font-bold">✕</span>
              <span><strong>Blind to Unstructured Content:</strong> Cannot parse JSONL/CSV or read live files without expensive and centralized oracles.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent-rose font-bold">✕</span>
              <span><strong>Only Hash Verification:</strong> Can only check SHA256 / IPFS hash. If a seller hashes a file of garbage text, Solidity still releases funds!</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent-rose font-bold">✕</span>
              <span><strong>Zero Semantic Awareness:</strong> Cannot detect repetitive token hallucinations, model drift, or prompt formatting errors.</span>
            </li>
          </ul>
        </div>

        {/* GenLayer Intelligent Contract */}
        <div className="bg-dark-900/80 border border-cyber-blue/40 p-6 rounded-3xl relative overflow-hidden neon-border-cyan">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">GenLayer Intelligent Contract (DataFair)</h4>
              <p className="text-xs text-cyber-blue font-mono">Optimistic Democracy on studionet</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-200">
            <li className="flex items-start space-x-2">
              <span className="text-accent-emerald font-bold">✓</span>
              <span><strong>Live Web Fetching:</strong> Uses <code>gl.nondet.web.render</code> to stream raw sample datasets directly on-chain.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent-emerald font-bold">✓</span>
              <span><strong>Subjective Quality Consensus:</strong> Validators run multi-LLMs and reach equivalence on the <code>verdict</code> via <code>gl.vm.run_nondet</code>.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-accent-emerald font-bold">✓</span>
              <span><strong>Guaranteed Escrow Safety:</strong> Escrow is automatically released to Provider if qualified, or refunded 100% to Buyer if rejected.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Visual Execution Flow */}
      <div className="bg-dark-900/80 border border-dark-750 p-6 sm:p-8 rounded-3xl backdrop-blur-md">
        <div className="flex items-center space-x-2 mb-6">
          <Layers className="w-5 h-5 text-cyber-blue" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            DataFair Protocol Execution Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-850 p-4 rounded-2xl border border-dark-750 relative">
            <div className="w-7 h-7 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center font-mono font-bold text-xs mb-3">
              01
            </div>
            <h5 className="text-sm font-bold text-white mb-1">Create Bounty</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Model Trainer Agent locks native GEN into <code>create_order</code> with natural language rubric.
            </p>
          </div>

          <div className="bg-dark-850 p-4 rounded-2xl border border-dark-750 relative">
            <div className="w-7 h-7 rounded-lg bg-accent-amber/20 text-accent-amber flex items-center justify-center font-mono font-bold text-xs mb-3">
              02
            </div>
            <h5 className="text-sm font-bold text-white mb-1">Submit Deliverable</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data Curator Agent claims bounty and commits raw sample URL via <code>submit_dataset_sample</code>.
            </p>
          </div>

          <div className="bg-dark-850 p-4 rounded-2xl border border-cyber-blue/30 relative">
            <div className="w-7 h-7 rounded-lg bg-cyber-blue/20 text-cyber-blue flex items-center justify-center font-mono font-bold text-xs mb-3">
              03
            </div>
            <h5 className="text-sm font-bold text-white mb-1">AI Jury Adjudication</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leader executes LLM prompt on rendered content. Jurors independently verify verdict equivalence.
            </p>
          </div>

          <div className="bg-dark-850 p-4 rounded-2xl border border-accent-emerald/30 relative">
            <div className="w-7 h-7 rounded-lg bg-accent-emerald/20 text-accent-emerald flex items-center justify-center font-mono font-bold text-xs mb-3">
              04
            </div>
            <h5 className="text-sm font-bold text-white mb-1">Two-Sided Settlement</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native GEN split fairly (100% qualified, 65/35 partial split, retry chance, or 50/50 bilateral appeal).
            </p>
          </div>
        </div>
      </div>

      {/* Two-Sided Escrow Protection Matrix */}
      <div className="holo-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30">
        <div className="flex items-center space-x-2 mb-6">
          <Scale className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white tracking-tight font-display">
            Two-Sided Fairness Matrix: Protecting Buyer & Data Curator
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-dark-900/90 p-4 rounded-2xl border border-emerald-500/30">
            <span className="text-emerald-400 font-bold uppercase text-[11px] block mb-1">1. Full Release (&gt;= 80)</span>
            <p className="text-white font-bold text-sm mb-1">100% Payout to Provider</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Full dataset meets all rubric parameters, validated syntax, and passes LLM evaluation.
            </p>
          </div>

          <div className="bg-dark-900/90 p-4 rounded-2xl border border-purple-500/30">
            <span className="text-purple-400 font-bold uppercase text-[11px] block mb-1">2. Partial Split (60 - 79)</span>
            <p className="text-white font-bold text-sm mb-1">65% Curator / 35% Buyer</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Data is usable with minor edge imperfections. Curator gets paid for compute while buyer gets a rebate.
            </p>
          </div>

          <div className="bg-dark-900/90 p-4 rounded-2xl border border-yellow-500/30">
            <span className="text-yellow-400 font-bold uppercase text-[11px] block mb-1">3. Retry Grace Window</span>
            <p className="text-white font-bold text-sm mb-1">Attempt 2 of 2 Resubmit</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Curator is not instantly slashed for simple JSONL line syntax bugs on first delivery.
            </p>
          </div>

          <div className="bg-dark-900/90 p-4 rounded-2xl border border-amber-500/30">
            <span className="text-amber-400 font-bold uppercase text-[11px] block mb-1">4. Bilateral Appeal (50/50)</span>
            <p className="text-white font-bold text-sm mb-1">2-of-2 Multisig Ratification</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Either party can file an appeal. 50/50 mutual split or unilateral concession resolves edge disputes.
            </p>
          </div>
        </div>
      </div>

      {/* Contract Reference Specs */}
      <div className="bg-dark-900/60 border border-dark-750 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
            Official Intelligent Contract
          </span>
          <span className="text-sm font-mono text-white font-bold">
            {CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
              ? CONTRACT_ADDRESS
              : 'Deployed on GenLayer studionet (Chain ID 61999)'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://studio.genlayer.com/contracts"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <span>Open Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://genlayer-explorer.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-lg shadow-primary-600/20"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
