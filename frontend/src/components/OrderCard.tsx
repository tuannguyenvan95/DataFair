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

  return (
    <div className="bg-dark-800/80 backdrop-blur border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-bold text-white group-hover:text-primary-400 transition">
              #{order.order_id}
            </span>
            <span className={`px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${statusInfo.badgeClass}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 font-mono font-bold text-sm">
            <Coins className="w-3.5 h-3.5" />
            <span>{formatGen(order.escrow_amount)} GEN</span>
          </div>
        </div>

        {/* Spec Requirements Preview */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
            Requirements Spec
          </p>
          <p className="text-xs text-slate-200 bg-dark-900/60 p-3 rounded-xl border border-dark-700/60 line-clamp-3 leading-relaxed font-mono">
            {order.spec_requirements}
          </p>
        </div>

        {/* Deliverable URL if submitted */}
        {order.sample_dataset_url && (
          <div className="mb-4 p-2.5 rounded-xl bg-dark-900/40 border border-dark-700 flex items-center justify-between text-xs">
            <span className="text-slate-400">Sample URL:</span>
            <a
              href={order.sample_dataset_url}
              target="_blank"
              rel="noreferrer"
              className="text-primary-400 hover:underline flex items-center space-x-1 font-mono truncate max-w-[200px]"
            >
              <span className="truncate">{order.sample_dataset_url}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        )}

        {/* Participants */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-dark-700/60 pt-3 mb-4">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Buyer</span>
            <span className="font-mono text-slate-300">
              {shortenAddress(order.buyer)} {isBuyer && '(You)'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Provider</span>
            <span className="font-mono text-slate-300">{shortenAddress(order.provider)}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-dark-700/60 pt-3 flex items-center justify-between gap-2">
        {/* Status 0: OPEN */}
        {order.status === 0 && (
          <>
            {isBuyer && (
              <button
                onClick={() => onCancel(order.order_id)}
                disabled={isBusy}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-accent-rose hover:bg-dark-700/60 transition flex items-center space-x-1 disabled:opacity-50"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
            <button
              onClick={() => onOpenSubmit(order.order_id)}
              disabled={isBusy}
              className="ml-auto px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-lg shadow-primary-600/20 transition flex items-center space-x-1.5 disabled:opacity-50"
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
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-primary-600 hover:from-cyan-400 hover:to-primary-500 text-dark-900 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Scale className="w-4 h-4" />
            <span>
              {isBusy ? 'AI Jury Adjudicating...' : 'Adjudicate On-Chain (AI Jury)'}
            </span>
          </button>
        )}

        {/* Status 2: QUALIFIED or Status 3: REJECTED */}
        {(order.status === 2 || order.status === 3) && (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              {order.status === 2 ? (
                <CheckCircle className="w-4 h-4 text-accent-emerald" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-accent-rose" />
              )}
              <span className={`text-xs font-mono font-bold ${
                order.status === 2 ? 'text-accent-emerald' : 'text-accent-rose'
              }`}>
                {order.verdict}
              </span>
            </div>

            <button
              onClick={() => onViewAudit(order)}
              className="px-3 py-1.5 rounded-xl border border-dark-600 bg-dark-700/60 hover:bg-dark-600 text-slate-200 text-xs font-medium transition flex items-center space-x-1"
            >
              <span>View Audit</span>
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
