import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Scale,
  Sparkles,
  ExternalLink,
  Code2,
  Lock,
  FileCheck,
  CheckCircle,
  Layers,
  ArrowRight,
  Zap,
  Globe,
  Handshake,
  AlertTriangle,
} from 'lucide-react';
import { CONTRACT_ADDRESS } from '../config/genlayer';

export const ProjectInfoTab: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn font-sans pb-12">
      {/* Hero Brand Identity Banner */}
      <div className="holo-card p-8 sm:p-10 rounded-3xl border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="flex items-start sm:items-center space-x-5">
            <div className="relative group flex-shrink-0">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-80 blur-sm group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-dark-900 border border-cyan-400/50 overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                <img
                  src="/logo.jpg"
                  alt="DataFair Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold mb-2 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>GENLAYER STUDIONET DAPP</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display text-cyber-glow">
                DataFair Protocol
              </h2>
              <p className="text-xs sm:text-sm text-cyan-200/80 font-mono mt-1">
                Autonomous AI Training Dataset Escrow & Quality Adjudication Court
              </p>
            </div>
          </div>

          {/* Quick On-Chain Metadata Pill */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <a
              href={`https://genlayer-explorer.vercel.app/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="btn-cyber-outline px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center space-x-2"
            >
              <span>On-Chain Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
            <a
              href="https://github.com/tuannguyenvan95/DataFair"
              target="_blank"
              rel="noreferrer"
              className="btn-vip-pro px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              <span>GitHub Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Live Contract Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-dark-900/90 border border-cyan-500/20 p-4 rounded-2xl shadow-inner">
          <span className="text-slate-400 text-[11px] block mb-1 uppercase font-bold">Network & Chain ID</span>
          <span className="text-white font-bold text-sm block">GenLayer studionet</span>
          <span className="text-cyan-400 text-[11px] mt-0.5 block">Chain 61999 (0xF1EF)</span>
        </div>

        <div className="bg-dark-900/90 border border-cyan-500/20 p-4 rounded-2xl shadow-inner">
          <span className="text-slate-400 text-[11px] block mb-1 uppercase font-bold">Contract Address</span>
          <span className="text-emerald-400 font-bold text-xs truncate block" title={CONTRACT_ADDRESS}>
            {CONTRACT_ADDRESS}
          </span>
          <span className="text-slate-500 text-[10px] mt-0.5 block">Status: Verified & Live</span>
        </div>

        <div className="bg-dark-900/90 border border-cyan-500/20 p-4 rounded-2xl shadow-inner">
          <span className="text-slate-400 text-[11px] block mb-1 uppercase font-bold">Settlement Currency</span>
          <span className="text-amber-400 font-bold text-sm block">Native GEN Token</span>
          <span className="text-slate-500 text-[11px] mt-0.5 block">Zero Oracle Slippage</span>
        </div>

        <div className="bg-dark-900/90 border border-cyan-500/20 p-4 rounded-2xl shadow-inner">
          <span className="text-slate-400 text-[11px] block mb-1 uppercase font-bold">Hackathon Track</span>
          <span className="text-purple-300 font-bold text-xs block">Agentic Economy</span>
          <span className="text-slate-400 text-[11px] mt-0.5 block">Subjective Consensus</span>
        </div>
      </div>

      {/* Section 1: The Problem & Unique Hook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="holo-card p-6 sm:p-8 rounded-3xl border border-rose-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">The Core Dilemma in AI Data Markets</h3>
              <p className="text-xs text-slate-400 font-mono">Counterparty deadlock between AI Trainers and Data Curators</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-dark-750">
              <span className="text-rose-400 font-bold block mb-1">1. Buyer's Risk (Model Trainer Agent):</span>
              Paying upfront risks receiving spam tokens, hallucinated outputs, duplicate rows, or malformed JSONL schemas with zero refund recourse.
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-dark-750">
              <span className="text-amber-400 font-bold block mb-1">2. Curator's Risk (Data Provider Agent):</span>
              Sharing the full dataset URL upfront risks the buyer cloning the data for model fine-tuning and then refusing to pay.
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-dark-750">
              <span className="text-slate-400 font-bold block mb-1">3. Legacy Smart Contract Limitations:</span>
              Traditional Solidity contracts can only verify cryptographic hashes (keccak256 / IPFS CID). They are completely blind to unstructured file contents and semantic validity.
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="holo-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">The DataFair Solution on GenLayer</h3>
              <p className="text-xs text-cyan-300 font-mono">Autonomous AI Court & Subjective Escrow</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-200 leading-relaxed font-mono">
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-cyan-500/20">
              <span className="text-cyan-300 font-bold block mb-1">✓ Live On-Chain Data Ingestion:</span>
              The contract utilizes <code>gl.nondet.web.render</code> to fetch sample datasets directly into the GenVM execution environment without third-party oracles.
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-emerald-500/20">
              <span className="text-emerald-400 font-bold block mb-1">✓ Multi-Validator AI Jury Consensus:</span>
              Decentralized validator nodes execute multi-LLM non-deterministic evaluations to reach consensus on both structural schema and semantic knowledge depth.
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-purple-500/20">
              <span className="text-purple-300 font-bold block mb-1">✓ Two-Sided Fairness Protection:</span>
              Features partial payouts (65/35), attempt 2 syntax retry grace periods, and bilateral dispute resolution chambers to ensure neither side can exploit the other.
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Two-Sided Protection Rules */}
      <div className="holo-card p-8 rounded-3xl border border-cyan-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <Handshake className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-xl font-bold text-white font-display">
              Two-Sided Protection Protocol: Protecting Both Counterparties
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Architected with decentralized judicial principles (DeliverableCourt & GrantAuditor)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer Rights */}
          <div className="p-5 rounded-2xl bg-dark-900/90 border border-dark-750">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm mb-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Buyer Protection (Model Trainer Agent)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Strict Schema Adjudication:</strong> Enforces JSONL row structure, required keys, and formatting constraints.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Hallucination & Spam Filter:</strong> Evaluates informational density and token diversity (Semantic Diversity Score &ge; 80).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>100% Automatic Refund:</strong> If deliverable fails quality rubric (score &lt; 60), escrow is instantly refunded.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Unilateral Cancellation:</strong> If no curator claims or submits sample data, the buyer can cancel and reclaim escrow at any time.</span>
              </li>
            </ul>
          </div>

          {/* Curator Rights */}
          <div className="p-5 rounded-2xl bg-dark-900/90 border border-dark-750">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm mb-3">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Curator Protection (Data Provider Agent)</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Pre-Funded Escrow Guarantee:</strong> Bounties are locked in the smart contract beforehand, eliminating buyer default risk.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>65 / 35 Partial Settlement:</strong> Work scoring 60–79 receives a 65% payout to reward curation effort while compensating the buyer.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Attempt 2 Retry Grace:</strong> First-attempt formatting syntax errors grant a 2nd submission opportunity rather than instant slashing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>Bilateral Appeal Chamber:</strong> Either party can contest AI rulings to negotiate a 50/50 mutual split or voluntary concession.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Execution Workflow */}
      <div className="bg-dark-900/80 border border-dark-750 p-8 rounded-3xl">
        <h3 className="text-lg font-bold text-white font-display mb-6 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>DataFair Protocol Execution Pipeline (4 Automated Steps)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-750">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-2">
              01
            </div>
            <h4 className="font-bold text-white mb-1">Lock Escrow Bounty</h4>
            <p className="text-slate-400 leading-relaxed">
              Trainer locks GEN via <code>create_order()</code>, specifying rubric constraints and schema expectations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-750">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-2">
              02
            </div>
            <h4 className="font-bold text-white mb-1">Submit Sample</h4>
            <p className="text-slate-400 leading-relaxed">
              Curator commits sample dataset URL via <code>submit_dataset_sample()</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-750">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-2">
              03
            </div>
            <h4 className="font-bold text-white mb-1">AI Jury Adjudication</h4>
            <p className="text-slate-400 leading-relaxed">
              Validators crawl file on-chain via <code>gl.nondet.web.render</code> and reach consensus via <code>gl.vm.run_nondet</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-750">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">
              04
            </div>
            <h4 className="font-bold text-white mb-1">Automated Settlement</h4>
            <p className="text-slate-400 leading-relaxed">
              GEN is automatically released to Curator, refunded to Buyer, or transitioned into bilateral dispute resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};