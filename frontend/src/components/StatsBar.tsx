import React from 'react';
import { Layers, Lock, CheckCircle2, Cpu, Activity, Zap } from 'lucide-react';
import { ContractStats, formatGen } from '../utils/helpers';

interface StatsBarProps {
  stats: ContractStats | null;
  loading: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Bounties */}
      <div className="glass-panel rounded-3xl p-5 relative overflow-hidden group hover:border-cyber-blue/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Total Bounties
          </span>
          <div className="p-2.5 rounded-xl bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black font-mono text-white tracking-tight">
            {loading ? '...' : stats ? stats.total_orders : '0'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Dataset procurement orders</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-blue/0 via-cyber-blue/40 to-cyber-blue/0 group-hover:via-cyber-blue transition-all"></div>
      </div>

      {/* Escrow Locked */}
      <div className="glass-panel rounded-3xl p-5 relative overflow-hidden group hover:border-cyber-neon/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Escrow Locked
          </span>
          <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <Lock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black font-mono text-white flex items-baseline space-x-1.5 tracking-tight">
            <span>{loading ? '...' : stats ? formatGen(stats.total_escrow_locked) : '0'}</span>
            <span className="text-xs font-mono text-cyber-neon">GEN</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Protected in smart escrow</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500/40 to-primary-500/0 group-hover:via-primary-500 transition-all"></div>
      </div>

      {/* Orders Settled */}
      <div className="glass-panel rounded-3xl p-5 relative overflow-hidden group hover:border-accent-emerald/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            Settled by Jury
          </span>
          <div className="p-2.5 rounded-xl bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black font-mono text-white tracking-tight">
            {loading ? '...' : stats ? stats.total_orders_settled : '0'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">Zero counterparty fraud</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-emerald/0 via-accent-emerald/40 to-accent-emerald/0 group-hover:via-accent-emerald transition-all"></div>
      </div>

      {/* Consensus Engine Status */}
      <div className="glass-panel rounded-3xl p-5 relative overflow-hidden group hover:border-cyber-purple/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            GenLayer Jury
          </span>
          <div className="p-2.5 rounded-xl bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/20">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-pulse"></span>
            <p className="text-xl font-black font-mono text-slate-100 tracking-tight">
              Optimistic AI
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Multi-LLM Semantic Equivalence
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-purple/0 via-cyber-purple/40 to-cyber-purple/0 group-hover:via-cyber-purple transition-all"></div>
      </div>
    </div>
  );
};
