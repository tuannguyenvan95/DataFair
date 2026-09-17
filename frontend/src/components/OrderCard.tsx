import React from 'react';
import {
  Coins,
  ArrowRight,
  ExternalLink,
  Scale,
  Ban,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  FileCode2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { DatasetOrderData, formatGen, shortenAddress, getStatusInfo } from '../utils/helpers';

interface OrderCardProps {
  order: DatasetOrderData;
  currentUser: string | null;
  onOpenSubmit: (orderId: string) => void;
  onAdjudicate: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onViewAudit: (order: DatasetOrderData) => void;
  isProcessing: boolean;
  activeProcessingId: string | null;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  currentUser,
  onOpenSubmit,
  onAdjudicate,
  onCancel,
  onViewAudit,
  isProcessing,
  activeProcessingId,
}) => {
  const statusInfo = getStatusInfo(order.status);
  const isBuyer = currentUser && order.buyer.toLowerCase() === currentUser.toLowerCase();
  const isBusy = isProcessing && activeProcessingId === order.order_id;

  // Infer tag from spec
  const isCode = order.spec_requirements.toLowerCase().includes('code') || order.spec_requirements.toLowerCase().includes('python');
  const isMedical = order.spec_requirements.toLowerCase().includes('med') || order.spec_requirements.toLowerCase().includes('clinical');
  const isNLP = !isCode && !isMedical;

  return (
    <div className="glass-panel-interactive rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-all ${
          order.status === 2
            ? 'bg-accent-emerald'
            : order.status === 3
            ? 'bg-accent-rose'
            : order.status === 1
            ? 'bg-accent-amber'
            : 'bg-cyber-blue/60 group-hover:bg-cyber-blue'
        }`}
      ></div>

      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-black text-white group-hover:text-cyber-blue transition">
              #{order.order_id}
            </span>
            <span
              className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full border ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-dark-950 border border-dark-750 text-cyber-blue font-mono font-black text-sm shadow-inner">
            <Coins className="w-3.5 h-3.5" />
            <span>{formatGen(order.escrow_amount)} GEN</span>
          </div>
        </div>

        {/* Category Pill */}
        <div className="mb-3 flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-dark-800 text-slate-400 border border-dark-700">
            {isCode ? 'Code Benchmark' : isMedical ? 'BioMed QA' : 'LLM Instruction'}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Block: #{order.created_at_block}
          </span>
        </div>

        {/* Requirements Box */}
        <div className="mb-4">
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
            Procurement Rubric
          </p>
          <p className="text-xs text-slate-300 bg-dark-950/70 p-3.5 rounded-xl border border-dark-750/80 line-clamp-3 leading-relaxed font-mono">
            {order.spec_requirements}
          </p>
        </div>

        {/* Deliverable Link if available */}
        {order.sample_dataset_url && (
          <div className="mb-4 p-2.5 rounded-xl bg-dark-950/50 border border-dark-750 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Deliverable URL:</span>
            <a
              href={order.sample_dataset_url}
              target="_blank"
              rel="noreferrer"
              className="text-cyber-blue hover:underline flex items-center space-x-1 font-mono truncate max-w-[200px]"
            >
              <span className="truncate">{order.sample_dataset_url}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        )}

        {/* Counterparties */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-dark-750/60 pt-3 mb-5 font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Trainer (Buyer)</span>
            <span className="text-slate-300 truncate block">
              {shortenAddress(order.buyer)} {isBuyer && '(You)'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Curator (Provider)</span>
            <span className="text-slate-300 truncate block">
              {shortenAddress(order.provider)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footers */}
      <div className="border-t border-dark-750/60 pt-3.5 flex items-center justify-between gap-2">
        {/* Status 0: OPEN */}
        {order.status === 0 && (
          <>
            {isBuyer && (
              <button
                onClick={() => onCancel(order.order_id)}
                disabled={isBusy}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-accent-rose hover:bg-dark-800 transition flex items-center space-x-1 disabled:opacity-50 font-mono"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
            <button
              onClick={() => onOpenSubmit(order.order_id)}
              disabled={isBusy}
              className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-cyber-blue hover:from-primary-500 hover:to-cyan-400 text-dark-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Submit Deliverable</span>
            </button>
          </>
        )}

        {/* Status 1: IN_REVIEW */}
        {order.status === 1 && (
          <button
            onClick={() => onAdjudicate(order.order_id)}
            disabled={isBusy}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-blue via-primary-500 to-cyber-purple hover:opacity-90 text-dark-950 font-bold text-xs shadow-lg shadow-cyber-blue/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Scale className="w-4 h-4" />
            <span>
              {isBusy ? 'AI Jury Adjudicating...' : 'Convene AI Jury (Adjudicate)'}
            </span>
          </button>
        )}

        {/* Status 2: QUALIFIED or Status 3: REJECTED */}
        {(order.status === 2 || order.status === 3) && (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {order.status === 2 ? (
                <CheckCircle className="w-4 h-4 text-accent-emerald" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-accent-rose" />
              )}
              <span
                className={`text-xs font-mono font-bold ${
                  order.status === 2 ? 'text-accent-emerald' : 'text-accent-rose'
                }`}
              >
                {order.verdict}
              </span>
            </div>

            <button
              onClick={() => onViewAudit(order)}
              className="px-3.5 py-1.5 rounded-xl border border-dark-700 bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-medium transition flex items-center space-x-1 font-mono"
            >
              <span>Court Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Status 4: CANCELLED */}
        {order.status === 4 && (
          <div className="w-full text-center py-1">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Order Cancelled & Refunded
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
