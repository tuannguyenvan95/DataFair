import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Scale,
  Handshake,
  UserCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { DatasetOrderData, formatGen, shortenAddress } from '../utils/helpers';

interface DisputeModalProps {
  isOpen: boolean;
  order: DatasetOrderData | null;
  currentUser: string | null;
  onClose: () => void;
  onFileDispute: (orderId: string, reason: string) => Promise<void>;
  onResolveDispute: (orderId: string, settlementType: string) => Promise<void>;
  isProcessing: boolean;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  order,
  currentUser,
  onClose,
  onFileDispute,
  onResolveDispute,
  isProcessing,
}) => {
  const [disputeReason, setDisputeReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const isBuyer = currentUser && order.buyer.toLowerCase() === currentUser.toLowerCase();
  const isProvider = currentUser && order.provider.toLowerCase() === currentUser.toLowerCase();
  const isParticipant = isBuyer || isProvider;
  const isDisputed = order.status === 7;

  const handleFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!disputeReason.trim()) {
      setError('Please provide a specific justification for contesting this adjudication.');
      return;
    }
    try {
      await onFileDispute(order.order_id, disputeReason.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to file dispute.');
    }
  };

  const handleResolve = async (type: string) => {
    setError(null);
    try {
      await onResolveDispute(order.order_id, type);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Dispute resolution transaction failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="holo-card rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black font-display text-white tracking-tight">
              Bilateral Dispute & Appeals Chamber
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Order: <span className="text-cyan-400 font-bold">#{order.order_id}</span> • Escrow: {formatGen(order.escrow_amount)} GEN
            </p>
          </div>
        </div>

        {/* Not Disputed Yet -> Form to File Dispute */}
        {!isDisputed ? (
          <form onSubmit={handleFile} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed font-mono">
              <span className="font-bold block mb-1">⚖️ Fair Appeal Protection:</span>
              Either party may contest the AI verdict if data delivery was improperly evaluated. Filing an appeal pauses automatic settlement and opens bilateral resolution.
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Appeal Justification & Counter-Evidence
              </label>
              <textarea
                rows={4}
                required
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Explain why the verdict was flawed (e.g. valid schema keys overlooked, URL misparsed, or partial compliance)..."
                className="w-full bg-dark-950 border border-dark-750 rounded-2xl p-4 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none shadow-inner"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="btn-cyber-outline px-5 py-2.5 rounded-2xl text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !isParticipant}
                className="btn-vip-pro px-6 py-2.5 rounded-2xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Confirming in MetaMask...' : 'Open Bilateral Dispute'}
              </button>
            </div>
          </form>
        ) : (
          /* Order Already in DISPUTED State -> Settle Options */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-dark-900 border border-amber-500/30 font-mono text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-amber-400 font-bold mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>CASE CURRENTLY IN DISPUTE</span>
              </div>
              <p className="bg-dark-950 p-3 rounded-xl border border-dark-750 text-slate-200">
                {order.reason}
              </p>
              {order.dispute_approved_by && (
                <p className="mt-2 text-[11px] text-cyan-400">
                  ⚡ 50/50 Split Approved by: {shortenAddress(order.dispute_approved_by)} (Awaiting counterparty)
                </p>
              )}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Bilateral Resolution Options
              </span>

              {/* Option 1: 50/50 Mutual Split */}
              <button
                onClick={() => handleResolve('MUTUAL_SPLIT')}
                disabled={isProcessing || !isParticipant}
                className="w-full p-4 rounded-2xl border border-cyan-500/30 bg-dark-900 hover:bg-dark-850 hover:border-cyan-400 flex items-center justify-between text-left transition group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white block group-hover:text-cyan-400">
                      Approve 50 / 50 Escrow Split
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Requires 2-of-2 mutual approval from both Buyer and Curator.
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition" />
              </button>

              {/* Option 2: Concession */}
              {isBuyer && (
                <button
                  onClick={() => handleResolve('BUYER_CONCEDE')}
                  disabled={isProcessing}
                  className="w-full p-4 rounded-2xl border border-emerald-500/30 bg-dark-900 hover:bg-dark-850 hover:border-emerald-400 flex items-center justify-between text-left transition group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-white block group-hover:text-emerald-400">
                        Voluntarily Concede 100% to Provider
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Accept delivery and release full escrow to Data Curator.
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
                </button>
              )}

              {isProvider && (
                <button
                  onClick={() => handleResolve('PROVIDER_CONCEDE')}
                  disabled={isProcessing}
                  className="w-full p-4 rounded-2xl border border-rose-500/30 bg-dark-900 hover:bg-dark-850 hover:border-rose-400 flex items-center justify-between text-left transition group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-white block group-hover:text-rose-400">
                        Voluntarily Concede 100% Refund to Buyer
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Withdraw claim and return full escrow back to Buyer.
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition" />
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
