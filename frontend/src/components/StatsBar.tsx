import React from 'react';
import { Layers, Lock, CheckCircle2, Cpu } from 'lucide-react';
import { ContractStats, formatGen } from '../utils/helpers';

interface StatsBarProps {
  stats: ContractStats | null;
  loading: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Orders */}
      <div className="bg-dark-800/60 backdrop-blur border border-dark-700 rounded-2xl p-5 relative overflow-hidden group hover:border-primary-500/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Orders
          </span>
          <div className="p-2 rounded-xl bg-primary-500/10 text-primary-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold font-mono text-white">
            {loading ? '...' : stats ? stats.total_orders : '0'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Dataset procurement bounties</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500/40 to-primary-500/0 group-hover:via-primary-500 transition-all"></div>
      </div>

      {/* Total Escrow Locked */}
      <div className="bg-dark-800/60 backdrop-blur border border-dark-700 rounded-2xl p-5 relative overflow-hidden group hover:border-accent-cyan/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Escrow Locked
          </span>
          <div className="p-2 rounded-xl bg-accent-cyan/10 text-accent-cyan">
            <Lock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold font-mono text-white flex items-baseline space-x-1.5">
            <span>{loading ? '...' : stats ? formatGen(stats.total_escrow_locked) : '0'}</span>
            <span className="text-sm font-normal text-slate-400">GEN</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Guaranteed in smart escrow</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/40 to-accent-cyan/0 group-hover:via-accent-cyan transition-all"></div>
      </div>

      {/* Total Settled */}
      <div className="bg-dark-800/60 backdrop-blur border border-dark-700 rounded-2xl p-5 relative overflow-hidden group hover:border-accent-emerald/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Orders Settled
          </span>
          <div className="p-2 rounded-xl bg-accent-emerald/10 text-accent-emerald">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold font-mono text-white">
            {loading ? '...' : stats ? stats.total_orders_settled : '0'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Automatically paid or refunded</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-emerald/0 via-accent-emerald/40 to-accent-emerald/0 group-hover:via-accent-emerald transition-all"></div>
      </div>

      {/* Jury Engine */}
      <div className="bg-dark-800/60 backdrop-blur border border-dark-700 rounded-2xl p-5 relative overflow-hidden group hover:border-accent-amber/40 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Adjudication Mode
          </span>
          <div className="p-2 rounded-xl bg-accent-amber/10 text-accent-amber">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xl font-bold text-slate-100 flex items-center space-x-1.5">
            <span>Optimistic AI</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Multi-LLM Semantic Consensus</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-amber/0 via-accent-amber/40 to-accent-amber/0 group-hover:via-accent-amber transition-all"></div>
      </div>
    </div>
  );
};
