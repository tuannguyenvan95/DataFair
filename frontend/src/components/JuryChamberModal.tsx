import React, { useState, useEffect } from 'react';
import {
  X,
  Scale,
  CheckCircle2,
  XCircle,
  Cpu,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { DatasetOrderData, formatGen, shortenAddress } from '../utils/helpers';

interface JuryChamberModalProps {
  isOpen: boolean;
  order: DatasetOrderData | null;
  onClose: () => void;
  onConfirmAdjudicate?: (orderId: string) => Promise<void>;
  isExecuting?: boolean;
}

interface JurorNode {
  id: string;
  name: string;
  role: 'Leader' | 'Juror';
  model: string;
  verdict: 'DATA_QUALIFIED' | 'DATA_REJECTED' | 'PENDING';
  schemaScore: number;
  qualityScore: number;
  confidence: number;
  status: 'Evaluating' | 'Consensus Agreed' | 'Disagreed';
}

export const JuryChamberModal: React.FC<JuryChamberModalProps> = ({
  isOpen,
  order,
  onClose,
  onConfirmAdjudicate,
  isExecuting = false,
}) => {
  const [activeTab, setActiveTab] = useState<'VERDICT' | 'JURY_NODES' | 'RAW_PAYLOAD'>('VERDICT');
  const [simStep, setSimStep] = useState<number>(0);

  useEffect(() => {
    if (isExecuting) {
      const interval = setInterval(() => {
        setSimStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 700);
      return () => clearInterval(interval);
    } else {
      setSimStep(4);
    }
  }, [isExecuting]);

  if (!isOpen || !order) return null;

  const isQualified = order.verdict === 'DATA_QUALIFIED' || order.status === 2;
  const isRejected = order.verdict === 'DATA_REJECTED' || order.status === 3;
  const isPartial = order.verdict === 'DATA_PARTIAL' || order.status === 5;
  const isRetry = order.verdict === 'DATA_RETRY' || order.status === 6;
  const isDisputed = order.status === 7;
  const isConceded = order.verdict === 'BUYER_CONCEDED' || order.verdict === 'PROVIDER_CONCEDED';
  const isMutualSplit = order.verdict === 'MUTUAL_SPLIT';
  const isSettled = isQualified || isRejected || isPartial || isConceded || isMutualSplit;

  // Multi-validator jury simulated telemetry
  const jurorNodes: JurorNode[] = [
    {
      id: 'node-alpha',
      name: 'Validator 0x8F41 (Leader)',
      role: 'Leader',
      model: 'Llama-3.3-70B-Instruct (GenVM Studio)',
      verdict: isSettled ? (order.verdict as any) : 'PENDING',
      schemaScore: isSettled ? order.schema_score : 91,
      qualityScore: isSettled ? order.quality_score : 89,
      confidence: isSettled ? order.confidence : 95,
      status: isSettled ? 'Consensus Agreed' : 'Evaluating',
    },
    {
      id: 'node-beta',
      name: 'Validator 0x22C9 (Juror)',
      role: 'Juror',
      model: 'Mistral-Large-2407 (GenVM Studio)',
      verdict: isSettled ? (order.verdict as any) : 'PENDING',
      schemaScore: isSettled ? Math.max(0, order.schema_score - 2) : 89,
      qualityScore: isSettled ? Math.min(100, order.quality_score + 1) : 90,
      confidence: isSettled ? order.confidence : 93,
      status: isSettled ? 'Consensus Agreed' : 'Evaluating',
    },
    {
      id: 'node-gamma',
      name: 'Validator 0x7E3D (Juror)',
      role: 'Juror',
      model: 'Claude-3.5-Haiku-Onchain (GenVM Studio)',
      verdict: isSettled ? (order.verdict as any) : 'PENDING',
      schemaScore: isSettled ? Math.min(100, order.schema_score + 3) : 94,
      qualityScore: isSettled ? Math.max(0, order.quality_score - 2) : 88,
      confidence: isSettled ? Math.min(100, order.confidence + 1) : 96,
      status: isSettled ? 'Consensus Agreed' : 'Evaluating',
    },
    {
      id: 'node-delta',
      name: 'Validator 0x51A8 (Juror)',
      role: 'Juror',
      model: 'DeepSeek-V3-Quantized (GenVM Studio)',
      verdict: isSettled ? (order.verdict as any) : 'PENDING',
      schemaScore: isSettled ? order.schema_score : 90,
      qualityScore: isSettled ? order.quality_score : 91,
      confidence: isSettled ? order.confidence : 94,
      status: isSettled ? 'Consensus Agreed' : 'Evaluating',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="bg-dark-900 border border-cyber-neon/30 rounded-3xl max-w-3xl w-full shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden neon-border-cyan">
        {/* Top High-Tech Bar */}
        <div className="px-6 py-4 bg-dark-850 border-b border-dark-750 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue">
              <Scale className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-sm text-white tracking-wide">
                  GENLAYER ON-CHAIN COURT
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-primary-500/20 text-primary-300 border border-primary-500/30">
                  STUDIONET CONSENSUS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Order Reference: <span className="text-cyber-blue font-bold">#{order.order_id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-750 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Execution Phased HUD (when adjudicating live) */}
        {isExecuting && (
          <div className="px-6 py-3 bg-dark-800/90 border-b border-dark-700 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-2">
              <span className="font-mono flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyber-blue animate-bounce" />
                <span>Consensus Pipeline Active...</span>
              </span>
              <span className="font-mono text-cyber-blue">Step {simStep + 1}/4</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
              <div className={`p-2 rounded-lg border ${simStep >= 0 ? 'bg-primary-500/20 border-primary-500/50 text-white' : 'bg-dark-900 border-dark-700 text-slate-500'}`}>
                1. web.render()
              </div>
              <div className={`p-2 rounded-lg border ${simStep >= 1 ? 'bg-primary-500/20 border-primary-500/50 text-white' : 'bg-dark-900 border-dark-700 text-slate-500'}`}>
                2. Tokenize & Parse
              </div>
              <div className={`p-2 rounded-lg border ${simStep >= 2 ? 'bg-primary-500/20 border-primary-500/50 text-white' : 'bg-dark-900 border-dark-700 text-slate-500'}`}>
                3. LLM Jury Audit
              </div>
              <div className={`p-2 rounded-lg border ${simStep >= 3 ? 'bg-accent-emerald/20 border-accent-emerald/50 text-emerald-300' : 'bg-dark-900 border-dark-700 text-slate-500'}`}>
                4. emit_transfer()
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs inside Modal */}
        <div className="flex border-b border-dark-750 px-6 bg-dark-900/60">
          <button
            onClick={() => setActiveTab('VERDICT')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'VERDICT'
                ? 'border-cyber-blue text-cyber-blue'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Court Verdict & Scores
          </button>
          <button
            onClick={() => setActiveTab('JURY_NODES')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'JURY_NODES'
                ? 'border-cyber-blue text-cyber-blue'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Validator AI Jury</span>
            <span className="w-2 h-2 rounded-full bg-accent-emerald"></span>
          </button>
          <button
            onClick={() => setActiveTab('RAW_PAYLOAD')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition ${
              activeTab === 'RAW_PAYLOAD'
                ? 'border-cyber-blue text-cyber-blue'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Deliverable & Spec
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: VERDICT & SCORES */}
          {activeTab === 'VERDICT' && (
            <>
              {/* Grand Banner */}
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden ${
                  isQualified
                    ? 'bg-accent-emerald/10 border-accent-emerald/40 text-accent-emerald'
                    : isPartial
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                    : isRetry
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300'
                    : isRejected
                    ? 'bg-accent-rose/10 border-accent-rose/40 text-accent-rose'
                    : isDisputed
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-dark-800/80 border-dark-700 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
                      isQualified
                        ? 'bg-accent-emerald/20 border-accent-emerald/50'
                        : isPartial
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        : isRetry
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                        : isRejected
                        ? 'bg-accent-rose/20 border-accent-rose/50'
                        : isDisputed
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-dark-700 border-dark-600'
                    }`}
                  >
                    {isQualified && <CheckCircle2 className="w-8 h-8" />}
                    {isPartial && <Scale className="w-8 h-8 text-purple-400" />}
                    {isRetry && <Zap className="w-8 h-8 text-yellow-400" />}
                    {isRejected && <XCircle className="w-8 h-8" />}
                    {isDisputed && <Scale className="w-8 h-8 text-amber-400" />}
                    {!isQualified && !isPartial && !isRetry && !isRejected && !isDisputed && (
                      <Cpu className="w-8 h-8 text-primary-400" />
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-widest font-mono font-bold block opacity-80">
                      Adjudication Decision
                    </span>
                    <span className="text-2xl font-black font-mono tracking-wide">
                      {order.verdict}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                      {isQualified
                        ? 'Dataset certified. 100% escrow automatically paid to Data Curator.'
                        : isPartial
                        ? 'Bilateral 65/35 Fair Split: 65% paid to Curator, 35% refunded to Buyer for minor spec variances.'
                        : isRetry
                        ? 'Grace Period Granted: Curator allowed 1 retry attempt to fix syntax/fetch issues without losing bounty.'
                        : isConceded
                        ? 'Dispute Settled: Resolved via unilateral concession between counterparties.'
                        : isMutualSplit
                        ? 'Dispute Settled: 50/50 mutual split approved by both parties.'
                        : isRejected
                        ? 'Quality audit failed. 100% escrow refunded to Buyer.'
                        : 'Order currently awaiting AI Jury evaluation.'}
                    </p>
                  </div>
                </div>

                <div className="text-right bg-dark-900/60 p-3 rounded-xl border border-dark-750/80 sm:self-center w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    Escrow Settlement
                  </span>
                  <span className="text-lg font-bold font-mono text-white">
                    {formatGen(order.escrow_amount)} GEN
                  </span>
                  {isPartial && (
                    <span className="block text-[10px] font-mono text-purple-300 mt-0.5">
                      Curator: {(Number(formatGen(order.escrow_amount)) * 0.65).toFixed(2)} | Buyer: {(Number(formatGen(order.escrow_amount)) * 0.35).toFixed(2)}
                    </span>
                  )}
                  {isMutualSplit && (
                    <span className="block text-[10px] font-mono text-cyan-300 mt-0.5">
                      50% Curator | 50% Buyer
                    </span>
                  )}
                </div>
              </div>

              {/* 3 Telemetry Score Dials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Schema Score */}
                <div className="bg-dark-850 border border-dark-750 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Schema Adherence</span>
                    <span className="text-sm font-mono font-black text-cyber-blue">
                      {order.schema_score}/100
                    </span>
                  </div>
                  <div className="w-full bg-dark-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        order.schema_score >= 70 ? 'bg-accent-emerald' : 'bg-accent-rose'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, order.schema_score))}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    JSONL parser verified key syntax and formatting compliance.
                  </p>
                </div>

                {/* Quality Score */}
                <div className="bg-dark-850 border border-dark-750 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Semantic Richness</span>
                    <span className="text-sm font-mono font-black text-cyber-neon">
                      {order.quality_score}/100
                    </span>
                  </div>
                  <div className="w-full bg-dark-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        order.quality_score >= 70 ? 'bg-accent-emerald' : 'bg-accent-rose'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, order.quality_score))}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Audited for factual depth and zero synthetic copy-paste spam.
                  </p>
                </div>

                {/* Confidence */}
                <div className="bg-dark-850 border border-dark-750 p-4 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">Consensus Index</span>
                    <span className="text-sm font-mono font-black text-cyber-amber">
                      {order.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-dark-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-amber transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(0, order.confidence))}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Agreement rate among diverse LLM validator nodes.
                  </p>
                </div>
              </div>

              {/* Natural Language Court Rationale */}
              <div className="bg-dark-850 border border-dark-750 rounded-2xl p-5">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase font-bold text-cyber-blue mb-2.5">
                  <Sparkles className="w-4 h-4" />
                  <span>On-Chain Jury Adjudication Breakdown</span>
                </div>
                <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl text-sm font-mono text-slate-200 leading-relaxed">
                  {order.reason}
                </div>
              </div>

              {/* Bilateral Fair Play Safeguards Explainer */}
              <div className="bg-dark-850/80 border border-dark-750 p-5 rounded-2xl">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>GenLayer Bilateral Fair Play Safeguards</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                  <div className="bg-dark-900/80 p-3.5 rounded-xl border border-dark-750">
                    <span className="text-emerald-400 font-bold block mb-1">🛡️ For Model Trainers (Buyers)</span>
                    <p className="text-slate-300 leading-relaxed">
                      Escrow is locked in the on-chain smart contract. 100% automatic refund if deliverable fails quality checks (&lt;60%) or contains spam. Unilateral cancel & refund permitted anytime before curator claims.
                    </p>
                  </div>
                  <div className="bg-dark-900/80 p-3.5 rounded-xl border border-dark-750">
                    <span className="text-cyan-400 font-bold block mb-1">⚡ For Data Curators (Sellers)</span>
                    <p className="text-slate-300 leading-relaxed">
                      Anti-exploitation protection: 65% compensation payout if work meets 60–79% rubric standards. Guaranteed 1-time retry window for minor syntax errors. Buyer cannot revoke escrow once deliverable is submitted.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: JURY NODES */}
          {activeTab === 'JURY_NODES' && (
            <div className="space-y-4">
              <div className="p-4 bg-dark-850 rounded-2xl border border-dark-750 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">GenLayer Optimistic Democracy Nodes</h4>
                  <p className="text-xs text-slate-400">
                    Leader proposes verdict via LLM. Validators execute independent LLMs and converge on semantic meaning.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/30 font-mono text-xs">
                  4 Nodes Online
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {jurorNodes.map((node) => (
                  <div
                    key={node.id}
                    className="bg-dark-850 border border-dark-750 hover:border-cyber-blue/40 p-4 rounded-2xl transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {node.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          node.role === 'Leader'
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                            : 'bg-dark-750 text-slate-300'
                        }`}
                      >
                        {node.role}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mb-3 font-mono">
                      {node.model}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-dark-900 p-2.5 rounded-xl border border-dark-750 mb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Schema</span>
                        <span className="font-bold text-slate-200">{node.schemaScore}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Quality</span>
                        <span className="font-bold text-slate-200">{node.qualityScore}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Vote</span>
                        <span
                          className={`font-bold ${
                            node.verdict === 'DATA_QUALIFIED'
                              ? 'text-accent-emerald'
                              : node.verdict === 'DATA_REJECTED'
                              ? 'text-accent-rose'
                              : 'text-slate-400'
                          }`}
                        >
                          {node.verdict === 'DATA_QUALIFIED' ? 'PASS' : node.verdict === 'DATA_REJECTED' ? 'REJECT' : '...'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Equivalence Check:</span>
                      <span className="font-mono text-accent-emerald flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Semantic Match</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RAW PAYLOAD & SPEC */}
          {activeTab === 'RAW_PAYLOAD' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Buyer Technical Specifications
                </label>
                <div className="bg-dark-850 p-4 rounded-2xl border border-dark-750 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {order.spec_requirements}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Provider Live Sample Deliverable
                </label>
                {order.sample_dataset_url ? (
                  <div className="bg-dark-850 p-4 rounded-2xl border border-dark-750 flex items-center justify-between">
                    <span className="font-mono text-xs text-cyber-blue truncate max-w-md">
                      {order.sample_dataset_url}
                    </span>
                    <a
                      href={order.sample_dataset_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-200 text-xs font-medium flex items-center space-x-1 transition"
                    >
                      <span>Open Raw</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div className="bg-dark-850 p-4 rounded-2xl border border-dashed border-dark-700 text-xs text-slate-500 italic text-center">
                    No deliverable URL submitted yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-dark-850 border-t border-dark-750 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            <span>Buyer: </span>
            <span className="text-slate-200">{shortenAddress(order.buyer)}</span>
            <span className="mx-2">|</span>
            <span>Provider: </span>
            <span className="text-slate-200">{shortenAddress(order.provider)}</span>
          </div>

          <div className="flex items-center space-x-3">
            {order.status === 1 && onConfirmAdjudicate && (
              <button
                onClick={() => onConfirmAdjudicate(order.order_id)}
                disabled={isExecuting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-blue to-primary-600 hover:from-cyan-400 hover:to-primary-500 text-dark-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>{isExecuting ? 'Jury Adjudicating...' : 'Trigger On-Chain Adjudication'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-200 text-xs font-semibold transition"
            >
              Close Chamber
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
