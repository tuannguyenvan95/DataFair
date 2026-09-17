import React from 'react';
import { X, CheckCircle2, XCircle, ExternalLink, Cpu, Sparkles, Scale } from 'lucide-react';
import { DatasetOrderData, formatGen, shortenAddress } from '../utils/helpers';

interface QualityModalProps {
  isOpen: boolean;
  order: DatasetOrderData | null;
  onClose: () => void;
}

export const QualityModal: React.FC<QualityModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const isQualified = order.verdict === 'DATA_QUALIFIED';
  const isRejected = order.verdict === 'DATA_REJECTED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-600 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-2xl border ${
            isQualified 
              ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30' 
              : isRejected 
              ? 'bg-accent-rose/10 text-accent-rose border-accent-rose/30' 
              : 'bg-primary-500/10 text-primary-400 border-primary-500/30'
          }`}>
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">AI Jury Adjudication Audit</h2>
              <span className="text-xs font-mono text-slate-400">#{order.order_id}</span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-validator LLM consensus executed on GenLayer studionet
            </p>
          </div>
        </div>

        {/* Big Verdict Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between mb-6 ${
          isQualified 
            ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald' 
            : isRejected 
            ? 'bg-accent-rose/10 border-accent-rose/30 text-accent-rose' 
            : 'bg-dark-700/50 border-dark-600 text-slate-300'
        }`}>
          <div className="flex items-center space-x-3">
            {isQualified && <CheckCircle2 className="w-7 h-7" />}
            {isRejected && <XCircle className="w-7 h-7" />}
            {!isQualified && !isRejected && <Cpu className="w-7 h-7 text-primary-400" />}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider block opacity-80">
                Consensus Verdict
              </span>
              <span className="text-lg font-bold font-mono tracking-wide">
                {order.verdict}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase tracking-wider block opacity-80">Payout Status</span>
            <span className="text-sm font-semibold font-mono text-white">
              {isQualified ? `${formatGen(order.escrow_amount)} GEN -> Provider` : isRejected ? `${formatGen(order.escrow_amount)} GEN -> Refunded` : 'In Escrow'}
            </span>
          </div>
        </div>

        {/* Score Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Schema Score */}
          <div className="bg-dark-900/60 border border-dark-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Schema Alignment</span>
              <span className="text-xs font-mono font-bold text-primary-400">
                {order.schema_score}/100
              </span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  order.schema_score >= 70 ? 'bg-accent-emerald' : 'bg-accent-rose'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, order.schema_score))}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Format & syntax parseability</p>
          </div>

          {/* Quality Score */}
          <div className="bg-dark-900/60 border border-dark-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Semantic Quality</span>
              <span className="text-xs font-mono font-bold text-accent-cyan">
                {order.quality_score}/100
              </span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  order.quality_score >= 70 ? 'bg-accent-emerald' : 'bg-accent-rose'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, order.quality_score))}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Depth, accuracy & anti-spam</p>
          </div>

          {/* Confidence */}
          <div className="bg-dark-900/60 border border-dark-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Jury Confidence</span>
              <span className="text-xs font-mono font-bold text-accent-amber">
                {order.confidence}%
              </span>
            </div>
            <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-amber transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, order.confidence))}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Validator node convergence</p>
          </div>
        </div>

        {/* Detailed AI Reasoning */}
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-4 mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>On-Chain Jury Assessment</span>
          </label>
          <p className="text-sm text-slate-200 leading-relaxed font-mono bg-dark-800/80 p-3.5 rounded-xl border border-dark-700">
            {order.reason || 'No assessment recorded.'}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="space-y-2.5 text-xs border-t border-dark-700 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Deliverable Sample URL:</span>
            {order.sample_dataset_url ? (
              <a
                href={order.sample_dataset_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary-400 hover:underline flex items-center space-x-1 font-mono truncate max-w-xs"
              >
                <span className="truncate">{order.sample_dataset_url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            ) : (
              <span className="text-slate-500 italic">Not submitted</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Buyer:</span>
            <span className="font-mono text-slate-200">{shortenAddress(order.buyer)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Provider:</span>
            <span className="font-mono text-slate-200">{shortenAddress(order.provider)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-200 text-sm font-semibold transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
