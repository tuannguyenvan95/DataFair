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
  Zap,
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

  const isCode = order.spec_requirements.toLowerCase().includes('code') || order.spec_requirements.toLowerCase().includes('python');
  const isMedical = order.spec_requirements.toLowerCase().includes('med') || order.spec_requirements.toLowerCase().includes('clinical');

  return (
    <div className="holo-card rounded-3xl p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Status Ambient Laser Stripe */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 ${
          order.status === 2
            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-[0_0_15px_#10b981]'
            : order.status === 3
            ? 'bg-gradient-to-r from-rose-500 via-red-400 to-rose-500 shadow-[0_0_15px_#f43f5e]'
            : order.status === 1
            ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_15px_#f59e0b]'
            : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 shadow-[0_0_15px_#00e5ff]'
        }`}
      ></div>

      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-base font-black text-white group-hover:text-cyan-300 transition tracking-wide drop-shadow">
              #{order.order_id}
            </span>
            <span
              className={`px-3 py-1 text-[10px] font-mono font-black uppercase tracking-wider rounded-full border shadow-sm ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Bounty Tag with Glow */}
          <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl bg-dark-950 border border-cyan-400/40 text-cyan-300 font-mono font-black text-sm shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Coins className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_#f59e0b]" />
            <span>{formatGen(order.escrow_amount)} GEN</span>
          </div>
        </div>

        {/* Category & Block Metadata Pill */}
        <div className="mb-4 flex items-center justify-between text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-dark-900 border border-dark-700 text-cyan-200/80 font-bold uppercase">
            {isCode ? 'Code Benchmark' : isMedical ? 'BioMed QA' : 'LLM Instruction'}
          </span>
          <span className="text-slate-500 font-mono">
            Block #{order.created_at_block}
          </span>
        </div>

        {/* Requirements Box */}
        <div className="mb-4">
          <p className="text-[11px] text-cyan-300/80 font-mono font-bold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <span>Procurement Rubric</span>
          </p>
          <p className="text-xs text-slate-200 bg-dark-950/85 p-3.5 rounded-2xl border border-dark-750 line-clamp-3 leading-relaxed font-mono shadow-inner">
            {order.spec_requirements}
          </p>
        </div>

        {/* Deliverable Link if available */}
        {order.sample_dataset_url && (
          <div className="mb-4 p-3 rounded-2xl bg-dark-950/70 border border-cyan-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Deliverable URL:</span>
            <a
              href={order.sample_dataset_url}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-white flex items-center space-x-1.5 font-mono truncate max-w-[210px] font-bold"
            >
              <span className="truncate">{order.sample_dataset_url}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
            </a>
          </div>
        )}

        {/* Counterparties */}
        <div className="grid grid-cols-2 gap-3 text-xs border-t border-dark-750/70 pt-3.5 mb-5 font-mono">
          <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Trainer (Buyer)</span>
            <span className="text-slate-200 truncate block font-bold mt-0.5">
              {shortenAddress(order.buyer)} {isBuyer && '(You)'}
            </span>
          </div>
          <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Curator (Provider)</span>
            <span className="text-slate-200 truncate block font-bold mt-0.5">
              {shortenAddress(order.provider)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footers */}
      <div className="border-t border-dark-750/70 pt-4 flex items-center justify-between gap-3">
        {/* Status 0: OPEN */}
        {order.status === 0 && (
          <>
            {isBuyer && (
              <button
                onClick={() => onCancel(order.order_id)}
                disabled={isBusy}
                className="px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
            <button
              onClick={() => onOpenSubmit(order.order_id)}
              disabled={isBusy}
              className="ml-auto btn-vip-pro px-6 py-2.5 rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Deliverable</span>
            </button>
          </>
        )}

        {/* Status 1: IN_REVIEW */}
        {order.status === 1 && (
          <button
            onClick={() => onAdjudicate(order.order_id)}
            disabled={isBusy}
            className="w-full btn-vip-pro py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(0,229,255,0.6)] cursor-pointer disabled:opacity-50"
          >
            <Scale className="w-4 h-4 animate-pulse" />
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
                <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_#10b981]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 drop-shadow-[0_0_8px_#f43f5e]" />
              )}
              <span
                className={`text-xs font-mono font-black tracking-wide ${
                  order.status === 2 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {order.verdict}
              </span>
            </div>

            <button
              onClick={() => onViewAudit(order)}
              className="btn-cyber-outline px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Court Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Status 4: CANCELLED */}
        {order.status === 4 && (
          <div className="w-full text-center py-2 bg-dark-900 rounded-2xl border border-dark-750">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
              Order Cancelled & Refunded
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
