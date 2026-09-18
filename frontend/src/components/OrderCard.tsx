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
  Lock,
} from 'lucide-react';
import { DatasetOrderData, formatGen, shortenAddress, getStatusInfo } from '../utils/helpers';

interface OrderCardProps {
  order: DatasetOrderData;
  currentUser: string | null;
  onOpenSubmit: (orderId: string) => void;
  onAdjudicate: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onViewAudit: (order: DatasetOrderData) => void;
  onOpenDispute: (order: DatasetOrderData) => void;
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
  onOpenDispute,
  isProcessing,
  activeProcessingId,
}) => {
  const statusInfo = getStatusInfo(order.status);
  const isBuyer = currentUser && order.buyer.toLowerCase() === currentUser.toLowerCase();
  const isProvider = currentUser && order.provider.toLowerCase() === currentUser.toLowerCase();
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
            : order.status === 5
            ? 'bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 shadow-[0_0_15px_#a855f7]'
            : order.status === 6
            ? 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 shadow-[0_0_15px_#eab308]'
            : order.status === 7
            ? 'bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 shadow-[0_0_20px_#f43f5e] animate-pulse'
            : order.status === 1
            ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_15px_#f59e0b]'
            : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 shadow-[0_0_15px_#00e5ff]'
        }`}
      ></div>

      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="font-mono text-base font-black text-white group-hover:text-cyan-300 transition tracking-wide drop-shadow">
              #{order.order_id}
            </span>
            <span
              className={`px-3 py-1 text-[10px] font-mono font-black uppercase tracking-wider rounded-full border shadow-sm ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>
            {isBuyer && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                👑 Your Bounty (Buyer)
              </span>
            )}
            {isProvider && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                ⚡ Your Claim (Curator)
              </span>
            )}
            {!isBuyer && !isProvider && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-800/80 text-slate-400 border border-slate-700/60">
                🌐 Open Bounty
              </span>
            )}
          </div>

          {/* Bounty Tag with Glow */}
          <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl bg-dark-950 border border-cyan-400/40 text-cyan-300 font-mono font-black text-sm shadow-[0_0_15px_rgba(0,229,255,0.2)] flex-shrink-0">
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
            {order.attempts ? `Attempt ${order.attempts}/2 • ` : ''}Block #{order.created_at_block}
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

        {/* Bilateral Fair Play Safeguards Bar */}
        <div className="mb-4 grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center">
          <div className="bg-dark-950/90 border border-dark-750 px-2 py-1.5 rounded-xl text-slate-400" title="100% Escrow Refund to Buyer if quality fails or spam detected">
            🛡️ <span className="text-slate-200 font-bold">100% Refund</span> &lt;60%
          </div>
          <div className="bg-dark-950/90 border border-purple-500/25 px-2 py-1.5 rounded-xl text-purple-300" title="Curator receives 65% compensation for partial adherence (score 60-79%)">
            ⚖️ <span className="text-purple-300 font-bold">65/35 Split</span> 60-79%
          </div>
          <div className="bg-dark-950/90 border border-yellow-500/25 px-2 py-1.5 rounded-xl text-yellow-300" title="1 Retry grace period granted before any slashing">
            🔄 <span className="text-yellow-300 font-bold">Grace Retry</span> Att. 2
          </div>
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

        {/* Two-Sided Reason / Split Info Banner if applicable */}
        {order.status === 5 && (
          <div className="mb-4 p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-[11px] font-mono text-purple-200 flex items-center justify-between">
            <span>⚖️ 65% Curator ({(Number(formatGen(order.escrow_amount)) * 0.65).toFixed(2)} GEN)</span>
            <span>35% Buyer ({(Number(formatGen(order.escrow_amount)) * 0.35).toFixed(2)} GEN)</span>
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
              {order.provider && order.provider !== '0x0000000000000000000000000000000000000000'
                ? `${shortenAddress(order.provider)} ${isProvider ? '(You)' : ''}`
                : 'Unclaimed'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footers */}
      <div className="border-t border-dark-750/70 pt-4 flex items-center justify-between gap-3">
        {/* Status 0: OPEN */}
        {order.status === 0 && (
          <>
            {isBuyer ? (
              <div className="w-full flex items-center justify-between gap-3">
                <button
                  onClick={() => onCancel(order.order_id)}
                  disabled={isBusy}
                  className="px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  title="Only available while Unclaimed. Irrevocably locked once a curator submits to prevent rug pulls."
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancel (Unclaimed Only)</span>
                </button>
                <div className="text-[11px] font-mono text-cyan-300/80 bg-cyan-950/50 border border-cyan-500/30 px-3 py-2 rounded-xl flex items-center space-x-1.5" title="Creators cannot fulfill own bounties">
                  <span>🛡️ Awaiting Curator</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onOpenSubmit(order.order_id)}
                disabled={isBusy}
                className="w-full btn-vip-pro py-2.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Submit Deliverable (Claim {formatGen(order.escrow_amount)} GEN)</span>
              </button>
            )}
          </>
        )}

        {/* Status 1: IN_REVIEW */}
        {order.status === 1 && (
          <div className="w-full space-y-2">
            <div className="w-full p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Escrow Irrevocably Locked (No Refund/Cancel Allowed)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded">Anti-Rug Protection</span>
            </div>
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
          </div>
        )}

        {/* Status 2: QUALIFIED, Status 3: REJECTED, Status 5: PARTIAL_SPLIT */}
        {(order.status === 2 || order.status === 3 || order.status === 5) && (
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 truncate">
              {order.status === 2 ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 drop-shadow-[0_0_8px_#10b981]" />
              ) : order.status === 5 ? (
                <Scale className="w-4 h-4 text-purple-400 flex-shrink-0 drop-shadow-[0_0_8px_#a855f7]" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 drop-shadow-[0_0_8px_#f43f5e]" />
              )}
              <span
                className={`text-[11px] font-mono font-black tracking-wide truncate ${
                  order.status === 2
                    ? 'text-emerald-400'
                    : order.status === 5
                    ? 'text-purple-400'
                    : 'text-rose-400'
                }`}
              >
                {order.verdict}
              </span>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => onOpenDispute(order)}
                title="File bilateral appeal against verdict"
                className="px-2.5 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/20 text-[11px] font-mono font-bold transition"
              >
                Appeal
              </button>
              <button
                onClick={() => onViewAudit(order)}
                className="btn-cyber-outline px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>Audit</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Status 6: RETRY_GRANTED */}
        {order.status === 6 && (
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 text-yellow-400 text-xs font-mono font-bold">
              <Zap className="w-4 h-4 animate-bounce" />
              <span>Grace Retry (Attempt 2/2)</span>
            </div>
            {isProvider ? (
              <button
                onClick={() => onOpenSubmit(order.order_id)}
                disabled={isBusy}
                className="btn-vip-pro px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Resubmit Fix</span>
              </button>
            ) : isBuyer ? (
              <span className="text-[11px] font-mono text-yellow-300/80 bg-yellow-950/40 border border-yellow-500/30 px-3 py-1.5 rounded-xl">
                Curator Fixing Deliverable
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 bg-dark-900 border border-dark-750 px-3 py-1.5 rounded-xl">
                Curator Grace Period Active
              </span>
            )}
          </div>
        )}

        {/* Status 7: DISPUTED */}
        {order.status === 7 && (
          <button
            onClick={() => onOpenDispute(order)}
            className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition cursor-pointer"
          >
            <Scale className="w-4 h-4 animate-pulse text-amber-400" />
            <span>Enter Bilateral Dispute Chamber</span>
          </button>
        )}

        {/* Status 4: CANCELLED */}
        {order.status === 4 && (
          <div className="w-full text-center py-2 bg-dark-900 rounded-2xl border border-dark-750">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
              Order Cancelled & Escrow Refunded
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
